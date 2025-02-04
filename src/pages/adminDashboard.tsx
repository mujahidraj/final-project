import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaChartLine, FaUsers, FaCog, FaFileAlt, FaSignOutAlt, FaBars, FaBell } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../globals.css";

interface DashboardProps {
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
    return {
      props: {
        username: decoded.username,
        role: decoded.role,
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
  const [notifications, setNotifications] = useState<any[]>([]); // Change type to any[] to handle objects
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/adminNotification');  // API endpoint to fetch notifications
        const data = await res.json();

        if (res.ok) {
          setNotifications(data.notifications.reverse());  // Ensure this is an array of objects or strings
        } else {
          console.error('Error fetching notifications:', data.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();  // Fetch notifications when component mounts
  }, []);  // Empty dependency array ensures this runs only once after component mounts

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await fetch('/api/adminLogout', { method: 'POST' });
    router.push('/adminLogin');
  };

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  // Sample data for the chart
  const chartData = [
    { name: 'Jan', users: 4000, courses: 2400 },
    { name: 'Feb', users: 3000, courses: 1398 },
    { name: 'Mar', users: 2000, courses: 9800 },
    { name: 'Apr', users: 2780, courses: 3908 },
    { name: 'May', users: 1890, courses: 4800 },
    { name: 'Jun', users: 2390, courses: 3800 },
    { name: 'Jul', users: 3490, courses: 4300 },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-md transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <img src="/image/1.png" alt="Logo" className="w-10 h-10" />
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="px-2 py-4 space-y-2">
          <a href="/adminAnnouncement" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
            <FaChartLine className="w-5 h-5 mr-3" />
            Announcement
          </a>
          <a href="/adminCourse" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
            <FaUsers className="w-5 h-5 mr-3" />
            Courses
          </a>
          <a href="/adminEnrollment" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
            <FaUsers className="w-5 h-5 mr-3" />
            Enrollments
          </a>
          <a href="adminStudent" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
            <FaUsers className="w-5 h-5 mr-3" />
            Students
          </a>
          <a href="adminTransaction" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
            <FaUsers className="w-5 h-5 mr-3" />
            Transaction Statement
          </a>
          <a href="#" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
            <FaCog className="w-5 h-5 mr-3" />
            Settings
          </a>
          <a href="adminEvent" className="flex items-center p-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md">
            <FaFileAlt className="w-5 h-5 mr-3" />
            events
          </a>

          {/* Display Username and Role in Sidebar */}
          <div className="mt-4 px-3 py-2 text-white bg-gray-700 rounded-md">
            <span className="text-sm">Welcome, {username}!</span><br />
            <span className="text-xs">Role: {role}</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900">
            <FaBars className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome to the Admin Dashboard!</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-800 font-semibold">{username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
            >
              <FaSignOutAlt className="w-5 h-5 mr-2" />
              Logout
            </button>
            {/* Notifications Icon */}
            <div className="relative">
              <button
                onClick={handleToggleNotifications}
                className="text-gray-800 p-2 rounded-md hover:bg-gray-200"
              >
                <FaBell className="w-5 h-5" />
              </button>
              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 text-black w-64 mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="p-4 text-gray-800 font-semibold">Notifications</div>
                  <ul className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <li key={index} className="px-4 py-2 hover:bg-gray-100">
                          {notification.message || notification}  {/* Adjusted to render the notification message */}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No notifications available</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900">12,345</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Total Courses</h3>
            <p className="text-2xl font-bold text-gray-900">678</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Total Enrollments</h3>
            <p className="text-2xl font-bold text-gray-900">5,678</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Users and Courses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#8884d8" />
              <Bar dataKey="courses" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
