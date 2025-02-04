import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import "../globals.css";

interface Report {
  id: number;
  title: string;
  report: string;
  teacherName: string;
  courseName: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [form, setForm] = useState<Report>({
    title: '',
    report: '',
    teacherName: '',
    courseName: '',
    id: 0, // Set a default value for id
  });

  const router = useRouter(); // Initialize useRouter

  const fetchReports = async () => {
    try {
      const res = await axios.get('/api/studentReport');
      setReports(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (form.id) {
        // Update report
        await axios.patch('/api/studentReport', form);
      } else {
        // Create new report
        await axios.post('/api/studentReport', form);
      }

      setForm({ title: '', report: '', teacherName: '', courseName: '', id: 0 });
      fetchReports();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/studentReport?id=${id}`);
      fetchReports();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (report: Report) => {
    setForm(report);
  };

  const handleBackButton = () => {
    router.push('/studentDashboard'); // Navigate to the student dashboard
  };

  return (
    <div className="max-w-7xl h-screen-full text-gray-500 mx-auto p-4 bg-white">
      <h1 className="text-3xl font-semibold text-center mb-6">My Reports</h1>

      <button
        onClick={handleBackButton}
        className="mb-6 p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Back to Dashboard
      </button>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Report"
            value={form.report}
            onChange={(e) => setForm({ ...form, report: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Teacher Name"
            value={form.teacherName}
            onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Course Name"
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            {form.id ? 'Update' : 'Add'} Report
          </button>
        </div>
      </form>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-6">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Report</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Teacher</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Course</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-800">{report.title}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{report.report}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{report.teacherName || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{report.courseName || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(report)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
