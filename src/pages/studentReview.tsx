import { useState, useEffect } from 'react';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import "../globals.css";

const ReviewPage = () => {
  const router = useRouter();
  const { courseId } = router.query;

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const cookies = nookies.get();
    const token = cookies.authToken;
    setAuthToken(token);

    const fetchReviews = async () => {
      if (courseId) {
        const response = await fetch(`/api/courseReviews?courseId=${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
        }
      }
    };

    fetchReviews();
  }, [courseId]);

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!authToken) {
      setError('You must be logged in to submit a review');
      return;
    }

    const response = await fetch('/api/studentReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating,
        comment,
        courseId: parseInt(courseId as string, 10),
        authToken,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess('Review submitted successfully!');
      setRating(1);
      setComment('');
      setReviews([...reviews, { rating, comment }]);
    } else {
      setError(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className="max-w-3xl text-black  mx-auto p-6 bg-white rounded-lg shadow-lg mt-16">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">Submit Your Review</h1>
      <button
        className="mb-6 p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
        onClick={() => router.push('/studentDashboard')}
      >
        Back to Dashboard
      </button>
      <form onSubmit={handleReviewSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="courseId" className="text-lg font-medium text-gray-700 mb-2">
            Course ID:
          </label>
          <input
            type="text"
            id="courseId"
            value={courseId || ''}
            readOnly
            className="p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="rating" className="text-lg font-medium text-gray-700 mb-2">Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="comment" className="text-lg font-medium text-gray-700 mb-2">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
        >
          Submit Review
        </button>
      </form>

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      {success && <p className="text-green-600 text-center mt-4">{success}</p>}

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-lg font-medium text-gray-700">Rating: {review.rating}/5</p>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
