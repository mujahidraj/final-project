import { useRouter } from 'next/router';
import { UserIcon, LockClosedIcon, PencilIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion'; // Import Framer Motion
import "../globals.css";

export default function Home() {
  const router = useRouter();

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Animation variants for buttons
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl w-full bg-white p-8 shadow-2xl rounded-2xl"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
          Welcome to TechWisdom
        </h1>

        <div className="flex justify-between space-x-8">
          {/* Login Section */}
          <div className="w-1/2 pr-4 border-r border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
            <div className="space-y-6">
              <motion.button
                onClick={() => router.push('studentLogin')}
                className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <UserIcon className="mr-3 h-6 w-6 text-white" />
                Student Login
              </motion.button>

              <motion.button
                onClick={() => router.push('adminLogin')}
                className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <LockClosedIcon className="mr-3 h-6 w-6 text-white" />
                Admin Login
              </motion.button>

              {/* Teacher Login */}
              <motion.button
                onClick={() => router.push('teacherLogin')}
                className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <LockClosedIcon className="mr-3 h-6 w-6 text-white" />
                Teacher Login
              </motion.button>
            </div>
          </div>

          {/* Registration Section */}
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
            <div className="space-y-6">
              <motion.button
                onClick={() => router.push('/studentRegister')}
                className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <PencilIcon className="mr-3 h-6 w-6 text-white" />
                Student Registration
              </motion.button>

              <motion.button
                onClick={() => router.push('/adminRegister')}
                className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <PencilIcon className="mr-3 h-6 w-6 text-white" />
                Admin Registration
              </motion.button>

              {/* Teacher Registration */}
              <motion.button
                onClick={() => router.push('/teacherRegister')}
                className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <PencilIcon className="mr-3 h-6 w-6 text-white" />
                Teacher Registration
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
