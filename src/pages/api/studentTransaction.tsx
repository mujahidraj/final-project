import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma'; // Assume prisma is set up for database access

// Create a transaction record and send a notification to admin
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, paymentMethod, enrollmentId, studentId } = req.body;
    const { authorization } = req.headers;

    // Check if the authorization header is present
    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized: Missing authToken' });
    }

    try {
      // Extract the token from the 'Authorization' header
      const authToken = authorization.split(' ')[1];

      // Verify JWT Token
      let decoded;
      try {
        decoded = jwt.verify(authToken as string, process.env.JWT_SECRET!) as { userId: number };
      } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      }

      // Check if studentId matches
      if (decoded.userId !== studentId) {
        return res.status(403).json({ message: 'Unauthorized student' });
      }

      // Check if required data is present
      if (!amount || !paymentMethod || !enrollmentId || !studentId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Ensure enrollmentId is a number
      const enrollmentIdNumber = Number(enrollmentId);
      if (isNaN(enrollmentIdNumber)) {
        return res.status(400).json({ message: 'Invalid enrollmentId' });
      }

      // Create the transaction record
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          paymentMethod,
          studentId,
          enrollmentId: enrollmentIdNumber, // Ensure it's a number
        },
      });

      // Log success and return the created transaction
      console.log('Transaction created successfully:', transaction);

      // Notify the admin about the payment
      const admin = await prisma.adminUser.findFirst({
        where: { role: 'admin' }, // Fetch admin user(s)
      });

      if (admin) {
        // Assuming you have a notification model
        await prisma.notification.create({
          data: {
            userId: admin.id, // The admin's ID
            message: `A payment of  ${amount} Taka has been made by student with ID: ${studentId} for enrollment ID: ${enrollmentId}.`,
            read: false, // Admin will see unread notifications
          },
        });
      }

      return res.status(201).json({ transaction });
    } catch (error) {
      console.error('Error processing payment:', error);

      // Detailed error logging
      if (error instanceof Error) {
        console.error('Detailed Error:', error.message);
      }

      return res.status(500).json({ message: 'Error processing payment' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
