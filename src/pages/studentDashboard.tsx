// StudentDashboard.tsx

import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

import "../globals.css";
import { useEffect, useState } from 'react';

interface Notification {
  id: number;
  message: string;
  time: string;
}


interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
}


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

interface Event {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  eventPlace: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]); // Add this to store assignments

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

  // Fetch student notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/studentNotification');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
          
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();

        if (res.ok) {
          setCourses(data);
        } else {
          console.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/adminEvent");
        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/studentAssignment');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Assignments:', data); // Log the fetched assignments

          if (data.assignments && Array.isArray(data.assignments)) {
            setAssignments(data.assignments); // Set assignments
          } else {
            console.error('Assignments data is not an array');
          }
        } else {
          console.error('Failed to fetch assignments');
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []); // Empty dependency array ensures it runs only once

  
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  // Inside StudentDashboard.tsx

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  const toggleAnnouncement = async () => {
    setIsAnnouncementOpen(!isAnnouncementOpen);
    if (!isAnnouncementOpen) {
      try {
        const response = await fetch('/api/adminAnnouncement'); // Adjust this to your API route
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    }
  };


  const handleEnroll = (courseId: string) => {
    router.push(`/studentenrollment?courseId=${courseId}`);
  };

  return (
    <div className="h-screen-full bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Sidebar */}
      <aside
        className={`fixed  inset-y-0 left-0 w-64 bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-600">TechWisdom</span>
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
             { name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
           
            { name: 'My Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { name: 'My Enroll', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { name: 'Assignments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Report', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Review', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },

           
          ].map((item) => (
            <a
              key={item.name}
              href={item.name === 'Profile' ? '/studentProfile' : item.name === 'My Courses' ? '/studentCourse' : item.name === 'My Enroll' ? '/studentEnrolledCourse' : item.name === 'Report' ? '/studentReport' :item.name === 'Review' ? '/studentReview' : item.name === 'Assignments' ? '/studentAssignment' :'#'}
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
              <button
                onClick={toggleAnnouncement}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Announcements
              </button>

              {/* My Course */}
              <a
                href="/studentCourse"
                className="text-gray-600 hover:text-blue-600 transition-all duration-200"
              >
                Purchase-Courses
              </a>
              {/* My Enroll */}
              <a
                href="/studentEnrolledCourse"
                className="text-gray-600 hover:text-blue-600 transition-all duration-200"
              >
                Enrolled-Courses
              </a>
              {/* Assignments */}
              <a
                href="/studentAssignment"
                className="text-gray-600 hover:text-blue-600 transition-all duration-200"
              >
                Assignments
              </a>
              {/* Notifications */}

              {/* Notifications */}
              <div className="relative text-gray-700">
                <button
                  onClick={toggleNotification}
                  className="relative p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full" />
                  )}
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg max-w-xs w-64 p-4">
                    <h3 className="text-lg font-bold mb-4">Notifications</h3>
                    <ul>
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <li key={notification.id} className="mb-3">
                            <p className="text-sm">{notification.message}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">No new notifications</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {isAnnouncementOpen && (
                <div className="mt-4 text-blue-500 ag-row-position-relative p-4 bg-white rounded-lg shadow-lg">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div key={announcement.id} className="mb-4">
                        <h3 className="text-xl font-semibold">{announcement.heading}</h3>
                        <p className="text-gray-700">{announcement.body}</p>
                      </div>
                    ))
                  ) : (
                    <p>No announcements available.</p>
                  )}
                </div>
              )}


              {/* Logout Button */}
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

          
    {/* Other Components */}
    

          {/* Course and content display here */}
        </div>
        <div className="mb-8 animate-slide-in">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {username}!</h1>
            <p className="opacity-90">Check your latest courses , Announcements , Event Updates and Activities</p>
            <div className="mt-4 h-1 bg-white bg-opacity-20 rounded-full">
              <div className="w-1/3 h-full bg-white rounded-full transition-all duration-500" />
            </div>
          </div>
              {/*     Render Assignments */}
    <div className="mt-8 ml-6 mb-5">
      <h2 className="text-2xl text-gray-700 font-semibold mb-4">Assignments</h2>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.id} className="mb-4">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <p>{assignment.description}</p>
              <span className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-500'>No assignments available.</p>
      )}
    
  </div>

          <div className="w-3/3 my-4 p-6 bg-white shadow-lg rounded-xl">
    <h2 className="text-xl text-black font-semibold mb-4">Upcoming Events</h2>
    {events.map((event) => (
      <div key={event.id} className="mb-4 p-4 border text-black border-gray-500 rounded-lg">
        <h3 className="text-lg py-2 font-medium">{event.name}</h3>
        <p className="text-gray-600">{event.description}</p>
        <p className="text-sm text-gray-500">Date: {event.eventDate}</p>
        <p className="text-sm text-gray-500">Location: {event.eventPlace}</p>
      </div>
    ))}
  </div>
          <div className="p-6">
            {/* Courses Section */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Courses</h2>
            {loading ? (
              <div>Loading courses...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-xl font-bold text-blue-600">{course.name}</p>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                    <p className="text-gray-600 mt-2">Duration: {course.duration}</p>
                    <p className="text-gray-600 mt-2">Price: {course.price}</p>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                    >
                      Enroll
                    </button>
                  </div>
                ))}
              </div>
            )}
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
      

<footer className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      
      {/* Column 1: About */}
      <div>
        <h3 className="text-xl font-semibold mb-4">About</h3>
        <ul className="space-y-3">
          <li><a href="#" className="hover:text-blue-300">Our Story</a></li>
          <li><a href="#" className="hover:text-blue-300">Careers</a></li>
          <li><a href="#" className="hover:text-blue-300">Press</a></li>
          <li><a href="#" className="hover:text-blue-300">Blog</a></li>
        </ul>
      </div>

      {/* Column 2: Resources */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Resources</h3>
        <ul className="space-y-3">
          <li><a href="#" className="hover:text-blue-300">Documentation</a></li>
          <li><a href="#" className="hover:text-blue-300">API</a></li>
          <li><a href="#" className="hover:text-blue-300">Tutorials</a></li>
          <li><a href="#" className="hover:text-blue-300">Support</a></li>
        </ul>
      </div>

      {/* Column 3: Community */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Community</h3>
        <ul className="space-y-3">
          <li><a href="#" className="hover:text-blue-300">Forums</a></li>
          <li><a href="#" className="hover:text-blue-300">Events</a></li>
          <li><a href="#" className="hover:text-blue-300">Meetups</a></li>
          <li><a href="#" className="hover:text-blue-300">Contribute</a></li>
        </ul>
      </div>

      {/* Column 4: Contact */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Contact</h3>
        <ul className="space-y-3">
          <li><a href="mailto:contact@techwisdom.com" className="hover:text-blue-300">Email Us</a></li>
          <li><a href="#" className="hover:text-blue-300">Support Center</a></li>
          <li><a href="#" className="hover:text-blue-300">Social Media</a></li>
          <li><a href="#" className="hover:text-blue-300">FAQs</a></li>
        </ul>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="mt-12 border-t border-blue-600 pt-6 text-center text-sm">
      <p>© {new Date().getFullYear()} TechWisdom. All rights reserved.</p>
    </div>
  </div>
</footer>

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      first_name: string;
      last_name: string;
      username: string;
      email: string;
      phone: number;
      gender: string;
      present_address: string;
      permanent_address: string;
    };

    // Pass the username and role to the page
    return {
      props: {
        first_name: decoded.first_name || null,
        last_name: decoded.last_name || null,
        username: decoded.username || null,
        email: decoded.email || null,
        phone: decoded.phone || null,
        gender: decoded.gender || null,
        present_address: decoded.present_address || null,
        permanent_address: decoded.permanent_address || null,
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