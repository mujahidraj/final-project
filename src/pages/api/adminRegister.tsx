import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';  // Assuming Prisma is used for database interaction
import argon2 from 'argon2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Validate input (ensure username and password are provided)
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
      // Hash the password using argon2
      const hashedPassword = await argon2.hash(password);

      // Create the admin in the database
      const admin = await prisma.adminUser.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      console.error('Error during admin registration:', error);
      // Return a 500 error with a message
      res.status(500).json({ error: 'Internal server error. Could not register admin.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
