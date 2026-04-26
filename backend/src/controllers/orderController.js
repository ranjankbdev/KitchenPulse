import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import crypto from 'crypto';
import Shop from '../models/shopModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Item from '../models/itemModel.js';
import DeliveryAssignment from '../models/deliveryAssignment.js';
import { sendOtpEmail } from '../utils/emailService.js';
import RazorPay from 'razorpay';
import Config from '../config/index.js';
import Rating from '../models/ratingModel.js';

let instance = new RazorPay({
  key_id: Config.razorpayKeyId,
  key_secret: Config.razorpayKeySecret,
});

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERYPARTNER_COMMISSION = 30;

const createOrder = async (req, res) => {
  const { cartItems, paymentMethod, deliveryAddress } = req.body;

  // group items by shop
  const groupItemsByShop = cartItems.reduce((acc, item) => {
    const shopId = item.shop;
    acc[shopId] = acc[shopId] || [];
    acc[shopId].push(item);
    return acc;
  }, {});

  // build shopOrders
  const shopOrders = await Promise.all(
    Object.entries(groupItemsByShop).map(async ([shopId, items]) => {
      const shop = await Shop.findById(shopId);
      if (!shop) throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop not found!');

      // fetch all items
      const itemIds = items.map((i) => i._id);
      const dbItems = await Item.find({ _id: { $in: itemIds } });
      // creating lookup map for fast access
      const dbItemMap = {};
      dbItems.forEach((item) => (dbItemMap[item._id.toString()] = item));

      let subtotal = 0;
      const shopOrderItems = [];

      for (const i of items) {
        const dbItem = dbItemMap[i._id.toString()];
        if (!dbItem) throw new ExpressError(StatusCodes.NOT_FOUND, 'Item not found!');

        // verify item belongs to this shop
        if (dbItem.shop.toString() !== shopId) {
          throw new ExpressError(StatusCodes.BAD_REQUEST, 'Item does not belong to this shop!');
        }

        subtotal += dbItem.price * i.quantity;
        // store item
        shopOrderItems.push({
          item: dbItem._id,
          name: dbItem.name,
          price: dbItem.price,
          quantity: i.quantity,
        });
      }

      return { shop: shop._id, owner: shop.owner, subtotal, shopOrderItems };
    })
  );

  // calculate subtotal from all shopOrders
  const subtotal = shopOrders.reduce((sum, o) => sum + o.subtotal, 0);

  // calculate delivery charge
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;

  // final amount
  const totalAmount = subtotal + deliveryCharge;

  const orderData = {
    user: req.user.id,
    paymentMethod,
    deliveryAddress,
    deliveryCharge,
    totalAmount,
    shopOrders,
  };

  if (paymentMethod === 'online') {
    // create Razorpay order
    const razorpayOrder = await instance.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // save order in DB with razorpayOrderId
    const newOrder = await Order.create({
      ...orderData,
      razorpayOrderId: razorpayOrder.id,
      isPaid: false,
    });

    // send Razorpay details
    return res.status(StatusCodes.CREATED).json({
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: Config.razorpayKeyId,
    });
  }

  // COD — save and return
  const newOrder = await Order.create(orderData);
  // populate
  const populatedOrder = await Order.findById(newOrder._id)
    .populate('shopOrders.shopOrderItems.item', 'name imageUrl price')
    .populate('shopOrders.shop', 'name');

  return res.status(StatusCodes.CREATED).json(populatedOrder);
};

const verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

  // verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  // hash it with our secret key
  const expectedSignature = crypto
    .createHmac('sha256', Config.razorpayKeySecret)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Invalid payment signature');
  }

  const order = await Order.findById(orderId);

  if (!order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found');

  // prevent duplicate verification
  if (order.isPaid) throw new ExpressError(StatusCodes.BAD_REQUEST, 'Order already paid');

  // verify Razorpay order matches
  if (order.razorpayOrderId !== razorpay_order_id) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Order mismatch');
  }

  // mark payment success
  order.shopOrders.forEach((so) => (so.isPaid = true));
  order.isPaid = true;
  order.razorpayPaymentId = razorpay_payment_id;
  await order.save();

  // populate order
  const populatedOrder = await Order.findById(order._id)
    .populate('user', 'fullName email mobileNumber')
    .populate('shopOrders.shop', 'name')
    .populate('shopOrders.owner', 'fullName socketId')
    .populate('shopOrders.shopOrderItems.item', 'name imageUrl price');
  return res.status(StatusCodes.OK).json(populatedOrder);
};

