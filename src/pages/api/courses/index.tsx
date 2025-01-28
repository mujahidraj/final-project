// pages/api/courses/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// In your API routes (e.g., pages/api/courses/index.ts)
interface JwtPayload {
    username: string;
    role: string;
  }
  
  const verifyAdmin = (token: string): JwtPayload | null => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
      return null;
    }
  };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.adminAuthToken || '';
  const decoded = verifyAdmin(token);

  if (!decoded || decoded.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      const courses = await prisma.course.findMany();
      return res.json(courses);

    case 'POST':
      const { title, description, price } = req.body;
      const newCourse = await prisma.course.create({
        data: { title, description, price }
      });
      return res.json(newCourse);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}