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

    // Create the student in the database
    const student = await prisma.students.create({
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

    return res.status(201).json(student);
  } catch (error: any) {
    console.error('Error adding student:', error);

    // Handle specific errors from Prisma
    if (error.code === 'P2002') {  // Unique constraint violation
      return res.status(409).json({ message: 'Student with this email or username already exists.' });
    }

    // General error
    return res.status(500).json({ message: 'Failed to add student.', error: error.message });
  }
}