const getOrders = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');

  if (user.role === 'user') {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('shopOrders.shop', 'name')
      .populate('shopOrders.owner', 'fullName email mobileNumber')
      .populate('shopOrders.shopOrderItems.item', 'name imageUrl price ratings')
      .lean();

    // fetch all ratings
    const ratings = await Rating.find({ user: req.user.id }).lean();
    // create a map for fast lookup
    const ratingMap = new Map();
    for (const r of ratings) {
      const key = `${r.order?.toString()}-${r.item?.toString()}`;
      ratingMap.set(key, r.rating);
    }

    // loop through orders → shopOrders → items
    for (const order of orders) {
      for (const shopOrder of order.shopOrders) {
        for (const orderItem of shopOrder.shopOrderItems) {
          const itemId = orderItem.item?._id?.toString();
          // skip if itemId is invalid
          if (!itemId) continue;

          const key = `${order._id.toString()}-${itemId}`;
          // attach user's rating to each order item (for frontend use)
          orderItem.userRating = ratingMap.get(key) || null;
        }
      }
    }
    return res.status(StatusCodes.OK).json(orders);
  }

  if (user.role === 'vendor') {
    const orders = await Order.find({ 'shopOrders.owner': req.user.id })
      .sort({ createdAt: -1 })
      .populate('shopOrders.shop', 'name')
      .populate('user', 'fullName mobileNumber email')
      .populate('shopOrders.shopOrderItems.item', 'name imageUrl price')
      .populate('shopOrders.assignedDeliveryPartner', 'fullName mobileNumber email');

    // filtering only vendor-related shop orders from full order
    const filteredOrders = orders.map((order) => ({
      _id: order._id,
      paymentMethod: order.paymentMethod,
      user: order.user,
      // keeping only shops owned by current vendor
      shopOrders: order.shopOrders.filter((o) => String(o.owner) === String(req.user.id)),
      createdAt: order.createdAt,
      deliveryAddress: order.deliveryAddress,
      isPaid: order.isPaid,
      deliveryCharge: order.deliveryCharge,
    }));

    return res.status(StatusCodes.OK).json(filteredOrders);
  }
  throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
};

const statusFlow = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready_for_pickup',
  ready_for_pickup: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

// statuses only vendor can update to
const vendorAllowedStatuses = ['confirmed', 'preparing', 'ready_for_pickup'];

// statuses only delivery partner can update to
const deliveryPartnerAllowedStatuses = ['out_for_delivery', 'delivered'];

const findAvailableDeliveryPartners = async (deliveryAddress) => {
  const { longitude, latitude } = deliveryAddress;

  // find nearby partners within 5km
  const nearByPartners = await User.find({
    role: 'deliveryPartner',
    currentLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
        $maxDistance: 5000,
      },
    },
  });

  // find busy ones
  const nearByIds = nearByPartners.map((p) => p._id);
  const busyIds = await DeliveryAssignment.find({
    assignedTo: { $in: nearByIds },
    status: 'accepted',
  }).distinct('assignedTo');

  // filter out busy ones
  const busyIdSet = new Set(busyIds.map((id) => String(id)));
  return nearByPartners.filter((p) => !busyIdSet.has(String(p._id)));
};

