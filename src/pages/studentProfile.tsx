import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";
import prisma from '@/lib/prisma';

interface ProfileProps {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: number;
  gender: string;
  present_address: string;
  permanent_address: string;
}

const Profile = ({
  first_name,
  last_name,
  username,
  email,
  phone,
  gender,
  present_address,
  permanent_address,
}: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: first_name || '',
    last_name: last_name || '',
    username: username || '',
    email: email || '',
    phone: phone || 0,
    gender: gender || '',
    present_address: present_address || '',
    permanent_address: permanent_address || '',
  });

  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/studentLogout', { method: 'POST' });
    if (res.ok) {
      router.push('/studentLogin');
    } else {
      console.error('Logout failed');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: first_name || '',
      last_name: last_name || '',
      username: username || '',
      email: email || '',
      phone: phone || 0,
      gender: gender || '',
      present_address: present_address || '',
      permanent_address: permanent_address || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/editStudentProfile', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        gender: formData.gender || null,
        present_address: formData.present_address || null,
        permanent_address: formData.permanent_address || null,
      }),
    });
    if (res.ok) {
      setIsEditing(false);
    } else {
      console.error('Error updating profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex bg-gradient-to-r from-blue-50 to-purple-50 justify-center items-center min-h-screen p-4">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">User Profile</h3>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-8">
          {!isEditing ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <p className="text-gray-900 font-medium">{first_name} {last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email Address</label>
                      <p className="text-gray-900 font-medium">{email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone Number</label>
                      <p className="text-gray-900 font-medium">{phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Gender</label>
                      <p className="text-gray-900 font-medium">{gender}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Address Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Present Address</label>
                      <p className="text-gray-900 font-medium">{present_address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Permanent Address</label>
                      <p className="text-gray-900 font-medium">{permanent_address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Edit Personal Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <input
                        type="number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Gender</label>
                      <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Edit Address Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Present Address</label>
                      <input
                        type="text"
                        name="present_address"
                        value={formData.present_address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Permanent Address</label>
                      <input
                        type="text"
                        name="permanent_address"
                        value={formData.permanent_address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.authToken;

  if (!token) {
    return {
      redirect: {
        destination: '/studentLogin',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
    const student = await prisma.students.findUnique({
      where: { username: decoded.username },
    });

    if (!student) {
      return {
        redirect: {
          destination: '/studentLogin',
          permanent: false,
        },
      };
    }

    return {
      props: {
        first_name: student.first_name,
        last_name: student.last_name,
        username: student.username,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        present_address: student.present_address,
        permanent_address: student.permanent_address,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/studentLogin',
        permanent: false,
      },
    };
  }
};

export default Profile;