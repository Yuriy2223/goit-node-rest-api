import jwt from "jsonwebtoken";
import * as usersServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "string") {
    return next(new HttpError(401, "Not authorized"));
  }
  const [bearer, token] = authHeader.split(" ", 2);
  if (bearer !== "Bearer" || !token) {
    return next(new HttpError(401, "Not authorized"));
  }
  jwt.verify(token, process.env.JWT_KEY, async (error, decode) => {
    if (error) {
      return next(new HttpError(401, "Not authorized"));
    }
    try {
      const user = await usersServices.findUser(decode.id);
      if (user === null) {
        return next(new HttpError(401, "Not authorized"));
      }
      if (user.token !== token) {
        return next(new HttpError(401, "Not authorized"));
      }
      req.user = { id: decode.id };
      next();
    } catch (error) {
      next(error);
    }
  });
};

export default auth;
