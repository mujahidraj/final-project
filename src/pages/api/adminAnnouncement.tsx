import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';  // Import the jsonwebtoken package
import { parse } from 'cookie';  // Import the cookie parser

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(req.method); // Log the request method

    // Extract the JWT token from the cookies
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.adminAuthToken;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not found' });
    }

    // Decode and verify the JWT token to extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.id; // Assuming the user ID is stored as 'id' in the token

    console.log('User ID from token:', userId); // Log the extracted user ID

    if (req.method === 'GET') {
      // Fetch all announcements from the database
      const announcements = await prisma.announcement.findMany();
      console.log(announcements); // Log fetched data
      res.status(200).json(announcements);
    } 
    else if (req.method === 'POST') {
      const { heading, body } = req.body; // Destructure the body of the request
      console.log(req.body); // Log request body for debugging

      // Check if heading and body are present in the request
      if (!heading || !body) {
        return res.status(400).json({ error: 'Heading and body are required' });
      }

       // Notification Logic (Added)
       const admin = await prisma.adminUser.findFirst({
        where: { role: 'admin' }, // Fetch admin user(s)
      });
      // Add a new announcement to the database
      const newAnnouncement = await prisma.announcement.create({
        data: {
          heading, // heading from the request body
          body,    // body from the request body
         
        },
      });

      console.log(newAnnouncement); // Log the new announcement created
      res.status(201).json(newAnnouncement); // Respond with the newly created announcement

      // Create a notification after the announcement is added
      const notification = await prisma.studentNotification.create({
        data: {
          message: `A new announcement has been added: ${heading}`,
          read: false, // Admin will see unread notifications
          userId: admin.id,  // Associate the user ID with the new announcement
        },
      });

      console.log(notification); // Log the notification sent
    } 
    else if (req.method === 'PATCH') {
      const { id, heading, body } = req.body;
      console.log(req.body); // Log request body for debugging

      if (!id || !heading || !body) {
        return res.status(400).json({ error: 'ID, heading, and body are required' });
      }

      const parsedId = Number(id); // Parse the ID to number
      if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      // Update an announcement by ID
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id: parsedId },
        data: { heading, body },
      });
      console.log(updatedAnnouncement); // Log the updated announcement
      res.status(200).json(updatedAnnouncement); // Respond with the updated announcement
    } 
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      console.log(req.query); // Log request query for debugging

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      const parsedId = Number(id); // Parse the ID to number
      if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      // Delete an announcement by ID
      await prisma.announcement.delete({
        where: { id: parsedId },
      });

      console.log('Announcement deleted'); // Log deletion success
      res.status(204).end(); // Send a 204 response (no content)
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' }); // Handle unsupported HTTP methods
    }
  } catch (error) {
    console.error(error); // Log any errors that occur
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 error
  }
}
