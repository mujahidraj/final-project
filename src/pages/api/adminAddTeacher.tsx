// pages/api/teachers.ts

import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import argon2 from 'argon2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const {
    name, surname, email, username, phone,
    sex, address, bloodType, birthday, password
  } = req.body;

  // Validate required fields
  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'Name, email, username, and password are required fields.' });
  }

  try {
    // Handle optional birthday format validation
    let formattedBirthday: Date | null = null;
    if (birthday) {
      formattedBirthday = new Date(birthday);
      if (isNaN(formattedBirthday.getTime())) {
        return res.status(400).json({ message: 'Invalid birthday format.' });
      }
    }

    // Hash password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Create the teacher in the database
    const teacher = await prisma.teacher.create({ // Changed from students to teachers
      data: {
        name,
        surname,
        email,
        username,
        phone: phone || '',
        sex: sex || '',
        address: address || '',
        bloodType: bloodType || '',
        birthday: new Date(birthday),
        password: hashedPassword,
      },
    });

    return res.status(201).json(teacher); // Return the created teacher
  } catch (error: any) {
    console.error('Error adding teacher:', error);

    // Handle specific errors from Prisma
    if (error.code === 'P2002') {  // Unique constraint violation
      return res.status(409).json({ message: 'Teacher with this email or username already exists.' });
    }

    // General error
    return res.status(500).json({ message: 'Failed to add teacher.', error: error.message });
  }
}
