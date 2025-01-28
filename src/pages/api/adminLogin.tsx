// /pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import argon2 from 'argon2';
import { sign } from 'jsonwebtoken';
import { setCookie } from 'nookies';

// /pages/api/login.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password ,role } = req.body;

    try {
      const admin = await prisma.adminUser.findUnique({
        where: { username },
      });

      if (!admin) {
        return res.status(401).json({ error: 'Invalid admin' });
      }

      const isPasswordValid = await argon2.verify(admin.password, password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = sign({ username: admin.username, role: admin.role }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      // Set admin token in cookies
      setCookie({ res }, 'adminAuthToken', token, {
        maxAge: 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });

      res.status(200).json({ message: 'Login successful', role: 'admin' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
