import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

interface Course {
  id: number;
  name: string;
  description: string | null;
  duration: number;
  teacherId: number;
  price: number | null; // Add price field
}

interface AdminCoursesProps {
  username: string;
  role: string;
  studentId: number; // Add studentId to props
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.authToken;

  if (!token) {
    return { redirect: { destination: '/studentLogin', permanent: false } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string; role: string; userId: number }; // Decode studentId from token
    const role = decoded.role ?? null;
    const studentId = decoded.userId; // Fetch studentId from decoded token

    return { props: { username: decoded.username, role, studentId } };
  } catch (error) {
    return { redirect: { destination: '/studentLogin', permanent: false } };
  }
};

const Courses = ({ username, role, studentId }: AdminCoursesProps) => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');

      // Check if the response is JSON
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setCourses(data); // Set courses data
      } else {
        // Handle non-JSON response
        const textResponse = await res.text();
        console.error('Non-JSON response:', textResponse);
        setError('Received non-JSON response from the server.');
      }
    } catch (error: any) {
      console.error('Error fetching or parsing data:', error);
      setError('Failed to load courses. Please try again later.');
    }
  };

  const handleEnroll = async (courseId: number) => {
    // Use studentId from props for enrollment
    const url = `/studentenrollment?courseId=${courseId}&studentId=${studentId}`;
    router.push(url);
  };

  const handleAction = (courseId: number) => {
    alert(`Action on course with ID: ${courseId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">View Courses</h1>
        </div>

        {/* Display error message if there is an error */}
        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

        <div className="bg-white rounded-lg text-gray-500 shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration (mins)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (BDT)</th> {/* Add Price header */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{course.description ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.teacherId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.price !== null ? `${course.price.toFixed(2)}` : 'N/A'}</td> {/* Display price */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {role === null ? (
                      <button
                        onClick={() => handleEnroll(course.id)} // Navigate to enrollment page
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Enroll
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(course.id)} // Action for non-student roles
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Action
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Courses;
