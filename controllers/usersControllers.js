import * as usersServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import gravatar from "gravatar";
import crypto from "node:crypto";
import mailtrap from "../helpers/mailtrap.js"; 

export const register = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await usersServices.registerUser(email);
    if (user !== null) {
      return next(new HttpError(409, "Email in use"));
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "200", d: "retro" });

    const verificationToken = crypto.randomUUID();
    mailtrap.sendMail({
      to: email,
      from: "yuriy.shukan@gmail.com",
      subject: "Welcome to Contacts",
      html: `To confirm you email please click on <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/users/verify/${verificationToken}`,
    });

    const newUser = await usersServices.createUser(
      email,
      passwordHash,
      avatarURL,
      verificationToken
    );

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

export const verificationEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await usersServices.findUserByToken(verificationToken);
    if (!user) {
      return next(new HttpError(404, "User not found"));
    }
    await usersServices.tokenUser(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).json({ message: "Verification successfully" });
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
    if (!user.verify) {
      return next(new HttpError(401, "Email not verified"));
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

export const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new HttpError(400, "File not found"));
    }
    const newPath = path.resolve("public", "avatars", req.file.filename);
    const avatarURL = path.join("/avatars", req.file.filename);
    const file = await Jimp.read(req.file.path);
    await file.resize(250, 250).quality(60).writeAsync(newPath);
    await fs.rename(req.file.path, newPath);
    const user = await usersServices.updateAvatar(req.user.id, avatarURL);
    if (user) {
      res.status(200).json({
        avatarURL: user.avatarURL,
      });
    } else {
      next(new HttpError(404));
    }
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await usersServices.findUserByEmail(email);
    if (!user) {
      return next(new HttpError(404, "User not found"));
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    const verificationToken = crypto.randomUUID();
    await usersServices.setVerificationToken(
      user.email,
      user.verificationToken
    );
    mailtrap.sendMail({
      to: email,
      from: "yuriy.shukan@gmail.com",
      subject: "Welcome to Contacts",
      html: `To confirm you email please click on <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/users/verify/${verificationToken}`,
    });
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
