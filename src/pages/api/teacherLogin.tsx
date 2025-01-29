import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import argon2 from 'argon2';
import { sign } from 'jsonwebtoken';
import { setCookie } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Find teacher by username
      const teacher = await prisma.teacher.findUnique({
        where: { username },
      });

      if (!teacher) {
        return res.status(401).json({ error: 'Invalid username' });
      }

      // Compare provided password with stored hashed password
      const isPasswordValid = await argon2.verify(teacher.password, password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const token = sign({ userId: teacher.id, username: teacher.username }, process.env.JWT_SECRET!, {
        expiresIn: '1h', // expires in 1 hour
      });

      // Set JWT token in cookies
      setCookie({ res }, 'authToken', token, {
        maxAge: 60 * 60, // 1 hour
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Set to true in production
      });

      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
