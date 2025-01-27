import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the incoming request data for debugging
    console.log('Request body:', req.body);
    console.log('Auth token from cookies:', req.cookies.authToken);

    const { authToken } = req.cookies;

    // Ensure the token exists
    if (!authToken) {
      console.error('No authToken found in cookies');
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    // Decode the token
    let decoded;
    try {
      decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as { userId: number; username: string };
      console.log('Decoded token:', decoded);
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!decoded || !decoded.username) {
      console.error('Invalid token payload');
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Extract data from request body
    const { first_name, last_name, email, phone, gender, present_address, permanent_address } = req.body;

    console.log('Profile data received:', { first_name, last_name, email, phone, gender, present_address, permanent_address });

    if (!first_name || !last_name || !email || !phone || !gender || !present_address || !permanent_address) {
      console.error('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingStudent = await prisma.students.findUnique({
      where: { username: decoded.username },
    });

    if (!existingStudent) {
      console.error('Student not found');
      return res.status(404).json({ error: 'Student not found' });
    }

    const updatedStudent = await prisma.students.update({
      where: { username: decoded.username },
      data: {
        first_name,
        last_name,
        email,
        phone,
        gender,
        present_address,
        permanent_address,
      },
    });

    console.log('Updated student profile:', updatedStudent);
    return res.status(200).json({ message: 'Profile updated successfully', updatedStudent });
  } catch (error: any) {
    // Enhanced error handling
    if (error instanceof Error) {
      console.error('Error updating profile:', error.message); // Handle string or object error
    } else {
      console.error('Unknown error:', error); // Handle non-object errors
    }

    // Specific Prisma error handling
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Student not found' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
  