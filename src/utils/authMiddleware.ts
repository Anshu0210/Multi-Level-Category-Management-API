import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const verifyToken = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"]?.replace('Bearer ', '');
    if (!token) throw new Error('Access denied');

    const decoded: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
    if (decoded) {
      const _id = decoded?.userId;
      const userData = await User.findOne({ _id, isActive: true });
      if (!userData) throw new Error("Unauthorised request");
      req['user'] = decoded;
      next();
    }
  } catch (err: any) {
    return res
      .status(403)
      .json({ error: err.message ? err.message : "Unauthorised request" });
  }
}


export default verifyToken;