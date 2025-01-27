import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/adminRegister', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (res.ok) {
      router.push('/adminLogin');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-full justify-center h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-green-500">
      {/* Logo and Company Name */}
      <div className="flex items-center mb-6">
        <img src="./image/1.png" alt="TechWisdom Logo" className="w-12 h-12 mr-2" />
        <h1 className="text-4xl font-semibold text-white">TechWisdom</h1>
      </div>

      <h2 className="text-3xl mb-4 text-white font-bold">Admin Registration</h2>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <input 
          type="text" 
          placeholder="Username" 
          required 
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          value={formData.username}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          value={formData.password}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300">
          Register
        </button>
      </form>

      {/* Sign In Link */}
      <p className="mt-4 text-white text-sm">
        Already have an account? <a href="/adminLogin" className="text-blue-400 hover:text-blue-600">Sign In</a>
      </p>
    </div>
  );
}
