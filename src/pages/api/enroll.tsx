import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }

    try {
      const token = req.cookies.authToken;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string; userId: number };
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
      }

      // Proceed with the enrollment logic
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: decoded.userId,
          courseId: courseId,
          status: 'Pending',
        },
      });

      // Notify the admin about the new enrollment
      const admin = await prisma.adminUser.findFirst({
        where: { role: 'admin' }, // Fetch admin user(s)
      });

      if (admin) {
        // Assuming you have a notification model
        await prisma.notification.create({
          data: {
            userId: admin.id, // The admin's ID
            message: `A student with username ${decoded.username} has enrolled in course ID: ${courseId}.`,
            read: false, // Admin will see unread notifications
          },
        });
      }

      return res.status(200).json({ message: 'Enrollment successful!', enrollment });
    } catch (error) {
      console.error('Enrollment error:', error);
      return res.status(500).json({ message: 'Enrollment failed. Please try again.' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
