// Backend: /pages/api/studentLesson.js
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

function authenticate(req) {
  const token = req.cookies.authToken;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const user = authenticate(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    try {
      const lessons = await prisma.lesson.findMany({
        where: { courseId: parseInt(courseId) },
        include: { course: true, teacher: true },
      });

      return res.json(lessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  }

  if (req.method === 'POST') {
    const { name, startTime, endTime, courseId, teacherId } = req.body;

    if (!name || !startTime || !endTime || !courseId || !teacherId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const lesson = await prisma.lesson.create({
        data: { name, startTime, endTime, courseId, teacherId },
      });

      return res.status(201).json(lesson);
    } catch (error) {
      console.error('Error creating lesson:', error);
      return res.status(400).json({ error: 'Failed to create lesson' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
