// pages/api/reviews/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';  // Your Prisma client
import jwt from 'jsonwebtoken';  // To verify JWT

const JWT_SECRET = process.env.JWT_SECRET; // Use the JWT_SECRET from environment variables

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables.');
}

// Helper function to verify token and get student ID
const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };  // Ensure the decoded token includes userId
    return decoded.userId;  // Use userId instead of studentId
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const handleReview = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { rating, comment, courseId, authToken } = req.body;

    // Ensure the token is provided
    if (!authToken) {
      return res.status(400).json({ error: 'Auth token is required' });
    }

    let userId: number;
    try {
      // Verify and extract userId from JWT token
      userId = verifyToken(authToken);
    } catch (error) {
      // Handle invalid or expired token
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Validate courseId
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    try {
      // Create the review in the database using Prisma
      const newReview = await prisma.review.create({
        data: {
          rating,
          comment,
          studentId: userId,  // Use userId for studentId in the database
          courseId,
        },
      });
      return res.status(200).json(newReview);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create review' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handleReview;
