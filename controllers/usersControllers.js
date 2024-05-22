import * as userService from "../services/userService.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.register(email, password);

    if (!user) {
      return res.status(409).json({ message: "Email in use" });
    }

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.login(email, password);

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await userService.logout(userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userService.getCurrentUser(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { subscription } = req.body;
    const user = await userService.updateSubscription(userId, subscription);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
