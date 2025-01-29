import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the incoming request data for debugging
    console.log('Request body:', req.body);

    // Get the authToken from the cookies
    const cookies = parseCookies({ req });
    const { authToken } = cookies;

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

    // Extract data from the request body
    const { name, surname, email, phone, address, img, bloodType, sex, birthday } = req.body;

    console.log('Profile data received:', { name, surname, email, phone, address, img, bloodType, sex, birthday });

    // Check if any required field is missing
    if (!name || !surname || !email || !phone || !address || !bloodType || !sex || !birthday) {
      console.error('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // If the birthday is valid, update the profile
    const updatedStudent = await prisma.students.update({
      where: { username: decoded.username },
      data: {
        name,
        surname,
        email,
        phone,
        address,
        img,
        bloodType,
        sex,
        birthday: new Date(birthday), // Dynamically pass the birthday value from request body
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

    return res.status(500).json({ error: 'Internal server error' });
  }
}
