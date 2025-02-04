import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { enrollmentId } = req.body;

    try {
      await prisma.enrollment.delete({
        where: {
          id: enrollmentId,
        },
      });
      res.status(200).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting enrollment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
