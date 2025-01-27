import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  gender: string;
  present_address: string;
  permanent_address: string;
}

interface StudentsPageProps {
  students: Student[];
  username: string;
  role: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.adminAuthToken;

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

    const res = await fetch(`${baseUrl}/api/adminAllStudent`);
    if (!res.ok) {
      throw new Error('Failed to fetch students');
    }
    const students = await res.json();

    return {
      props: {
        username: decoded.username,
        role: decoded.role,
        students,
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

const StudentsPage = ({ students, username, role }: StudentsPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const router = useRouter();

  const handleEdit = (student: Student) => {
    setIsEditing(true);
    setCurrentStudent(student);
  };

  const handleDelete = async (studentId: number, first_name: string, last_name: string) => {
    await fetch('/api/adminDeleteStudent', {
      method: 'DELETE',
      body: JSON.stringify({ studentId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert(`Student ${first_name} ${last_name} has been deleted.`);
    setTimeout(() => {
      router.reload();
    }, 2000);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentStudent) return;

    const updatedStudent = { ...currentStudent };

    const res = await fetch('/api/adminUpdateStudent', {
      method: 'PUT',
      body: JSON.stringify({ studentId: currentStudent.id, updatedStudent }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert(`${currentStudent.first_name} ${currentStudent.last_name} has been updated.`);
      setIsEditing(false);
      router.reload();
    } else {
      alert('Failed to update student');
    }
  };

  return (
    <div className="flex bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 min-h-screen">
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">Manage Student</h1>
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-800 text-white text-xs">
            <tr>
              <th className="px-4 py-2 text-left">First Name</th>
              <th className="px-4 py-2 text-left">Last Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Present Address</th>
              <th className="px-4 py-2 text-left">Permanent Address</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 text-xs">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                <td className="px-4 py-3 text-sm text-gray-700">{student.first_name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.last_name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.username}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.gender}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.present_address}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.permanent_address}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300 ease-in-out"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold transition duration-300 ease-in-out ml-4"
                    onClick={() => handleDelete(student.id, student.first_name, student.last_name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isEditing && currentStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-xl w-80 transform transition-all duration-300 scale-105">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Student</h2>
              <form onSubmit={handleSaveChanges} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['first_name', 'last_name', 'email', 'phone', 'gender', 'present_address', 'permanent_address'].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label htmlFor={field} className="text-sm font-medium text-gray-700 mb-1">
                      {field.replace('_', ' ').toUpperCase()}
                    </label>
                    <input
                      type="text"
                      id={field}
                      value={(currentStudent as any)[field]}
                      onChange={(e) =>
                        setCurrentStudent({ ...currentStudent, [field]: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                      placeholder={field.replace('_', ' ')}
                      style={{ maxHeight: '40px' }}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="col-span-2 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out"
                >
                  Save Changes
                </button>
              </form>
              <button
                onClick={() => setIsEditing(false)}
                className="mt-4 text-red-500 hover:underline w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
