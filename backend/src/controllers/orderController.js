import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import Shop from '../models/shopModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Item from '../models/itemModel.js';

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_THRESHOLD = 500;

const createOrder = async (req, res) => {
  const { cartItems, paymentMethod, deliveryAddress } = req.body;

  // group items by shop
  const groupItemsByShop = cartItems.reduce((acc, item) => {
    if (!item.shop) {
      throw new ExpressError(StatusCodes.BAD_REQUEST, 'invalid shop in cart item');
    }
    const shopId = item.shop;
    acc[shopId] = acc[shopId] || [];
    acc[shopId].push(item);
    return acc;
  }, {});

  // build shopOrders
  const shopOrders = await Promise.all(
    Object.entries(groupItemsByShop).map(async ([shopId, items]) => {
      const shop = await Shop.findById(shopId).populate('owner');
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

        shopOrderItems.push({
          item: dbItem._id,
          name: dbItem.name,
          price: dbItem.price,
          quantity: i.quantity,
        });
      }

      return { shop: shop._id, owner: shop.owner._id, subtotal, shopOrderItems };
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
    subtotal,
    deliveryCharge,
    totalAmount,
    shopOrders,
  };

  const newOrder = await Order.create(orderData);
  // populate
  const populatedOrder = await Order.findById(newOrder._id)
    .populate('shopOrders.shopOrderItems.item', 'name imageUrl price')
    .populate('shopOrders.shop', 'name');

  return res.status(StatusCodes.CREATED).json(populatedOrder);
};

const getOrders = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');

  if (user.role === 'user') {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('shopOrders.shop', 'name')
      .populate('shopOrders.owner', 'fullName email mobileNumber')
      .populate('shopOrders.shopOrderItems.item', 'name imageUrl price');

    return res.status(StatusCodes.OK).json(orders);
  }

  if (user.role === 'vendor') {
    const orders = await Order.find({ 'shopOrders.owner': req.user.id })
      .sort({ createdAt: -1 })
      .populate('shopOrders.shop', 'name')
      .populate('user', 'fullName mobileNumber')
      .populate('shopOrders.shopOrderItems.item', 'name imageUrl price')
      .populate('shopOrders.assignedDeliveryPartner', 'fullName mobileNumber');

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
      subtotal: order.subtotal,
      deliveryCharge: order.deliveryCharge,
      totalAmount: order.totalAmount,
    }));

    return res.status(StatusCodes.OK).json(filteredOrders);
  }
  throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
};

const statusFlow = {
  pending: 'preparing',
  preparing: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

const updateShopOrderStatus = async (req, res) => {
  const { orderId, shopId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found!');

  const shopOrder = order.shopOrders.find((o) => o.shop.toString() === shopId);
  if (!shopOrder) throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop order not found!');

  // verify vendor owns this shop order
  if (String(shopOrder.owner) !== String(req.user.id)) {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'You are not authorized to update this order!');
  }

  // verify status transition is valid
  const allowedNext = statusFlow[shopOrder.status];
  if (status !== allowedNext) {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      `Cannot move from ${shopOrder.status} to ${status}!`
    );
  }
  if (shopOrder.status === 'delivered') {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'order already delivered!');
  }

  shopOrder.status = status;
  await order.save();
  // re-populating
  await order.populate('shopOrders.shopOrderItems.item', 'name imageUrl price');
  const updatedShopOrder = order.shopOrders.find((o) => (o) => o.shop.toString() === shopId);

  return res.status(StatusCodes.OK).json(updatedShopOrder);
};

export { createOrder, getOrders, updateShopOrderStatus };
