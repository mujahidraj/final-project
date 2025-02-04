import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ReportRequestBody {
  title: string;
  report: string;
  teacherName: string;
  courseName: string;
  id?: number;
}

interface JwtPayload {
  userId: string; // Change to userId based on your payload
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Decode JWT to get the student ID (userId in the payload)
    const decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const studentId = decoded?.userId;  // Accessing userId here

    if (!studentId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (req.method === 'GET') {
      // Fetch all reports for the logged-in student
      const reports = await prisma.report.findMany({
        where: {
          studentId: Number(studentId),
          isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(reports);
    } else if (req.method === 'POST') {
      const { title, report, teacherName, courseName }: ReportRequestBody = req.body;

      if (!title || !report) {
        return res.status(400).json({ error: 'Title and report are required' });
      }

      // Create new report
      const newReport = await prisma.report.create({
        data: {
          studentId: Number(studentId),
          title,
          report,
          teacherName,
          courseName,
        },
      });

      // Create a notification after a new report is added
      const notificationMessage = `A student with ID : "${studentId}" has reported as "${title}" .`;
      await prisma.notification.create({
        data: {
          message: notificationMessage,
          userId: Number(studentId), // assuming the notification is for the same user
        },
      });

      return res.status(201).json(newReport);
    } else if (req.method === 'PATCH') {
      const { id, title, report, teacherName, courseName }: ReportRequestBody = req.body;

      if (!id || !title || !report) {
        return res.status(400).json({ error: 'ID, title, and report are required' });
      }

      const updatedReport = await prisma.report.update({
        where: { id: Number(id), studentId: Number(studentId) },
        data: {
          title,
          report,
          teacherName,
          courseName,
        },
      });
      return res.status(200).json(updatedReport);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      await prisma.report.update({
        where: { id: Number(id), studentId: Number(studentId) },
        data: { isDeleted: true },
      });
      return res.status(204).end();
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
