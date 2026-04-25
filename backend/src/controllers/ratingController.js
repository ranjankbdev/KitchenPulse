import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import Rating from '../models/ratingModel.js';
import Order from '../models/orderModel.js';
import Item from '../models/itemModel.js';

const rateItem = async (req, res) => {
  const { orderId, rating, itemId } = req.body;

  // chec order exist and order belongs to this user
  const order = await Order.findOne({ _id: orderId, user: req.user.id });
  if (!order) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not found!');

  const item = await Item.findById(itemId);
  if (!item) throw new ExpressError(StatusCodes.NOT_FOUND, 'Item not found!');
  let itemDelivered = false;
  let itemFound = false;

  // chek item exist + delivered
  for (const shopOrder of order.shopOrders) {
    const found = shopOrder.shopOrderItems.some((i) => i.item?.toString() === itemId);
    if (found) {
      itemFound = true;

      if (shopOrder.status === 'delivered') {
        itemDelivered = true;
      }
    }
  }

  if (!itemDelivered) throw new ExpressError(StatusCodes.NOT_FOUND, 'Order not delivered!');
  if (!itemFound) throw new ExpressError(StatusCodes.NOT_FOUND, 'Item not found!');

  // existing review check
  const existingReview = await Rating.findOne({ user: req.user.id, item: itemId, order: orderId });
  if (existingReview) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'You have already rated this item');
  }

  // create rating
  await Rating.create({ user: req.user.id, item: itemId, order: orderId, rating });

  const oldCount = item.ratings?.count || 0;
  const oldAvg = item.ratings?.average || 0;
  const newCount = oldCount + 1;
  const newAvg = (oldAvg * oldCount + rating) / newCount;

  // update item ratings
  item.ratings.count = newCount;
  item.ratings.average = newAvg;
  await item.save();
  return res.status(StatusCodes.CREATED).json();
};

export { rateItem };
