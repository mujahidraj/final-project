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
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/studentLogin');
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-600">EduPlatform</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { name: 'My Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { name: 'Assignments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.name === 'Profile' ? '/studentProfile' : '#'}
              className="flex items-center p-3 space-x-3 text-gray-600 hover:bg-blue-50 rounded-lg group transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="group-hover:text-blue-600 transition-colors duration-200">{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 m-4 p-4 bg-white border border-blue-100 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {username.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{username}</p>
              <p className="text-xs text-blue-500">Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <div className="p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <span>Logout</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
                <div className="absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Click to logout
                </div>
              </div>
            </div>
          </header>

          {/* Welcome Card */}
          <div className="mb-8 animate-slide-in">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {username}!</h1>
              <p className="opacity-90">Check your latest courses and activities</p>
              <div className="mt-4 h-1 bg-white bg-opacity-20 rounded-full">
                <div className="w-1/3 h-full bg-white rounded-full transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Course Progress', value: '75%', color: 'from-green-400 to-blue-400' },
              { title: 'Active Courses', value: '3', color: 'from-purple-400 to-pink-400' },
              { title: 'Completed Assignments', value: '12/15', color: 'from-yellow-400 to-orange-400' },
            ].map((stat, index) => (
              <div
                key={stat.title}
                className={`bg-gradient-to-r ${stat.color} p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-200 animate-fade-in-up delay-${index * 100}`}
              >
                <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-white bg-opacity-20 rounded-full">
                    <div className="h-full bg-white rounded-full" style={{ width: `${Math.random() * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activities */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {[
                { course: 'Mathematics', activity: 'Completed Algebra Quiz', time: '2h ago' },
                { course: 'Literature', activity: 'Submitted Essay Assignment', time: '5h ago' },
                { course: 'Computer Science', activity: 'Started New Chapter: React Basics', time: '1d ago' },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{activity.course}</h3>
                    <p className="text-sm text-gray-500">{activity.activity}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
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