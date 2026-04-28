import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Config from '../config/index.js';

// hash the password using bcrypt with generated salt
const hashValue = async (plainValue) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(plainValue, salt);
};

// generate JWT authentication token
const genToken = (id, role) => {
  return jwt.sign({ id, role }, Config.secretKey, {
    expiresIn: '3d',
  });
};

const compareHash = (plainValue, hashedValue) => {
  return bcryptjs.compare(plainValue, hashedValue);
};

export { hashValue, genToken, compareHash };
