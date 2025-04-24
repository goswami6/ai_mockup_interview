// /components/ReviewsList.jsx
"use client";
import { useState, useEffect } from "react"; // Import useEffect and useState from React

// Reviews Form component
function ReviewForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [improvement, setImprovement] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // POST the new review to the backend
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, review, improvement }),
    });

    const data = await response.json();

    if (response.ok) {
      onSubmit(); // Callback to refresh the reviews list after successful submission
      alert(data.message);
    } else {
      alert(data.error);
    }

    // Clear form fields after submission
    setName("");
    setReview("");
    setImprovement("");
  };

  return (
    <form onSubmit={handleSubmit} className="review-form p-6 bg-white rounded-lg shadow-md border mb-8">
      <div className="form-group mb-4">
        <label className="block text-lg font-medium">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded-md mt-2"
        />
      </div>
      <div className="form-group mb-4">
        <label className="block text-lg font-medium">Review:</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          className="w-full p-3 border rounded-md mt-2"
        />
      </div>
      <div className="form-group mb-4">
        <label className="block text-lg font-medium">Improvement Tip:</label>
        <textarea
          value={improvement}
          onChange={(e) => setImprovement(e.target.value)}
          required
          className="w-full p-3 border rounded-md mt-2"
        />
      </div>
      <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
        Post Review
      </button>
    </form>
  );
}

// Reviews List component to fetch and display reviews
export default function ReviewsList() {
  const [reviews, setReviews] = useState([]);

  // Fetch reviews when the component mounts
  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data.reviews);
  };

  // Refresh reviews list after submitting a new review
  const handleNewReview = () => {
    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="reviews-container max-w-4xl mx-auto mt-10">
      {/* Section for the Review Form */}
      <div className="review-form-section mb-12 bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-lg">
        <ReviewForm onSubmit={handleNewReview} />
      </div>

      {/* Section for the Reviews List */}
      <div >
  <h2 className="text-2xl font-bold mb-4 text-gray-800">Submitted Reviews</h2>
  <ul>
    {reviews.length === 0 ? (
      <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
    ) : (
      reviews.map((review, index) => (
        <li
        key={index}
        className="review-item mb-6 p-6 border-2 border-blue-300 rounded-xl bg-white shadow-lg hover:bg-gray-50 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{review.name}</h3>
        <p className="text-lg text-gray-800">{review.review}</p>
        <p className="italic text-gray-600 mt-2">Improvement: {review.improvement}</p>
        <p className="text-sm text-gray-400 mt-4">{new Date(review.date).toLocaleString()}</p>
      </li>
      
      ))
    )}
  </ul>
</div>

    </div>
  );
}
