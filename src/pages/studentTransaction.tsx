import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import "../globals.css";

const TransactionPage = () => {
  const router = useRouter();
  const { courseId, userId } = router.query;
  const [studentId, setStudentId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.authToken;

    if (!token) {
      setError('Unauthorized access. Please log in.');
      router.push('/studentLogin');
      return;
    }

    try {
      const decoded: any = jwt.decode(token);
      if (decoded?.userId) {
        setStudentId(decoded.userId);
      } else {
        setError('Invalid token. Please log in again.');
      }
    } catch (err) {
      console.error('Error decoding JWT:', err);
      setError('Failed to decode token. Please log in again.');
    }
  }, [router]);

  const handleTransaction = async () => {
    if (!studentId || !courseId) {
      setError('Missing student or course ID.');
      return;
    }

    const transactionData = {
      studentId,
      enrollmentId: courseId,
      amount: amount || 0,
      paymentMethod,
    };

    const cookies = parseCookies();
    const token = cookies.authToken;

    try {
      const res = await fetch('/api/studentTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (res.ok) {
        router.push('/studentDashboard');
      } else {
        const errorData = await res.json();
        setError(`Transaction failed: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Transaction error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex text-gray-500 h-screen bg-white">
      <main className="flex-1 p-4 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Transaction Page</h1>

        {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>}

        <form className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              value={studentId ?? 'Loading...'}
              readOnly
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course ID</label>
            <input
              type="text"
              value={courseId}
              readOnly
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount ?? ''}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="Bkash">Bkash</option>
              <option value="Nogod">Nogod</option>
              <option value="Rocket">Rocket</option>
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/studentenrollment')}
              className="px-4 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleTransaction}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default TransactionPage;
