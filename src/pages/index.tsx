import { useRouter } from 'next/router';
import { UserIcon, LockClosedIcon, PencilIcon } from '@heroicons/react/20/solid';
import "../globals.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Welcome to TechWisdom</h1>

        <div className="flex justify-between">
          {/* Login Section */}
          <div className="w-1/2 pr-4 border-r border-gray-300">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Login</h2>
            <div className="space-y-4">
              <button 
                onClick={() => router.push('studentLogin')} 
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none"
              >
                <UserIcon className="mr-2 h-5 w-5 text-white" />
                Student Login
              </button>

              <button 
                onClick={() => router.push('adminLogin')} 
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md shadow hover:bg-green-600 focus:outline-none"
              >
                <LockClosedIcon className="mr-2 h-5 w-5 text-white" />
                Admin Login
              </button>
            </div>
          </div>

          {/* Registration Section */}
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Register</h2>
            <div className="space-y-4">
              <button 
                onClick={() => router.push('/studentRegister')} 
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow hover:bg-blue-800 focus:outline-none"
              >
                <PencilIcon className="mr-2 h-5 w-5 text-white" />
                Student Registration
              </button>

              <button 
                onClick={() => router.push('/adminRegister')} 
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow hover:bg-green-800 focus:outline-none"
              >
                <PencilIcon className="mr-2 h-5 w-5 text-white" />
                Admin Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
