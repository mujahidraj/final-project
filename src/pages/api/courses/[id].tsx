// pages/api/courses/[id].ts
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

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      const { title, description, price } = req.body;
      const updatedCourse = await prisma.course.update({
        where: { id: Number(id) },
        data: { title, description, price }
      });
      return res.json(updatedCourse);

    case 'DELETE':
      await prisma.course.delete({ where: { id: Number(id) } });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}