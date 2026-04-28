import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import Shop from '../models/shopModel.js';
import Item from '../models/itemModel.js';

// create new shop
const createShop = async (req, res) => {
  if (req.user.role !== 'vendor') {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  const { name, imageUrl, address, city, state } = req.body;

  const existingShop = await Shop.findOne({ owner: req.user.id });
  if (existingShop) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Shop already exists!');
  }

  // create shop
  const shop = await Shop.create({ name, imageUrl, owner: req.user.id, address, city, state });

  return res.status(StatusCodes.CREATED).json(shop);
};

// update existing shop
const updateShop = async (req, res) => {
  if (req.user.role !== 'vendor') {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  const { name, imageUrl, address, city, state } = req.body;
  const existingShop = await Shop.findOne({ owner: req.user.id });

  if (!existingShop) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop not found. Create first.');
  }

  // update shop
  const updateData = { name, imageUrl, address, city, state };
  const updatedShop = await Shop.findByIdAndUpdate(existingShop._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedShop) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Shop update failed');
  }

  await updatedShop.populate({
    path: 'items',
    options: { sort: { updatedAt: -1 } },
  });

  return res.status(StatusCodes.OK).json(updatedShop);
};

// get logged-in user's shop
const getMyShop = async (req, res) => {
  if (req.user.role !== 'vendor') {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
  }
  
  const existingShop = await Shop.findOne({ owner: req.user.id }).populate([
    { path: 'items', options: { sort: { updatedAt: -1 } } },
  ]);

  return res.status(StatusCodes.OK).json(existingShop);
};

// get shops by city
const getShopsByCity = async (req, res) => {
  const { city } = req.params;

  const formattedCity = city.toLowerCase().trim();
  const shops = await Shop.find({ city: formattedCity });

  return res.status(StatusCodes.OK).json(shops);
};

// get shop by id
const getShopById = async (req, res) => {
  const { shopId } = req.params;

  const shop = await Shop.findById(shopId).populate('items');
  if (!shop) throw new ExpressError(StatusCodes.BAD_REQUEST, 'Shop not found!');

  return res.status(StatusCodes.OK).json(shop);
};

export { createShop, updateShop, getMyShop, getShopsByCity, getShopById };
