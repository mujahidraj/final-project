import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const { enrollmentId, updatedEnrollment } = req.body;

      // Validate request payload
      if (!enrollmentId || typeof updatedEnrollment !== 'object' || updatedEnrollment === null) {
        return res.status(400).json({ error: 'Invalid request body or payload' });
      }

      // Ensure no undefined/null values in the payload
      const cleanedData = Object.fromEntries(
        Object.entries(updatedEnrollment).filter(([_, v]) => v != null)
      );

      // If cleanedData is empty, return a bad request response
      if (Object.keys(cleanedData).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      // Fetch studentId from the cleaned data
      const studentId = cleanedData.studentId;

      // Update the enrollment in the database
      const updatedData = await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: cleanedData,
      });

      // Notification Logic (Added)
      const admin = await prisma.adminUser.findFirst({
        where: { role: 'admin' }, // Fetch admin user(s)
      });

      if (admin) {
        // Create the notification for the admin
        await prisma.studentNotification.create({
          data: {
            userId: admin.id, // The admin's ID
            message: `Admin has approved student with ID : ${studentId}'s enrollment.`,
            read: false, // Admin will see unread notifications
          },
        });
      }

      return res.status(200).json({ message: 'Enrollment updated successfully', data: updatedData });
    } catch (error) {
      console.error('Error updating enrollment:', error);
      return res.status(500).json({ error: 'Error updating enrollment' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
