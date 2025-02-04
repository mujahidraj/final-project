import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import "../globals.css";

const EnrollmentPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.authToken;

    if (token) {
      try {
        const decoded: any = jwt.decode(token);
        if (decoded?.userId) {
          setUserId(decoded.userId);
          fetchEnrolledCourses(decoded.userId, token);
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

  const fetchEnrolledCourses = async (userId: number, token: string) => {
    try {
      const res = await fetch('/api/studentEnrolledCourse', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setCourses(data.enrolledCourses);
      } else {
        setError('Failed to fetch courses. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  const navigateToReview = (courseId: number) => {
    router.push(`/studentReview?courseId=${courseId}`);
  };

  const navigateToModule = (courseId: number) => {
    router.push(`/studentLesson?courseId=${courseId}`);
  };

  const navigateToAssignments = (courseId: number) => {
    router.push(`/studentAssignment?courseId=${courseId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Enrolled Courses</h1>
        </div>

        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

        <div className="bg-white rounded-lg text-gray-500 shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Enrolled Courses:</h3>
            {courses.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left border-b">Course Name</th>
                    <th className="px-4 py-2 text-left border-b">Description</th>
                    <th className="px-4 py-2 text-left border-b">Status</th>
                    <th className="px-4 py-2 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{course.course?.name || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{course.course?.description || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{course.status || 'Not Available'}</td>
                      <td className="px-4 py-2 border-b space-x-2">
                        <button
                          onClick={() => navigateToReview(course.courseId)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => navigateToModule(course.courseId)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Module
                        </button>
                        <button
                          onClick={() => navigateToAssignments(course.courseId)}
                          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                        >
                          Assignments
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No enrolled courses found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnrollmentPage;
