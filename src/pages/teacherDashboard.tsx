import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import prisma from '../lib/prisma'; // Make sure to import your prisma client

interface TeacherProps {
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string | null;
  phone: string | null;
  address: string;
  bloodType: string;
  sex: string;
  birthday: string;
}

export default function TeacherDashboard({
  id,
  username,
  name,
  surname,
  email,
  phone,
  address,
  bloodType,
  sex,
  birthday,
}: TeacherProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/teacherLogout', { method: 'POST' });
    if (res.ok) {
      router.push('/teacherLogin');
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-6"
      >
        Logout
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Teacher Details</h2>
        <p><strong>Full Name:</strong> {name} {surname}</p>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Blood Type:</strong> {bloodType}</p>
        <p><strong>Gender:</strong> {sex}</p>
        <p><strong>Birthday:</strong> {birthday}</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.authToken;

  if (!token) {
    return { redirect: { destination: '/teacherLogin', permanent: false } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(decoded.userId) },
    });

    if (!teacher) {
      return { redirect: { destination: '/teacherLogin', permanent: false } };
    }

    return {
      props: {
        id: teacher.id,
        username: teacher.username,
        name: teacher.name,
        surname: teacher.surname,
        email: teacher.email,
        phone: teacher.phone,
        address: teacher.address,
        bloodType: teacher.bloodType,
        sex: teacher.sex,
        birthday: teacher.birthday.toISOString(),
      },
    };
  } catch (error) {
    return { redirect: { destination: '/teacherLogin', permanent: false } };
  }
};
