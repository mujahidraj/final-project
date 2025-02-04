import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

interface Teacher {
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
  password: string;
}

interface TeachersPageProps {
  teachers: Teacher[];
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

    const res = await fetch(`${baseUrl}/api/adminAllTeacher`); // Change API endpoint for teachers
    if (!res.ok) {
      throw new Error('Failed to fetch teachers');
    }
    const teachers = await res.json();

    return {
      props: {
        username: decoded.username,
        role: decoded.role,
        teachers,
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

const TeachersPage = ({ teachers, username, role }: TeachersPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Teacher>({
    id: 0,
    name: '',
    surname: '',
    email: '',
    username: '',
    phone: '',
    sex: '',
    address: '',
    bloodType: '',
    birthday: '',
    password: '',
  });

  const router = useRouter();

  const handleEdit = (teacher: Teacher) => {
    setIsEditing(true);
    setCurrentTeacher(teacher);
  };

  const handleDelete = async (teacherId: number, name: string, surname: string) => {
    await fetch('/api/adminDeleteTeacher', {
      method: 'DELETE',
      body: JSON.stringify({ teacherId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert(`Teacher ${name} ${surname} has been deleted.`);
    setTimeout(() => {
      router.reload();
    }, 2000);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentTeacher) return;

    const updatedTeacher = { ...currentTeacher };

    const res = await fetch('/api/adminUpdateTeacher', {
      method: 'PUT',
      body: JSON.stringify({ teacherId: currentTeacher.id, updatedTeacher }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert(`${currentTeacher.name} ${currentTeacher.surname} has been updated.`);
      setIsEditing(false);
      router.reload();
    } else {
      alert('Failed to update teacher');
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/adminAddTeacher', {
      method: 'POST',
      body: JSON.stringify(newTeacher),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert(`${newTeacher.name} ${newTeacher.surname} has been added.`);
      setIsAdding(false);
      router.reload();
    } else {
      alert('Failed to add teacher');
    }
  };

  return (
    <div className="flex bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 min-h-screen">
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">Manage Teachers</h1>

        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-700 transition duration-300"
        >
          Add New Teacher
        </button>

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
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.surname}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.username}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.sex}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.address}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.bloodType}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{teacher.birthday}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300 ease-in-out"
                    onClick={() => handleEdit(teacher)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold transition duration-300 ease-in-out ml-4"
                    onClick={() => handleDelete(teacher.id, teacher.name, teacher.surname)}
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Teacher</h2>
              <form onSubmit={handleAddTeacher} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Name"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="surname" className="text-sm font-medium text-gray-700 mb-1">Surname</label>
                  <input
                    type="text"
                    id="surname"
                    value={newTeacher.surname}
                    onChange={(e) => setNewTeacher({ ...newTeacher, surname: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Surname"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Email"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={newTeacher.username}
                    onChange={(e) => setNewTeacher({ ...newTeacher, username: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Username"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Phone"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="sex" className="text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <input
                    type="text"
                    id="sex"
                    value={newTeacher.sex}
                    onChange={(e) => setNewTeacher({ ...newTeacher, sex: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Gender"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={newTeacher.address}
                    onChange={(e) => setNewTeacher({ ...newTeacher, address: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Address"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="bloodType" className="text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <input
                    type="text"
                    id="bloodType"
                    value={newTeacher.bloodType}
                    onChange={(e) => setNewTeacher({ ...newTeacher, bloodType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Blood Type"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="birthday" className="text-sm font-medium text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    id="birthday"
                    value={newTeacher.birthday}
                    onChange={(e) => setNewTeacher({ ...newTeacher, birthday: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Birthday"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={newTeacher.password}
                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Add Teacher
                </button>
              </form>
              <button
                className="mt-4 text-red-600 hover:text-red-800 transition duration-300"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isEditing && currentTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-xl w-80 transform transition-all duration-300 scale-105">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Teacher</h2>
              <form onSubmit={handleSaveChanges} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={currentTeacher.name}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Name"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="surname" className="text-sm font-medium text-gray-700 mb-1">Surname</label>
                  <input
                    type="text"
                    id="surname"
                    value={currentTeacher.surname}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, surname: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Surname"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={currentTeacher.email}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Email"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={currentTeacher.username}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, username: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Username"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={currentTeacher.phone}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Phone"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="sex" className="text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <input
                    type="text"
                    id="sex"
                    value={currentTeacher.sex}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, sex: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Gender"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={currentTeacher.address}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, address: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Address"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="bloodType" className="text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <input
                    type="text"
                    id="bloodType"
                    value={currentTeacher.bloodType}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, bloodType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Blood Type"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="birthday" className="text-sm font-medium text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    id="birthday"
                    value={currentTeacher.birthday}
                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, birthday: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    placeholder="Birthday"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Save Changes
                </button>
              </form>
              <button
                className="mt-4 text-red-600 hover:text-red-800 transition duration-300"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;
