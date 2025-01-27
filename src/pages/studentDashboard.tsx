// StudentDashboard.tsx

import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { useState } from 'react';
import "../globals.css";

interface StudentProps {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: number;
  gender: string;
  present_address: string;
  permanent_address: string;
}

export default function StudentDashboard({
  first_name,
  last_name,
  username,
  email,
  phone,
  gender,
  present_address,
  permanent_address }: StudentProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    const res = await fetch('/api/studentLogout', { method: 'POST' });
    if (res.ok) {
      router.push('/studentLogin'); // Redirect to login after successful logout
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-30 bg-gray-800 bg-opacity-50 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-500 shadow-md transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <img src="/image/1.png" alt="Logo" className="w-10 h-10" />
          <button onClick={toggleSidebar} className="text-black hover:text-gray-800">
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="px-2 py-4 space-y-2">
          <a href="#" className="block text-black hover:bg-gray-700 p-3 rounded-md">Dashboard</a>
          <a href="#" className="block text-black hover:bg-gray-700 p-3 rounded-md">My Courses</a>
          <a href="#" className="block text-black hover:bg-gray-700 p-3 rounded-md">Assignments</a>
          <a href="/studentProfile" className="block text-black hover:bg-gray-700 p-3 rounded-md">Profile</a> {/* Profile Link */}
        </nav>

        {/* User Info in Sidebar */}
        <div className="mt-4 px-3 py-2 text-white bg-gray-700 rounded-md">
          <span className="text-sm">Welcome, {username}!</span><br />
          <span className="text-xs">Role: Student</span> {/* Show role */}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={toggleSidebar} className="text-black hover:text-gray-300">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-black">Welcome to the Student Dashboard!</h1>
          <div className="flex items-center space-x-4">
            <span className="text-black font-semibold">Hello,{username} !</span>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 text-black p-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Overview</h2>
          <p className="text-black">
            This is where the content of the student dashboard will be. You can display course details, assignments, or other student-related information.
          </p>
        </div>
      </div>
    </div>
  );
}

// Protect the dashboard page with server-side validation of JWT token
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {   first_name: string;
      last_name: string;
      username: string;
      email: string;
      phone: number;
      gender: string;
      present_address: string;
      permanent_address: string;};

    // Pass the username and role to the page
    return {
      props: {
        first_name: decoded.first_name||null,
        last_name: decoded.last_name||null,
        username: decoded.username ||null,
        email: decoded.email ||null,
        phone: decoded.phone ||null,
        gender: decoded.gender ||null,
        present_address: decoded.present_address ||null,
        permanent_address: decoded.permanent_address ||null,
       
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
