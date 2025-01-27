// pages/api/updateStudent.ts

import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { studentId, updatedStudent } = req.body;

    try {
      // Updating the student in the database
      await prisma.students.update({
        where: {
          id: studentId,
        },
        data: updatedStudent, // Use updatedStudent directly as it contains all the fields
      });
      res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating student' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
