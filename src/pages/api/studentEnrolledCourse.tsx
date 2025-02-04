import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized access. Token not provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Invalid token: userId not found.' });
    }

    const userId = decoded.userId;

    // Fetch only completed courses enrolled by the student
    const enrolledCourses = await prisma.enrollment.findMany({
      where: {
        studentId: Number(userId),
        status: 'COMPLETED', // Filter by the 'completed' status
      },
      include: {
        course: true, // Ensure course details are fetched
      },
    });

    if (enrolledCourses.length === 0) {
      return res.status(404).json({ message: 'No completed courses found for this student.' });
    }

    res.status(200).json({ enrolledCourses });
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
