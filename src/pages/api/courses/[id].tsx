import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid course ID' });
  }

  switch (req.method) {
    case 'PATCH':
      return updateCourse(req, res, parseInt(id));
    case 'DELETE':
      return deleteCourse(req, res, parseInt(id));
    default:
      res.setHeader('Allow', ['PATCH', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateCourse(req: NextApiRequest, res: NextApiResponse, courseId: number) {
  const { name, description, duration, teacherId, price } = req.body;

  if (!name || typeof duration !== 'number' || typeof teacherId !== 'number' || typeof price !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        name,
        description: description || null,
        duration,
        teacherId,
        price, // Update price field
      },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
}

async function deleteCourse(req: NextApiRequest, res: NextApiResponse, courseId: number) {
  try {
    await prisma.course.delete({
      where: { id: courseId },
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
}
