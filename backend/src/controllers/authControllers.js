import { StatusCodes } from 'http-status-codes';
import { genToken, hashValue, compareHash } from '../utils/authHelper.js';
import { ExpressError } from '../utils/ExpressError.js';
import User from '../models/userModel.js';
import { sendOtpEmail } from '../utils/emailService.js';
import Config from '../config/index.js';

const cookieOptions = {
  httpOnly: true,
  maxAge: 3 * 24 * 60 * 60 * 1000,
  secure: Config.nodeEnv === 'production',
  sameSite: Config.nodeEnv === 'production' ? 'none' : 'lax',
};

// register
const registerUser = async (req, res) => {
  const { fullName, email, password, mobileNumber, role } = req.body;
  const cleanedEmail = email.trim().toLowerCase();
  const cleanedFullName = fullName.trim();
  const cleanedMobile = mobileNumber.trim();
  // check if email/mobile number already exists
  const existingUser = await User.findOne({
    $or: [{ email: cleanedEmail }, { mobileNumber: cleanedMobile }],
  });

  if (existingUser) {
    if (existingUser.email === cleanedEmail) {
      throw new ExpressError(StatusCodes.CONFLICT, 'Email already exists');
    }

    if (existingUser.mobileNumber === cleanedMobile) {
      throw new ExpressError(StatusCodes.CONFLICT, 'Mobile Number already exists');
    }
  }

  const hashedPassword = await hashValue(password);
  // create new user
  const newUser = new User({
    fullName: cleanedFullName,
    email: cleanedEmail,
    role,
    mobileNumber: cleanedMobile,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();
  const token = genToken(savedUser._id, savedUser.role);

  // set cookie
  res.cookie('token', token, cookieOptions);

  return res.status(StatusCodes.CREATED).json({
    token,
    _id: savedUser._id,
    fullName: savedUser.fullName,
    email: savedUser.email,
    mobileNumber: savedUser.mobileNumber,
    role: savedUser.role,
  });
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }
  // match password
  const isMatched = await compareHash(password, existingUser.password);
  if (!isMatched) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }

  const token = genToken(existingUser._id, existingUser.role);
  // set cookie
  res.cookie('token', token, cookieOptions);

  return res.status(StatusCodes.OK).json({
    token,
    _id: existingUser._id,
    fullName: existingUser.fullName,
    email: existingUser.email,
    mobileNumber: existingUser.mobileNumber,
    role: existingUser.role,
  });
};

// logout
const logoutUser = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: Config.nodeEnv === 'production',
    sameSite: Config.nodeEnv === 'production' ? 'none' : 'lax',
  });
  return res.status(StatusCodes.OK).json();
};

// otp for reset password
const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  existingUser.passwordResetOtp = await hashValue(otp);
  existingUser.resetOtpExpires = Date.now() + 5 * 60 * 1000;
  existingUser.isResetOtpVerified = false;
  await existingUser.save();
  await sendOtpEmail(
    email,
    'Reset Your Password',
    `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
  );
  return res.status(StatusCodes.OK).json();
};

// verify otp for reset password
const verifyPasswordResetOtp = async (req, res) => {
  const { email, otp } = req.body;
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }
  if (!existingUser.passwordResetOtp || existingUser.resetOtpExpires < Date.now()) {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      !existingUser.passwordResetOtp ? 'No OTP found. Please request a new OTP.' : 'OTP has expired'
    );
  }
  const isMatchedOtp = await compareHash(otp, existingUser.passwordResetOtp);
  if (!isMatchedOtp) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
  }
  existingUser.isResetOtpVerified = true;
  existingUser.passwordResetOtp = undefined;
  existingUser.resetOtpExpires = undefined;
  await existingUser.save();
  return res.status(StatusCodes.OK).json();
};

// reset password
const resetUserPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }
  if (!existingUser.isResetOtpVerified) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Please verify OTP first!');
  }
  const hashedPassword = await hashValue(newPassword);
  existingUser.password = hashedPassword;
  existingUser.isResetOtpVerified = false;
  existingUser.passwordResetOtp = undefined;
  existingUser.resetOtpExpires = undefined;
  await existingUser.save();
  return res.status(StatusCodes.OK).json();
};

// google register
const googleAuth = async (req, res) => {
  const { fullName, email, mobileNumber, role } = req.body;
  const cleanedEmail = email.trim().toLowerCase();
  const cleanedFullName = fullName?.trim();
  const cleanedMobile = mobileNumber?.trim();

  let googleUser = await User.findOne({ email: cleanedEmail });

  if (googleUser) {
    // User exists → just login (SignIn flow)
    const token = genToken(googleUser._id, googleUser.role);
    // set cookie
    res.cookie('token', token, cookieOptions);

    return res
      .status(StatusCodes.OK)
      .json({
        token,
        _id: googleUser._id,
        fullName: googleUser.fullName,
        email: googleUser.email,
        mobileNumber: googleUser.mobileNumber,
        role: googleUser.role,
      });
  }

  // User doesn't exist → register (SignUp flow)
  // mobile number required only for new user
  if (!cleanedMobile) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Mobile number is required');
  }

  const mobileExists = await User.findOne({ mobileNumber: cleanedMobile });
  if (mobileExists) {
    throw new ExpressError(StatusCodes.CONFLICT, 'Mobile number already exists');
  }

  googleUser = new User({
    fullName: cleanedFullName,
    email: cleanedEmail,
    role,
    mobileNumber: cleanedMobile,
  });
  await googleUser.save();

  const token = genToken(googleUser._id, googleUser.role);
  // set cookie
  res.cookie('token', token, cookieOptions);

  return res
    .status(StatusCodes.CREATED)
    .json({
      token,
      _id: googleUser._id,
      fullName: googleUser.fullName,
      email: googleUser.email,
      mobileNumber: googleUser.mobileNumber,
      role: googleUser.role,
    });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetUserPassword,
  googleAuth,
};
