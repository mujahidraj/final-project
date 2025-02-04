import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken'; // For decoding the JWT token
import "../globals.css";

interface EnrollmentPageProps {
  userId: number;
  courseId: number;
}

const EnrollmentPage = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const [userId, setuserId] = useState<number | null>(null);  // To store the userId
  const [completedAt, setCompletedAt] = useState<string>(''); 
  const [status, setStatus] = useState<string>('pending'); // Default status
  const [error, setError] = useState<string | null>(null);

  // Fetch and decode the JWT token to extract the userId
  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.authToken;

    if (token) {
      try {
        const decoded: any = jwt.decode(token); // Decode the JWT token
        if (decoded?.userId) {
          setuserId(decoded.userId); // Set the userId from the decoded JWT
        } else {
          setError('Invalid token: userId not found.');
        }
      } catch (err) {
        console.error('Error decoding JWT:', err);
        setError('Failed to decode token. Please log in again.');
      }
    } else {
      setError('Unauthorized access. Please log in.');
    }
  }, []);

  // Handle Enrollment Request
  const handleEnrollment = async (courseId: number) => {
    if (!userId) {
      setError('Student ID is missing.');
      return;
    }

    const cookies = parseCookies();
    const token = cookies.authToken;

    if (!token) {
      setError('Unauthorized access. Please log in.');
      return;
    }

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, courseId }),
      });

      // Assuming enrollment is successful, navigate to the transaction page
      if (res.ok) {
        router.push(`/studentTransaction?courseId=${courseId}&userId=${userId}`);
      } else {
        setError('Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  // Handle button click to trigger enrollment
  const handleClick = () => {
    if (courseId && typeof courseId === 'string') {
      handleEnrollment(Number(courseId)); // Convert courseId to number
    }
  };

  // Navigate back to the studentCourse page
  const handleBack = () => {
    router.push('/studentCourse');
  };

  return (
    <div className="flex  bg-gray-100">
      <main className="flex-1 p-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-md mb-4"
        >
          Back
        </button>

        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Course Enrollment</h1>
        </div>

        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

        <div className="bg-white rounded-lg text-gray-500 shadow overflow-hidden w-full max-w-lg mx-auto">
          <form className="space-y-6 p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                value={userId ?? 'Loading...'}  // Display 'Loading...' until userId is available
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Course ID</label>
              <input
                type="text"
                value={courseId}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Completion Date</label>
              <input
                type="date"
                value={completedAt}
                onChange={(e) => setCompletedAt(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClick} // Trigger handleClick function
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EnrollmentPage;
