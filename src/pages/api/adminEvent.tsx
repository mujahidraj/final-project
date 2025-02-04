import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(req.method); // Log the request method

    if (req.method === 'GET') {
      // Fetch all events from the database
      const events = await prisma.event.findMany();
      console.log(events); // Log fetched data
      res.status(200).json(events);
    } 
    else if (req.method === 'POST') {
      const { name, description, eventDate, eventPlace } = req.body; // Destructure the body of the request
      console.log(req.body); // Log request body for debugging

      // Check if required fields are present in the request
      if (!name || !description || !eventDate || !eventPlace) {
        return res.status(400).json({ error: 'Name, description, eventDate, and eventPlace are required' });
      }

      // Add a new event to the database
      const newEvent = await prisma.event.create({
        data: {
          name,
          description,
          eventDate: new Date(eventDate),
          eventPlace,
        },
      });

      console.log(newEvent); // Log the new event created
      res.status(201).json(newEvent); // Respond with the newly created event
    } 
    else if (req.method === 'PATCH') {
      const { id, name, description, eventDate, eventPlace } = req.body;
      console.log(req.body); // Log request body for debugging

      if (!id || !name || !description || !eventDate || !eventPlace) {
        return res.status(400).json({ error: 'ID, name, description, eventDate, and eventPlace are required' });
      }

      const parsedId = Number(id); // Parse the ID to number
      if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      // Update an event by ID
      const updatedEvent = await prisma.event.update({
        where: { id: parsedId },
        data: { name, description, eventDate: new Date(eventDate), eventPlace },
      });
      console.log(updatedEvent); // Log the updated event
      res.status(200).json(updatedEvent); // Respond with the updated event
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

      // Delete an event by ID
      await prisma.event.delete({
        where: { id: parsedId },
      });

      console.log('Event deleted'); // Log deletion success
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