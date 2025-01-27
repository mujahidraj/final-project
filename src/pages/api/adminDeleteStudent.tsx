// pages/api/deleteStudent.ts

import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { studentId } = req.body;

    try {
      await prisma.students.delete({
        where: {
          id: studentId,
        },
      });
      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting student' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
