import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const notifications = await prisma.studentNotification.findMany({
        where: { read: false }, // Get only unread notifications
        include: { user: true }, // Include user info (admin)
      });
      
      return res.status(200).json({ notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ message: 'Error fetching notifications.' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
