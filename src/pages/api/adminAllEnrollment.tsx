// pages/api/enrollments.ts

import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

// This API will fetch all enrollments from the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const enrollments = await prisma.enrollment.findMany();
      res.status(200).json(enrollments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching enrollments' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
