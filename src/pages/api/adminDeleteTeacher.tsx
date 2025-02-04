// pages/api/deleteTeacher.ts

import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { teacherId } = req.body;

    try {
      // Deleting the teacher from the database
      await prisma.teacher.delete({ // Changed from students to teachers
        where: {
          id: teacherId, // Assuming teacherId is the unique identifier for the teacher model
        },
      });
      res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting teacher' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
