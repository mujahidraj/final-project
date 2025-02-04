import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Enrollment {
  studentId: number;
  courseId: number;
  enrolledAt: string;
  completedAt?: string;
  status: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newEnrollment: Enrollment = req.body;

      // Log the request body for debugging
      console.log('Request Body:', newEnrollment);

      // Validate that the required fields are present
      if (
        !newEnrollment.studentId ||
        !newEnrollment.courseId ||
        !newEnrollment.enrolledAt ||
        !newEnrollment.status
      ) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Insert the new enrollment into the database using Prisma
      const createdEnrollment = await prisma.enrollment.create({
        data: {
          studentId: newEnrollment.studentId,
          courseId: newEnrollment.courseId,
          enrolledAt: new Date(newEnrollment.enrolledAt),
          completedAt: newEnrollment.completedAt ? new Date(newEnrollment.completedAt) : null,
          status: newEnrollment.status,
        },
      });

      // Return the created enrollment as the response
      return res.status(200).json(createdEnrollment);
    } catch (error) {
      console.error('Error adding enrollment:', error);
      return res.status(500).json({ error: 'Error adding enrollment' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
