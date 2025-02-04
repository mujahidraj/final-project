import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'; // Assuming you're using Prisma for database management

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getCourses(req, res);
    case 'POST':
      return createCourse(req, res);
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

async function createCourse(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, duration, teacherId , price } = req.body;

  if (!name || duration === undefined || teacherId === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newCourse = await prisma.course.create({
      data: { name, description, duration, teacherId ,price },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
}
