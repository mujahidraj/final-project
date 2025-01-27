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
    <div className="flex  bg-gray-100 justify-center items-center">
      <div className="max-w-4xl h-full w-full bg-white shadow-lg rounded-lg p-6 m-10">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-2xl font-medium text-black">User Profile</h3>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="space-y-6">
          {!isEditing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="font-medium text-black">Full name</div>
                <div className="sm:col-span-2 text-black">{first_name} {last_name}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="font-medium text-black">Email address</div>
                <div className="sm:col-span-2 text-black">{email}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="font-medium text-black">Phone number</div>
                <div className="sm:col-span-2 text-black">{phone}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="font-medium text-black">Gender</div>
                <div className="sm:col-span-2 text-black">{gender}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="font-medium text-black">Present Address</div>
                <div className="sm:col-span-2 text-black">{present_address}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="font-medium text-black">Permanent Address</div>
                <div className="sm:col-span-2 text-black">{permanent_address}</div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                >
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="text-gray-500 border-2 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-black">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className=" text-gray-500 border-2 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className=" text-gray-500  border-2 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-black">Phone</label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className=" text-gray-500  border-2 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className=" text-gray-500  border-2 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-black">Present Address</label>
                  <input
                    type="text"
                    name="present_address"
                    value={formData.present_address}
                    onChange={handleChange}
                    className=" text-gray-500  border-2 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black">Permanent Address</label>
                  <input
                    type="text"
                    name="permanent_address"
                    value={formData.permanent_address}
                    onChange={handleChange}
                    className=" text-gray-500  border-2 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                <button type="submit" className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition w-full sm:w-auto">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition w-full sm:w-auto"
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
