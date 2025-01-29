  import { useState } from 'react';
  import { useRouter } from 'next/router';
  import "../globals.css";

  export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const { username, password } = formData;

      const res = await fetch('/api/adminLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.role === 'admin') {
        console.log('Admin login successful');
        router.replace('/adminDashboard'); // Use replace instead of push
      } else {
        console.error('Login failed:', data.error || 'Unauthorized');
        alert(data.error || 'Invalid credentials or not an admin');
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-green-500">
        {/* Logo and Company Name */}
        <div className="flex items-center mb-6">
          <img
            src="/image/1.png" 
            alt="TechWisdom Logo"
            className="w-12 h-12 mr-2"
          />
          <h1 className="text-4xl font-semibold text-white">TechWisdom</h1>
        </div>

        <h2 className="text-3xl mb-4 text-white">Sign in to your Admin Account</h2>

        {/* Login Form */}
        <div className="w-full sm:w-96">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-lg">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-2 p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="mt-2 p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
