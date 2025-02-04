// pages/api/teachers.ts

import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

// This API will fetch all teachers from the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const teachers = await prisma.teacher.findMany(); // Changed from students to teachers
      res.status(200).json(teachers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching teachers' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
