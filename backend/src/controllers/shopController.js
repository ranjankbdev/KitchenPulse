import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import Shop from '../models/shopModel.js';
import Item from '../models/itemModel.js';

const createShop = async (req, res) => {
  const { name, imageUrl, address, city, state } = req.body;

  const existingShop = await Shop.findOne({ owner: req.user.id });
  if (existingShop) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Shop already exists!');
  }

  const shop = await Shop.create({ name, imageUrl, owner: req.user.id, address, city, state });

  await shop.populate('owner');
  return res.status(StatusCodes.CREATED).json(shop);
};

const updateShop = async (req, res) => {
  const { name, imageUrl, address, city, state } = req.body;
  const existingShop = await Shop.findOne({ owner: req.user.id });

  if (!existingShop) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop not found. Create first.');
  }

  const updateData = { name, imageUrl, address, city, state };
  const updatedShop = await Shop.findByIdAndUpdate(existingShop._id, updateData, {
    new: true,
    runValidators: true,
  });

  await updatedShop.populate('owner');
  await updatedShop.populate({
    path: 'items',
    options: { sort: { updatedAt: -1 } },
  });

  return res.status(StatusCodes.OK).json(updatedShop);
};

const getMyShop = async (req, res) => {
  const existingShop = await Shop.findOne({ owner: req.user.id }).populate([
    { path: 'owner' },
    { path: 'items', options: { sort: { updatedAt: -1 } } },
  ]);

  return res.status(StatusCodes.OK).json(existingShop || null);
};

const getShopsByCity = async (req, res) => {
  const { city } = req.params;

  const shops = await Shop.find({ city: city.toLowerCase().trim() }).populate('items');

  if (shops.length === 0) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop not found!');
  }

  return res.status(StatusCodes.OK).json(shops);
};

export { createShop, updateShop, getMyShop, getShopsByCity };
