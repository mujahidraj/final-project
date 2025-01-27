import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css"

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password } = formData;

    const res = await fetch('/api/studentLogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log('Login successful');
      router.push('/studentDashboard'); // Redirect after successful login
    } else {
      console.error('Login failed:', data.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Student Logout functionality
  const handleLogout = async () => {
    const res = await fetch('/api/studentLogout', { method: 'POST' });
    if (res.ok) {
      console.log('Logout successful');
      router.push('/studentLogin'); // Redirect to login after successful logout
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-full justify-center h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-green-500">
      {/* Logo and Company Name */}
      <div className="flex items-center mb-6">
        <img src="./image/1.png" alt="TechWisdom Logo" className="w-12 h-12 mr-2" />
        <h1 className="text-4xl font-semibold text-white">TechWisdom</h1>
      </div>

      <h2 className="text-3xl mb-4 text-white font-bold">Student Sign In</h2>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300">
          Login
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="mt-4 text-white text-sm">
        Don't have an account? <a href="/studentRegister" className="text-blue-400 hover:text-blue-600">Sign Up</a>
      </p>
    </div>
  );
}
