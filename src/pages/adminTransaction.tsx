import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import "../globals.css";

interface Transaction {
  id: number;
  amount: number;
  date: string;
  paymentMethod: string;
  enrollmentId: number;
  studentId: number;
  enrollment: {
    id: number;
  };
  student: {
    id: number;
    name: string;
  };
}

interface AdminTransactionsProps {
  username: string;
  role: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.adminAuthToken;

  if (!token) {
    return { redirect: { destination: '/adminLogin', permanent: false } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string; role: string };
    return { props: { username: decoded.username, role: decoded.role } };
  } catch (error) {
    return { redirect: { destination: '/adminLogin', permanent: false } };
  }
};

const AdminTransactions = ({ username, role }: AdminTransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
    enrollmentId: '',
    studentId: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/adminTransaction');
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editTransaction ? `/api/adminTransaction` : '/api/adminTransaction';
    const method = editTransaction ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editTransaction?.id,
          amount: formData.amount,
          paymentMethod: formData.paymentMethod,
          enrollmentId: formData.enrollmentId,
          studentId: formData.studentId,
        }),
      });

      if (!res.ok) {
        throw new Error('Error submitting the transaction');
      }

      fetchTransactions();
      setIsModalOpen(false);
      setEditTransaction(null);
      setFormData({ amount: '', paymentMethod: '', enrollmentId: '', studentId: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const res = await fetch(`/api/adminTransaction?id=${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error('Failed to delete transaction');
        }
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Transactions</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Transaction
          </button>
        </div>

        <div className="bg-white rounded-lg text-gray-500 shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrollment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">${transaction.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.enrollmentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditTransaction(transaction);
                        setFormData({ 
                          amount: transaction.amount.toString(),
                          paymentMethod: transaction.paymentMethod,
                          enrollmentId: transaction.enrollmentId.toString(),
                          studentId: transaction.studentId.toString(),
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed text-gray-500 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">{editTransaction ? 'Edit Transaction' : 'New Transaction'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Enrollment ID</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.enrollmentId}
                    onChange={(e) => setFormData({ ...formData, enrollmentId: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditTransaction(null);
                      setFormData({ amount: '', paymentMethod: '', enrollmentId: '', studentId: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editTransaction ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTransactions;