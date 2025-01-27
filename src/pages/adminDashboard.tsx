// pages/dashboard.tsx

import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

interface DashboardProps {
  username: string;
  role: string; // Added role to pass from server to client
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
    // Decoding the token and getting username and role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string; role: string };
    return {
      props: {
        username: decoded.username,
        role: decoded.role, // Pass the role to the page props
      },
    };
  } catch (error) {
    console.error('Token decode failed:', error);
    return {
      redirect: {
        destination: '/adminLogin',
        permanent: false,
      },
    };
  }
};

const Dashboard = ({ username, role }: DashboardProps) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await fetch('/api/adminLogout', { method: 'POST' });
    router.push('/adminLogin');
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
          <a href="#" className="block text-black hover:bg-gray-700 p-3 rounded-md">Users</a>
          <a href="adminStudent" className="block text-black hover:bg-gray-700 p-3 rounded-md">Student</a>
          <a href="#" className="block text-black hover:bg-gray-700 p-3 rounded-md">Settings</a>
          <a href="#" className="block text-black hover:bg-gray-700 p-3 rounded-md">Reports</a>

          {/* Display Username and Role in Sidebar */}
          <div className="mt-4 px-3 py-2 text-white bg-gray-700 rounded-md">
            <span className="text-sm">Welcome, {username}!</span><br />
            <span className="text-xs">Role: {role}</span> {/* Show role */}
          </div>
        </nav>
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
          <h1 className="text-2xl font-semibold text-black">Welcome to the Admin Dashboard!</h1>
          <div className="flex items-center space-x-4">
            <span className="text-black font-semibold">{username}</span> {/* Display username in top bar */}
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
            This is where the content of the dashboard will be. You can display statistics, charts, or other
            information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
