import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const verifyToken = (req: NextApiRequest) => {
  const token = req.cookies.token;

  if (!token) {
    throw new Error('No token found');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
