import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (email, password) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await User.create({ email, password: hashedPassword });

  return result;
};

export const login = async (email, password) => {
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return null;
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return null;
  }

  const token = jwt.sign(
    { email: existingUser.email, id: existingUser._id },
    "test",
    { expiresIn: "1h" }
  );

  existingUser.token = token;
  await existingUser.save();

  return { user: existingUser, token };
};

export const logout = async (userId) => {
  const user = await User.findById(userId);
  user.token = null;
  await user.save();
};

export const getCurrentUser = async (userId) => {
  return await User.findById(userId);
};

export const updateSubscription = async (userId, subscription) => {
  const user = await User.findById(userId);
  user.subscription = subscription;
  return await user.save();
};
