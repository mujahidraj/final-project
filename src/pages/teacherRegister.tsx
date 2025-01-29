import { useState } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    address: '',
    bloodType: '',
    sex: '',
    birthday: '',
    termsAccepted: false,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    const res = await fetch('/api/teacherRegister', {  // Adjusted endpoint for teacher registration
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    console.log(result);
    if (res.ok) {
      alert('Registration successful');
      router.push('/teacherLogin'); // Redirect to teacher login page after successful registration
    } else {
      alert(`Registration failed: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 py-10">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/image/1.png" alt="Company Logo" className="w-24 h-24 mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">TechWisdom</h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Teacher Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-8">
            <div className="flex flex-col w-1/2 space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-900">General Information</h3>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  required
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-900">Surname</label>
                <input
                  type="text"
                  placeholder="Surname"
                  required
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-900">Gender</label>
                <select
                  required
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-900">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  required
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-900">Blood Type</label>
                <input
                  type="text"
                  placeholder="Blood Type"
                  required
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-900">Birthday</label>
                <input
                  type="date"
                  required
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            <div className="w-px bg-gray-300"></div>

            <div className="flex flex-col w-1/2 space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-900">Personal Information</h3>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  required
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  required
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">Phone</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
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
