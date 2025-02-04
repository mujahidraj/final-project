// pages/api/updateTeacher.ts

import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { teacherId, updatedTeacher } = req.body;

    try {
      // Updating the teacher in the database
      await prisma.teacher.update({ // Changed from students to teachers
        where: {
          id: teacherId, // Assuming teacherId is the unique identifier
        },
        data: updatedTeacher, // Use updatedTeacher directly as it contains all the fields
      });
      res.status(200).json({ message: 'Teacher updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating teacher' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
