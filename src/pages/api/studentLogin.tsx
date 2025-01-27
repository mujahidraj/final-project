// /pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import argon2 from 'argon2';
import { sign } from 'jsonwebtoken';
import { setCookie } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Find student by username
      const student = await prisma.students.findUnique({
        where: { username },
      });

      if (!student) {
        return res.status(401).json({ error: 'Invalid username' });
      }

      // Compare provided password with stored hashed password
      const isPasswordValid = await argon2.verify(student.password, password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const token = sign({ userId: student.id, username: student.username }, process.env.JWT_SECRET!, {
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
    res.status(405).json({ error: 'Method not allowed or invalid authorization for student' });
  }
}