const updateShopOrderStatus = async (req, res) => {
  const { orderId, shopId } = req.params;
  const { status } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');

  const order = await Order.findById(orderId);
  if (!order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found!');

  const shopOrder = order.shopOrders.find((o) => o.shop.toString() === shopId);
  if (!shopOrder) throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop order not found!');

  if (shopOrder.status === 'delivered') {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Order already delivered!');
  }

  // role-based status permission check
  if (user.role === 'vendor' && !vendorAllowedStatuses.includes(status)) {
    throw new ExpressError(
      StatusCodes.FORBIDDEN,
      'Vendors can only confirm, prepare or mark ready for pickup!'
    );
  }

  if (user.role === 'deliveryPartner' && !deliveryPartnerAllowedStatuses.includes(status)) {
    throw new ExpressError(
      StatusCodes.FORBIDDEN,
      'Delivery partners can only mark out for delivery or delivered!'
    );
  }
  // verify status transition is valid (no jumping, no going back)
  const allowedNext = statusFlow[shopOrder.status];
  if (status !== allowedNext) {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      `Cannot move from ${shopOrder.status} to ${status}!`
    );
  }

  shopOrder.status = status;
  let deliveryPartnersPayload = [];

  if (status === 'ready_for_pickup' && !shopOrder.deliveryAssignment) {
    const availablePartners = await findAvailableDeliveryPartners(order.deliveryAddress);
    if (availablePartners.length === 0) {
      await order.save();
      const updatedShopOrder = order.shopOrders.find((o) => o.shop.toString() === shopId);

      return res.status(StatusCodes.OK).json({
        status: updatedShopOrder.status,
        availablePartners: [],
      });
    }

    // prepare list of candidate delivery partners
    const candidates = availablePartners.map((p) => p._id);

    // create delivery assignment (broadcast to all candidates)
    const deliveryAssignment = await DeliveryAssignment.create({
      order: order._id,
      shop: shopOrder.shop,
      shopOrderId: shopOrder._id,
      broadcastedTo: candidates,
      status: 'broadcasted',
    });

    // attach assignment to shopOrder
    shopOrder.deliveryAssignment = deliveryAssignment._id;
    shopOrder.assignedDeliveryPartner = null;
    // prepare payload for frontend (basic partner info)
    deliveryPartnersPayload = availablePartners.map((p) => ({
      id: p._id,
      fullName: p.fullName,
      longitude: p.currentLocation.coordinates?.[0],
      latitude: p.currentLocation.coordinates?.[1],
      mobileNumber: p.mobileNumber,
    }));

    await deliveryAssignment.populate('order');
    await deliveryAssignment.populate('shop');
  }

  await order.save();
  const updatedShopOrder = order.shopOrders.find((o) => o.shop.toString() === shopId);

  return res.status(StatusCodes.OK).json({
    status: updatedShopOrder.status,
    availablePartners: deliveryPartnersPayload,
  });
};

const getDeliveryAssignments = async (req, res) => {
  const assignments = await DeliveryAssignment.find({
    broadcastedTo: req.user.id,
    status: 'broadcasted',
  })
    .populate('order')
    .populate('shop');

  const assignmentSummaries = assignments.map((a) => {
    const shopOrder = a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId));
    return {
      assignmentId: a._id,
      shopName: a.shop?.name,
      shopAddress: a.shop?.address,
      deliveryAddress: a.order.deliveryAddress,
      items: shopOrder?.shopOrderItems || [],
      subtotal: shopOrder?.subtotal,
    };
  });

  return res.status(StatusCodes.OK).json(assignmentSummaries);
};

const acceptDeliveryAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const assignment = await DeliveryAssignment.findById(assignmentId);
  if (!assignment) throw new ExpressError(StatusCodes.NOT_FOUND, 'Assignment not found');

  // prevent accepting already taken assignments
  if (assignment.status !== 'broadcasted') {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Assignment is expired');
  }

  const alreadyAssigned = await DeliveryAssignment.findOne({
    assignedTo: req.user.id,
    status: 'accepted',
  });
  if (alreadyAssigned) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'You are already assigned to another order');
  }

  assignment.assignedTo = req.user.id;
  assignment.status = 'accepted';
  assignment.acceptedAt = new Date();
  await assignment.save();

  const order = await Order.findById(assignment.order);
  if (!order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found');

  // update shop order with assigned partner
  const shopOrder = order.shopOrders.id(assignment.shopOrderId);
  shopOrder.assignedDeliveryPartner = req.user.id;
  shopOrder.status = 'out_for_delivery';
  await order.save();

  return res.status(StatusCodes.OK).json();
};

