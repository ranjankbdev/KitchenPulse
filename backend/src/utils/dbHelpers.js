import Shop from '../models/shopModel.js';
import Item from '../models/itemModel.js';
import { ExpressError } from './ExpressError.js';
import { StatusCodes } from 'http-status-codes';

const getShopByOwner = async (userId) => {
  const shop = await Shop.findOne({ owner: userId });
  if (!shop) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop not found!');
  }
  return shop;
};

const getItemAndCheckOwnership = async (itemId, shopId) => {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Item not found!');
  }

  if (!item.shop.equals(shopId)) {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Unauthorized action!');
  }

  return item;
};

export { getShopByOwner, getItemAndCheckOwnership };
