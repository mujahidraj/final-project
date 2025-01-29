import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

interface Student {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  phone: string;
  sex: string;
  address: string;
  bloodType: string;
  birthday: string;
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

  const handleDelete = async (studentId: number, name: string, surname: string) => {
    await fetch('/api/adminDeleteStudent', {
      method: 'DELETE',
      body: JSON.stringify({ studentId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert(`Student ${name} ${surname} has been deleted.`);
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
      alert(`${currentStudent.name} ${currentStudent.surname} has been updated.`);
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
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Surname</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Blood Group</th>
              <th className="px-4 py-2 text-left">Birthday</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 text-xs">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                <td className="px-4 py-3 text-sm text-gray-700">{student.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.surname}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.username}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.sex}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.address}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.bloodType}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.birthday}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300 ease-in-out"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold transition duration-300 ease-in-out ml-4"
                    onClick={() => handleDelete(student.id, student.name, student.surname)}
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
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={currentStudent.name}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Name"
                    style={{ maxHeight: '40px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="surname" className="text-sm font-medium text-gray-700 mb-1">Surname</label>
                  <input
                    type="text"
                    id="surname"
                    value={currentStudent.surname}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, surname: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Surname"
                    style={{ maxHeight: '40px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={currentStudent.email}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Email"
                    style={{ maxHeight: '40px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    value={currentStudent.phone}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Phone"
                    style={{ maxHeight: '40px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="sex" className="text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <input
                    type="text"
                    id="sex"
                    value={currentStudent.sex}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, sex: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Gender"
                    style={{ maxHeight: '40px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={currentStudent.address}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, address: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Address"
                    style={{ maxHeight: '40px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="blood_group" className="text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    id="blood_group"
                    value={currentStudent.bloodType}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, bloodType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Blood Group"
                    style={{ maxHeight: '40px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="birthday" className="text-sm font-medium text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    id="birthday"
                    value={currentStudent.birthday}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, birthday: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    style={{ maxHeight: '40px' }}
                  />
                </div>
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

export default StudentsPage
