import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import "../globals.css";

export default function TeacherLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password } = formData;
    const res = await fetch('/api/teacherLogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log('Login successful');
      router.push('/teacherDashboard');
    } else {
      console.error('Login failed:', data.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 p-4">
      {/* Logo and Company Name */}
      <motion.div
        className="flex items-center mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <img src="./image/1.png" alt="TechWisdom Logo" className="w-16 h-16 mr-3" />
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">TechWisdom</h1>
      </motion.div>

      {/* Login Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-10 bg-white rounded-2xl shadow-2xl max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl mb-6 text-center text-gray-800 font-bold">
          Teacher Sign In
        </h2>

        <label htmlFor="username" className="sr-only">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
          required
        />

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
          required
        />

        <motion.button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 font-semibold text-lg"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Login
        </motion.button>
      </motion.form>

      {/* Sign Up Link */}
      <motion.p
        className="mt-6 text-white text-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        Don't have an account?{' '}
        <a href="/teacherRegister" className="text-blue-300 hover:text-blue-400 font-semibold">
          Sign Up
        </a>
      </motion.p>
    </div>
  );
}
