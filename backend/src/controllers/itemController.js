import { StatusCodes } from 'http-status-codes';
import { getShopByOwner, getItemAndCheckOwnership } from '../utils/dbHelpers.js';
import Item from '../models/itemModel.js';
import Shop from '../models/shopModel.js';
import { ExpressError } from '../utils/ExpressError.js';

// create new item
const createItem = async (req, res) => {
  if (req.user.role !== 'vendor') {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  const { name, imageUrl, foodType, category, price } = req.body;

  const shop = await getShopByOwner(req.user.id);
  await Item.create({ name, imageUrl, shop: shop._id, foodType, category, price });

  const updatedShop = await Shop.findById(shop._id).populate([
    { path: 'items', options: { sort: { updatedAt: -1 } } },
  ]);
  return res.status(StatusCodes.CREATED).json(updatedShop);
};

// update existing item
const updateItem = async (req, res) => {
  if (req.user.role !== 'vendor') {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  const { itemId } = req.params;

  const shop = await getShopByOwner(req.user.id);
  await getItemAndCheckOwnership(itemId, shop._id);

  // remove undefined/null fields from update payload
  const updateData = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v !== undefined && v !== null)
  );

  await Item.findByIdAndUpdate(itemId, updateData, { new: true, runValidators: true });
  const updatedShop = await Shop.findById(shop._id).populate({
    path: 'items',
    options: { sort: { updatedAt: -1 } },
  });

  return res.status(StatusCodes.OK).json(updatedShop);
};

// get single item by id
const getItemById = async (req, res) => {
  if (req.user.role !== 'vendor') {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  const { itemId } = req.params;

  const shop = await getShopByOwner(req.user.id);
  const item = await getItemAndCheckOwnership(itemId, shop._id);

  return res.status(StatusCodes.OK).json(item);
};

// delete item by id
const deleteItemById = async (req, res) => {
  if (req.user.role !== 'vendor') {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  const { itemId } = req.params;

  const shop = await getShopByOwner(req.user.id);
  await getItemAndCheckOwnership(itemId, shop._id);

  await Item.findByIdAndDelete(itemId);
  const updatedShop = await Shop.findById(shop._id).populate({
    path: 'items',
    options: { sort: { updatedAt: -1 } },
  });

  return res.status(StatusCodes.OK).json(updatedShop);
};

// get all items in a city
const getItemsByCity = async (req, res) => {
  const { city } = req.params;

  const shops = await Shop.find({ city: city.toLowerCase().trim() });
  const shopIds = shops.map((shop) => shop._id);
  const items = await Item.find({ shop: { $in: shopIds } }).populate('shop', 'name');

  return res.status(StatusCodes.OK).json(items);
};

// search items by name, category
const searchItems = async (req, res) => {
  const { city } = req.params;
  const { query } = req.query;

  const normalizedCity = city.toLowerCase().trim();
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const searchRegex = new RegExp(escapedQuery, 'i');

  // get all shops in city
  const shops = await Shop.find({ city: normalizedCity }).select('_id');
  const shopIds = shops.map((s) => s._id);

  // search items
  const items = await Item.find({
    shop: { $in: shopIds },
    $or: [{ name: searchRegex }, { category: searchRegex }],
  }).populate('shop', 'name imageUrl');

  return res.status(StatusCodes.OK).json(items);
};

export { createItem, updateItem, getItemById, deleteItemById, getItemsByCity, searchItems };
