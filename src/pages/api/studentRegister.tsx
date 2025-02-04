import { NextApiRequest, NextApiResponse } from 'next';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const studentSchema = z.object({
  name: z.string().nonempty(),
  surname: z.string().nonempty(),
  email: z.string().email().optional(),
  username: z.string().nonempty(),
  password: z.string().min(6), // Example: minimum length of 6
  phone: z.string().optional(),
  address: z.string().nonempty(),
  bloodType: z.string().nonempty(),
  sex: z.string().nonempty(),
  birthday: z.string().refine(
    (date) => !isNaN(new Date(date).getTime()),
    { message: 'Invalid date format' }
  ),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Validate the request body using Zod
      const validatedData = studentSchema.parse(req.body);
      const {
        name,
        surname,
        email,
        username,
        password,
        phone,
        address,
        bloodType,
        sex,
        birthday,
      } = validatedData;

      // Hash the password using argon2
      const hashedPassword = await argon2.hash(password);

      // Create the student in the database
      const student = await prisma.students.create({
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

      // Create a JWT token
      const token = jwt.sign({ userId: student.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Set the token in a cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
          path: '/',
        })
      );

      // Respond with a success message
      return res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(error);
      return res.status(400).json({ error: 'Student registration failed. Please check the input.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
