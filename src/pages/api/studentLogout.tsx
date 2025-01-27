import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Destroy the student JWT token cookie
    destroyCookie({ res }, 'authToken', { path: '/' });

    return res.status(200).json({ message: 'Logged out successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
