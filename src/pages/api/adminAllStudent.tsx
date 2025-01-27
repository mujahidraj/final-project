// pages/api/students.ts

import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


// This API will fetch all students from the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const students = await prisma.students.findMany();
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching students' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
