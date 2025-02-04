import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request Method:', req.method); // Log the request method
    console.log('Request Headers:', req.headers); // Log the request headers
    console.log('Request Body:', req.body); // Log the request body

    if (req.method === 'GET') {
      // Fetch all assignments from the database
      const assignments = await prisma.assignment.findMany({
        include: {
          course: true, // Include related course data
        },
      });
      console.log('Fetched Assignments:', assignments); // Log fetched data
      res.status(200).json(assignments);
    } 
    else if (req.method === 'POST') {
      // Ensure the request body is not null or undefined
      if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
      }

      const { title, body, points, dueDate, courseId } = req.body;

      // Check if required fields are present in the request
      if (!title || !body || !points || !dueDate || !courseId) {
        return res.status(400).json({ error: 'Title, body, points, dueDate, and courseId are required' });
      }

      // Add a new assignment to the database
      const newAssignment = await prisma.assignment.create({
        data: {
          title,
          body,
          points,
          dueDate: new Date(dueDate),
          courseId: parseInt(courseId),
        },
      });

      console.log('New Assignment:', newAssignment); // Log the new assignment created
      res.status(201).json(newAssignment);
    } 
    else if (req.method === 'PATCH') {
      // Ensure the request body is not null or undefined
      if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
      }

      const { id, title, body, points, dueDate, courseId } = req.body;

      if (!id || !title || !body || !points || !dueDate || !courseId) {
        return res.status(400).json({ error: 'ID, title, body, points, dueDate, and courseId are required' });
      }

      const parsedId = Number(id);
      if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      // Update an assignment by ID
      const updatedAssignment = await prisma.assignment.update({
        where: { id: parsedId },
        data: {
          title,
          body,
          points,
          dueDate: new Date(dueDate),
          courseId: parseInt(courseId),
        },
      });
      console.log('Updated Assignment:', updatedAssignment); // Log the updated assignment
      res.status(200).json(updatedAssignment);
    } 
    else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      const parsedId = Number(id);
      if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      // Delete an assignment by ID
      await prisma.assignment.delete({
        where: { id: parsedId },
      });

      console.log('Assignment Deleted'); // Log deletion success
      res.status(204).end();
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error); // Log any errors that occur
    res.status(500).json({ error: 'Internal server error' });
  }
}
