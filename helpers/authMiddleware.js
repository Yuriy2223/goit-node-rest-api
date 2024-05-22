import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, 'test');

    const user = await User.findById(decodedData.id);

    if (!user || token !== user.token) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Not authorized" });
  }
};

export default authMiddleware;
