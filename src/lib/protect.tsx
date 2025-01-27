import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const decoded = verifyToken(req);
    res.status(200).json({ message: 'Access granted', user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
