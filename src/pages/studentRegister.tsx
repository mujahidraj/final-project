import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    gender: '',
    present_address: '',
    permanent_address: '',
    termsAccepted: false,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/studentRegister', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (res.ok) {
      router.push('/studentLogin');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 py-10">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        
        {/* Logo and Company Name */}
        <div className="flex flex-col items-center mb-6">
          <img src="/image/1.png" alt="Company Logo" className="w-24 h-24 mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">TechWisdom</h1>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Student Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-8">
            {/* Public Information */}
            <div className="flex flex-col w-1/2 space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-900">General Information</h3>
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-900">First Name</label>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  required 
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-900">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  required 
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-900">Gender</label>
                <select 
                  required 
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="present_address" className="block text-sm font-medium text-gray-900">Present Address</label>
                <input 
                  type="text" 
                  placeholder="Present Address" 
                  required 
                  onChange={(e) => setFormData({ ...formData, present_address: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="permanent_address" className="block text-sm font-medium text-gray-900">Permanent Address</label>
                <input 
                  type="text" 
                  placeholder="Permanent Address" 
                  required 
                  onChange={(e) => setFormData({ ...formData, permanent_address: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-gray-300"></div>

            {/* Personal Information */}
            <div className="flex flex-col w-1/2 space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-900">Personal Information</h3>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
                <input 
                  type="text" 
                  placeholder="Username" 
                  required 
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">Phone</label>
                <input 
                  type="text" 
                  placeholder="Phone" 
                  required 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2 mt-4">
            <input 
              type="checkbox" 
              id="termsAccepted" 
              checked={formData.termsAccepted} 
              onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-900">I agree to the <a href="#" className="text-blue-600">Terms and Conditions</a></label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 mt-6"
            disabled={!formData.termsAccepted}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
