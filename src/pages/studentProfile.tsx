import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";
import prisma from '@/lib/prisma';

interface ProfileProps {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  img?: string;
  bloodType: string;
  sex: string;
  birthday: string;
}

const Profile = ({
  name,
  surname,
  username,
  email,
  phone,
  address,
  img,
  bloodType,
  sex,
  birthday,
}: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: name || '',
    surname: surname || '',
    username: username || '',
    email: email || '',
    phone: phone || '',
    address: address || '',
    img: img || '',
    bloodType: bloodType || '',
    sex: sex || '',
    birthday: birthday || '',
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
      name: name || '',
      surname: surname || '',
      username: username || '',
      email: email || '',
      phone: phone || '',
      address: address || '',
      img: img || '',
      bloodType: bloodType || '',
      sex: sex || '',
      birthday: birthday || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedBirthday = new Date(formData.birthday).toISOString().split('T')[0]; // YYYY-MM-DD
    const res = await fetch('/api/editStudentProfile', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name || null,
        surname: formData.surname || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        img: formData.img || null,
        bloodType: formData.bloodType || null,
        sex: formData.sex || null,
        birthday: formData.birthday || null,
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
                      <p className="text-gray-900 font-medium">{name} {surname}</p>
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
                      <p className="text-gray-900 font-medium">{sex}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Birthday</label>
                      <p className="text-gray-900 font-medium">{new Date(birthday).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Address Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Address</label>
                      <p className="text-gray-900 font-medium">{address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Blood Type</label>
                      <p className="text-gray-900 font-medium">{bloodType}</p>
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
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Last Name</label>
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
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
                        type="text"
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
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Birthday</label>
                      <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
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
                      <label className="text-sm text-gray-500">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Blood Type</label>
                      <input
                        type="text"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300"
                >
                  Save Changes
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
        destination: '/studentLogin', // Redirect to login if no token
        permanent: false,
      },
    };
  }

  try {
    // Validate the JWT token for the student
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };

    const student = await prisma.students.findUnique({
      where: { username: decoded.username },
    });

    if (!student) {
      console.log('Student not found. Redirecting to login...');
      return {
        redirect: {
          destination: '/studentLogin',
          permanent: false,
        },
      };
    }

    // Format birthday before passing it to the page
    const formattedBirthday = student.birthday ? new Date(student.birthday).toISOString().split('T')[0] : '';

    // Pass the username and role to the page
    return {
      props: {
        name: student.name,
        surname: student.surname,
        username: student.username,
        email: student.email,
        phone: student.phone,
        address: student.address,
        bloodType: student.bloodType,
        sex: student.sex,
        birthday: formattedBirthday, // Return the formatted string
        img: student.img || null,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/studentLogin', // Redirect to login if token is invalid or expired
        permanent: false,
      },
    };
  }
};


export default Profile;
