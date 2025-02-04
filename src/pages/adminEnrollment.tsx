import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrolledAt: string;
  completedAt?: string;
  status: string;
}

interface EnrollmentPageProps {
  enrollments: Enrollment[];
  username: string;
  role: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.adminAuthToken || cookies.authToken;

  if (!token) {
    return {
      redirect: {
        destination: '/adminLogin',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string; role: string };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error('Base URL is not set in environment variables');
      throw new Error('Base URL is not set in environment variables');
    }

    const res = await fetch(`${baseUrl}/api/adminAllEnrollment`);
    if (!res.ok) {
      throw new Error('Failed to fetch enrollments');
    }
    const enrollments = await res.json();

    return {
      props: {
        username: decoded.username,
        role: decoded.role,
        enrollments,
      },
    };
  } catch (error) {
    console.error('Token decode failed or fetch error:', error);
    return {
      redirect: {
        destination: '/adminLogin',
        permanent: false,
      },
    };
  }
};

const EnrollmentPage = ({ enrollments, username, role }: EnrollmentPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState<Enrollment>({
    id: 0,
    studentId: 0,
    courseId: 0,
    enrolledAt: '',
    completedAt:'',
    status: '',
  });

  const router = useRouter();

    const handleEdit = (enrollment: Enrollment) => {
      setIsEditing(true);
      setCurrentEnrollment(enrollment);
    };

  const handleDelete = async (enrollmentId: number) => {
    await fetch('/api/adminDeleteEnrollment', {
      method: 'DELETE',
      body: JSON.stringify({ enrollmentId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert(`Enrollment ID: ${enrollmentId} has been deleted.`);
    setTimeout(() => {
      router.reload();
    }, 2000);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!currentEnrollment) return;
  
    // Ensure updatedEnrollment is an object, even if it's missing some values
    const updatedEnrollment = {
      ...currentEnrollment,
      completedAt: currentEnrollment.completedAt ? new Date(currentEnrollment.completedAt).toISOString() : null, // Set completedAt to null if not provided
    };
  
    // Send the updated data to the API
    const res = await fetch('/api/adminUpdateEnrollment', {
      method: 'PUT',
      body: JSON.stringify({
        enrollmentId: currentEnrollment.id,
        updatedEnrollment: updatedEnrollment, // Ensure it's an object here
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (res.ok) {
      alert(`Enrollment ID: ${currentEnrollment.id} has been updated.`);
      setIsEditing(false);
      router.reload();
    } else {
      alert('Failed to update enrollment');
    }
  };
  

  const handleAddEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!newEnrollment.studentId || !newEnrollment.courseId || !newEnrollment.enrolledAt || !newEnrollment.status) {
      alert('Please fill all the required fields');
      return;
    }
  
    const res = await fetch('/api/adminAddEnrollment', {
      method: 'POST',
      body: JSON.stringify(newEnrollment),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (res.ok) {
      const data = await res.json();
      alert(`Enrollment for student with ID ${data.studentId} in course with ID ${data.courseId} has been added.`);
      setIsAdding(false);
      router.reload();
    } else {
      const error = await res.json();
      alert(`Failed to add enrollment: ${error?.error || 'Unknown error'}`);
    }
  };
  
  return (
    <div className="flex bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 min-h-screen">
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">Manage Enrollments</h1>

        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-700 transition duration-300"
        >
          Add New Enrollment
        </button>

        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-800 text-white text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Student ID</th>
              <th className="px-4 py-2 text-left">Course ID</th>
              <th className="px-4 py-2 text-left">Enrollment Date</th>
              <th className="px-4 py-2 text-left">Completion Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 text-xs">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                <td className="px-4 py-3 text-sm text-gray-700">{enrollment.studentId}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{enrollment.courseId}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{enrollment.enrolledAt}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{enrollment.completedAt}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{enrollment.status}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300 ease-in-out"
                    onClick={() => handleEdit(enrollment)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold transition duration-300 ease-in-out ml-4"
                    onClick={() => handleDelete(enrollment.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-xl w-80 transform transition-all duration-300 scale-105">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Enrollment</h2>
              <form onSubmit={handleAddEnrollment} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label htmlFor="studentId" className="text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="number"
                    id="studentId"
                    value={newEnrollment.studentId}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, studentId: +e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Student ID"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="courseId" className="text-sm font-medium text-gray-700 mb-1">Course ID</label>
                  <input
                    type="number"
                    id="courseId"
                    value={newEnrollment.courseId}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, courseId: +e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Course ID"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="enrolledAt" className="text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    id="enrolledAt"
                    value={newEnrollment.enrolledAt}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, enrolledAt: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="completedAt" className="text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    id="completedAt"
                    value={newEnrollment.completedAt}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, completedAt: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status"
                    value={newEnrollment.status}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, status: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  >
                    <option value="ENROLLED">Enrolled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="DROPPED">Dropped</option>
                  </select>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Add Enrollment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditing && currentEnrollment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-xl w-80 transform transition-all duration-300 scale-105">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Enrollment</h2>
              <form onSubmit={handleSaveChanges} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label htmlFor="studentId" className="text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="number"
                    id="studentId"
                    value={currentEnrollment.studentId}
                    onChange={(e) =>
                      setCurrentEnrollment({ ...currentEnrollment, studentId: +e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Student ID"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="courseId" className="text-sm font-medium text-gray-700 mb-1">Course ID</label>
                  <input
                    type="number"
                    id="courseId"
                    value={currentEnrollment.courseId}
                    onChange={(e) =>
                      setCurrentEnrollment({ ...currentEnrollment, courseId: +e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Course ID"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="enrolledAt" className="text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    id="enrolledAt"
                    value={currentEnrollment.enrolledAt}
                    onChange={(e) =>
                      setCurrentEnrollment({ ...currentEnrollment, enrolledAt: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  />
                </div>

                    <div className="flex flex-col">
                    <label htmlFor="completedAt" className="text-sm font-medium text-gray-700 mb-1">Completion Date</label>
                    <input
                        type="date"
                        id="completedAt"
                        value={currentEnrollment.completedAt || ''}
                        onChange={(e) =>
                        setCurrentEnrollment({ ...currentEnrollment, completedAt: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    />
                     </div>


                <div className="flex flex-col">
                  <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status"
                    value={currentEnrollment.status}
                    onChange={(e) =>
                      setCurrentEnrollment({ ...currentEnrollment, status: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  >
                    <option value="ENROLLED">Enrolled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="DROPPED">Dropped</option>
                  </select>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentPage;
