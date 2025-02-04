import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';



export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const router = useRouter();
  const { courseId } = router.query;

  useEffect(() => {
    if (!courseId) return;

    async function fetchLessons() {
      try {
        const response = await axios.get(`/api/studentLessor?courseId=${courseId}`, {
          withCredentials: true,
        });
        setLessons(response.data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    }

    fetchLessons();
  }, [courseId]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleBackClick = () => {
    router.push('/studentEnrolledCourse'); // Navigates to the studentEnrollCourse page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 flex flex-col items-center">
      {/* Back Button */}
      <motion.button
        onClick={handleBackClick}
        className="self-start text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full shadow-md mb-8 transition duration-300 ease-in-out"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        Back to Enrolled Courses
      </motion.button>

      <motion.h1
        className="text-3xl font-bold text-gray-900 mb-12 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        Course {courseId} Module
      </motion.h1>

      {lessons.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {lessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition duration-300 ease-in-out"
              variants={containerVariants}
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{lesson.name}</h3>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Start:</span> {new Date(lesson.startTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">End:</span> {new Date(lesson.endTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mt-3">
                <strong className="font-semibold">Course:</strong> {lesson.course?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong className="font-semibold">Teacher:</strong> {lesson.teacher?.name || 'N/A'}
              </p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          className="text-center text-gray-500 mt-12 text-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          No lessons found for this course.
        </motion.p>
      )}
    </div>
  );
}