const getActiveDeliveryAssignment = async (req, res) => {
  const assignment = await DeliveryAssignment.findOne({
    assignedTo: req.user.id,
    status: 'accepted',
  })
    .populate('shop', 'name')
    .populate('assignedTo', 'fullName email mobileNumber currentLocation')
    .populate({
      path: 'order',
      populate: [{ path: 'user', select: 'fullName email mobileNumber currentLocation' }],
    });

  if (!assignment) throw new ExpressError(StatusCodes.NOT_FOUND, 'No active assignment found');
  if (!assignment.order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found');

  const shopOrder = assignment.order.shopOrders.find(
    (so) => String(so._id) === String(assignment.shopOrderId)
  );
  if (!shopOrder) throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop order not found');

  // extract coordinates
  const deliveryPartnerLocation = {
    lat: assignment.assignedTo.currentLocation.coordinates?.[1] || null,
    lon: assignment.assignedTo.currentLocation.coordinates?.[0] || null,
  };

  const customerLocation = {
    lat: assignment.order.deliveryAddress?.latitude || null,
    lon: assignment.order.deliveryAddress?.longitude || null,
  };

  return res.status(StatusCodes.OK).json({
    _id: assignment.order._id,
    user: assignment.order.user,
    shopOrder,
    shopName: assignment.shop?.name,
    deliveryAddress: assignment.order.deliveryAddress,
    deliveryPartnerLocation,
    customerLocation,
  });
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate('user')
    .populate('shopOrders.shop')
    .populate('shopOrders.assignedDeliveryPartner')
    .populate('shopOrders.shopOrderItems.item')
    .lean();

  if (!order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found');

  return res.status(StatusCodes.OK).json(order);
};

const sendDeliveryOtp = async (req, res) => {
  const { orderId, shopOrderId } = req.params;

  const order = await Order.findById(orderId).populate('user');
  if (!order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found');

  const shopOrder = order.shopOrders.id(shopOrderId);
  if (!shopOrder) throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop order not found');

  // only the assigned delivery partner can send OTP
  if (String(shopOrder.assignedDeliveryPartner) !== req.user.id) {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Not authorized');
  }
  if (shopOrder.status !== 'out_for_delivery') {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      'OTP allowed only when order is out for delivery'
    );
  }
  // prevent OTP spam
  if (
    shopOrder.deliveryOtp &&
    shopOrder.deliveryOtpExpiresAt &&
    shopOrder.deliveryOtpExpiresAt > Date.now()
  ) {
    const remainingMinutes = Math.ceil((shopOrder.deliveryOtpExpiresAt - Date.now()) / (1000 * 60));
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      `OTP already sent. Try again after ${remainingMinutes} minutes`
    );
  }
  // generate 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  shopOrder.deliveryOtp = otp;
  shopOrder.deliveryOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await order.save();
  await sendOtpEmail(
    order.user.email,
    'Delivery OTP',
    `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
  );

  return res.status(StatusCodes.OK).json();
};

const verifyDeliveryOtp = async (req, res) => {
  const { orderId, shopOrderId } = req.params;
  const { otp } = req.body;

  const order = await Order.findById(orderId).populate('user');
  if (!order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found');

  const shopOrder = order.shopOrders.id(shopOrderId);
  if (!shopOrder) throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop order not found');

  // only the assigned delivery partner can verify OTP
  if (String(shopOrder.assignedDeliveryPartner) !== req.user.id) {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Not authorized');
  }
  if (shopOrder.status === 'delivered') {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Order already delivered');
  }
  // check OTP
  if (
    shopOrder.deliveryOtp !== otp ||
    !shopOrder.deliveryOtpExpiresAt ||
    shopOrder.deliveryOtpExpiresAt < Date.now()
  ) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // mark delivered and clear OTP
  shopOrder.status = 'delivered';
  shopOrder.deliveredAt = new Date();
  shopOrder.deliveryOtp = null;
  shopOrder.deliveryOtpExpiresAt = null;

  if (order.paymentMethod === 'cod') {
    shopOrder.isPaid = true;
    const allPaid = order.shopOrders.every((so) => so.isPaid);
    if (allPaid) order.isPaid = true;
  }

  await order.save();

  // mark assignment as completed and set commission earned
  await DeliveryAssignment.updateOne(
    { shopOrderId: shopOrder._id, order: order._id },
    { status: 'completed', completedAt: new Date(), commission: DELIVERYPARTNER_COMMISSION }
  );

  return res.status(StatusCodes.OK).json();
};

const getEarnings = async (req, res) => {
  const assignments = await DeliveryAssignment.find({
    assignedTo: req.user.id,
    status: 'completed',
  })
    .populate('shop', 'name')
    .populate('order', '_id')
    .sort({ completedAt: -1 });

  const earnings = assignments.map((a) => ({
    assignmentId: a._id,
    orderId: a.order?._id,
    shopName: a.shop?.name,
    commission: a.commission,
    completedAt: a.completedAt,
  }));

  return res.status(StatusCodes.OK).json(earnings);
};

export {
  createOrder,
  getOrders,
  updateShopOrderStatus,
  getDeliveryAssignments,
  acceptDeliveryAssignment,
  getActiveDeliveryAssignment,
  getOrderById,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  verifyPayment,
  getEarnings,
};
