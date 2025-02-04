import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "../globals.css";

interface Event {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  eventPlace: string;
  createdAt: string;
}

interface AdminEventsProps {
  username: string;
  role: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.adminAuthToken;

  if (!token) {
    return { redirect: { destination: '/adminLogin', permanent: false } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string; role: string };
    return { props: { username: decoded.username, role: decoded.role } };
  } catch (error) {
    return { redirect: { destination: '/adminLogin', permanent: false } };
  }
};

const AdminEvents = ({ username, role }: AdminEventsProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', eventDate: '', eventPlace: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/adminEvent');
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await res.json();
      setEvents(data); // Ensure this updates the list
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editEvent ? `/api/adminEvent` : '/api/adminEvent';
    const method = editEvent ? 'PATCH' : 'POST';
  
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editEvent?.id, ...formData }),
      });
  
      if (!res.ok) {
        throw new Error('Error submitting the event');
      }

      fetchEvents();
      setIsModalOpen(false);
      setEditEvent(null);
      setFormData({ name: '', description: '', eventDate: '', eventPlace: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const res = await fetch(`/api/adminEvent?id=${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error('Failed to delete event');
        }
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Event
          </button>
        </div>

        <div className="bg-white rounded-lg text-gray-500 shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Place</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{event.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(event.eventDate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.eventPlace}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditEvent(event);
                        setFormData({ 
                          name: event.name, 
                          description: event.description, 
                          eventDate: new Date(event.eventDate).toISOString().slice(0, 16), 
                          eventPlace: event.eventPlace 
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed text-gray-500 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">{editEvent ? 'Edit Event' : 'New Event'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Event Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Event Place</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.eventPlace}
                    onChange={(e) => setFormData({ ...formData, eventPlace: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditEvent(null);
                      setFormData({ name: '', description: '', eventDate: '', eventPlace: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editEvent ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminEvents;