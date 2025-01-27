import { NextApiRequest, NextApiResponse } from 'next';

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { first_name, last_name, email, username, password, phone, gender, present_address, permanent_address } = req.body;

    try {
      // Hash the password using argon2
      const hashedPassword = await argon2.hash(password);

      // Create the student in the database
      const student = await prisma.students.create({
        data: {
          first_name,
          last_name,
          email,
          username,
          password: hashedPassword,
          phone: phone,  // Ensure phone is stored as a number
          gender,
          present_address,
          permanent_address,
        },
      });

      // Create a JWT token
      const token = jwt.sign({ userId: student.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Set the token in a cookie
      res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
        httpOnly: true,  // Makes the cookie inaccessible from JavaScript
        secure: process.env.NODE_ENV === 'production',  // Ensures the cookie is only sent over HTTPS
        maxAge: 60 * 60,  // 1 hour expiration
        path: '/',
      }));

      return res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(400).json({ error: 'Student registration failed. Please check the input.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
