import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

interface Assignment {
  id: string;
  title: string;
  body: string;
  points: string;
  dueDate: string;
  courseId: string;
}

const AssignmentsPage = () => {
  const router = useRouter();
  const { courseId } = router.query; // Extract courseId from URL query
  const [assignments, setAssignments] = useState<Assignment[]>([]); // Add type to assignments

  // Fetch assignments based on the courseId when the component mounts
  useEffect(() => {
    if (courseId) {
      const fetchAssignments = async () => {
        const res = await fetch(`/api/studentAssignment?courseId=${courseId}`);
        const data = await res.json();
        setAssignments(data);
      };

      fetchAssignments();
    }
  }, [courseId]);

  const handleBackClick = () => {
    // Navigate to the student dashboard page
    router.push('/studentDashboard');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackClick}
          className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none"
        >
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-semibold mb-4 text-gray-700">Course {courseId} Assignment </h1>

        

        {assignments.length > 0 ? (
          <ul className="space-y-4">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800">{assignment.title}</h3>
                <p className="text-gray-600 mt-2">{assignment.body}</p>
                <p className="mt-2 text-gray-500">Points: {assignment.points}</p>
                <p className="mt-1 text-gray-500">Due Date: {new Date(assignment.dueDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No assignments found for this course.</p>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
