import { StatusCodes } from 'http-status-codes';
import { getShopByOwner, getItemAndCheckOwnership } from '../utils/dbHelpers.js';
import Item from '../models/itemModel.js';
import Shop from '../models/shopModel.js';

const createItem = async (req, res) => {
  const { name, imageUrl, foodType, category, price } = req.body;

  const shop = await getShopByOwner(req.user.id);
  await Item.create({ name, imageUrl, shop: shop._id, foodType, category, price });

  const updatedShop = await Shop.findById(shop._id).populate([
    { path: 'owner' },
    { path: 'items', options: { sort: { updatedAt: -1 } } },
  ]);
  return res.status(StatusCodes.CREATED).json(updatedShop);
};

const updateItem = async (req, res) => {
  const { itemId } = req.params;

  const shop = await getShopByOwner(req.user.id);
  await getItemAndCheckOwnership(itemId, shop._id);

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

const getItemById = async (req, res) => {
  const { itemId } = req.params;

  const shop = await getShopByOwner(req.user.id);
  const item = await getItemAndCheckOwnership(itemId, shop._id);

  return res.status(StatusCodes.OK).json(item);
};

const deleteItemById = async (req, res) => {
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

const getItemsByCity = async (req, res) => {
  const { city } = req.params;

  const shops = await Shop.find({ city: city.toLowerCase().trim() });
  const shopIds = shops.map((shop) => shop._id);
  const items = await Item.find({ shop: { $in: shopIds } });

  return res.status(StatusCodes.OK).json(items);
};

export { createItem, updateItem, getItemById, deleteItemById, getItemsByCity };
