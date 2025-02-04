import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request Method:', req.method); // Log the request method
    console.log('Request Headers:', req.headers); // Log the request headers
    console.log('Request Body:', req.body); // Log the request body

    if (req.method === 'GET') {
      // Fetch all transactions from the database
      const transactions = await prisma.transaction.findMany({
        include: {
          enrollment: true,
          student: true,
        },
      });
      console.log('Fetched Transactions:', transactions); // Log fetched data
      res.status(200).json(transactions);
    } 
    else if (req.method === 'POST') {
      // Ensure the request body is not null or undefined
      if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
      }

      const { amount, paymentMethod, enrollmentId, studentId } = req.body;

      // Check if required fields are present in the request
      if (!amount || !paymentMethod || !enrollmentId || !studentId) {
        return res.status(400).json({ error: 'Amount, paymentMethod, enrollmentId, and studentId are required' });
      }

      // Add a new transaction to the database
      const newTransaction = await prisma.transaction.create({
        data: {
          amount: parseFloat(amount),
          paymentMethod,
          enrollmentId: parseInt(enrollmentId),
          studentId: parseInt(studentId),
        },
      });

      console.log('New Transaction:', newTransaction); // Log the new transaction created
      res.status(201).json(newTransaction);
    } 
    else if (req.method === 'PATCH') {
      // Ensure the request body is not null or undefined
      if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
      }

      const { id, amount, paymentMethod, enrollmentId, studentId } = req.body;

      if (!id || !amount || !paymentMethod || !enrollmentId || !studentId) {
        return res.status(400).json({ error: 'ID, amount, paymentMethod, enrollmentId, and studentId are required' });
      }

      const parsedId = Number(id);
      if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      // Update a transaction by ID
      const updatedTransaction = await prisma.transaction.update({
        where: { id: parsedId },
        data: {
          amount: parseFloat(amount),
          paymentMethod,
          enrollmentId: parseInt(enrollmentId),
          studentId: parseInt(studentId),
        },
      });
      console.log('Updated Transaction:', updatedTransaction); // Log the updated transaction
      res.status(200).json(updatedTransaction);
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

      // Delete a transaction by ID
      await prisma.transaction.delete({
        where: { id: parsedId },
      });

      console.log('Transaction Deleted'); // Log deletion success
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