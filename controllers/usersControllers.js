import * as usersServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await usersServices.registerUser(email);
    if (user !== null) {
      return next(new HttpError(409, "Email in use"));
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await usersServices.createUser(email, passwordHash);
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await usersServices.registerUser(email);
    if (user === null) {
      return next(new HttpError(401, "Email or password is wrong"));
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect === false) {
      return next(new HttpError(401, "Email or password is wrong"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    await usersServices.tokenUser(user._id, { token });
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await usersServices.tokenUser(req.user.id, { token: null });
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  const id = req.user.id;
  try {
    const user = await usersServices.findUser(id);
    if (!user) {
      return next(new HttpError(401, "Not authorized"));
    }
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  const id = req.user.id;
  if (
    Object.keys(req.body).length !== 1 ||
    !["starter", "pro", "business"].includes(req.body.subscription)
  ) {
    return next(
      new HttpError(
        400,
        "Body must have one field: subscription, with value 'starter', 'pro', or 'business'"
      )
    );
  }
  try {
    const contact = await usersServices.subscriptionUser(id, req.body);
    if (contact) {
      res.status(200).json(contact);
    } else {
      next(new HttpError(404));
    }
  } catch (error) {
    next(error);
  }
};
