import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import User from '../models/userModel.js';

const getUser = async (req, res) => {
  const existingUserId = req.user.id;
  const existingUser = await User.findById(existingUserId).select('-password');
  if (!existingUser) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  return res.status(StatusCodes.OK).json(existingUser);
};

const updateUserLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      currentLocation: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    },
    { new: true }
  );
  if (!user) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  return res.status(StatusCodes.OK).json({ message: 'Location updated!' });
};

export { getUser, updateUserLocation };
