import { NextApiRequest, NextApiResponse } from 'next';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, surname, email, username, password, phone, address, bloodType, sex, birthday } = req.body;

    console.log('Received data:', req.body); // Log the received data

    try {
      // Ensure all required fields are provided
      if (!name || !surname || !username || !password || !address || !bloodType || !sex || !birthday) {
        console.error('Validation Error: Missing fields');
        return res.status(400).json({ error: 'All fields are required.' });
      }

      // Check if teacher already exists by email or username
      const existingTeacher = await prisma.teacher.findUnique({
        where: { email }
      });

      if (existingTeacher) {
        console.error('Error: Teacher already exists with this email');
        return res.status(400).json({ error: 'A teacher with this email already exists.' });
      }

      // Hash the password using argon2
      const hashedPassword = await argon2.hash(password);

      // Create the teacher in the database
      const teacher = await prisma.teacher.create({
        data: {
          name,
          surname,
          email,
          username,
          password: hashedPassword,
          phone,
          address,
          bloodType,
          sex,
          birthday: new Date(birthday),
        },
      });

      console.log('Teacher Created:', teacher); // Log the teacher object

      // Create a JWT token
      const token = jwt.sign({ userId: teacher.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Set the token in a cookie
      res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hour expiration
        path: '/',
      }));

      // Respond with a success message
      return res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
      console.error('Error during teacher registration:', error); // Log detailed error
      return res.status(500).json({ error: 'Teacher registration failed. Please try again later.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
