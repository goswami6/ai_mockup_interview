// /pages/api/reviews.js

// Initialize an array to store reviews (this is temporary, will reset on server restart)
let reviews = [];

// POST request to submit a review
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, review, improvement } = req.body;

    // Validate the data
    if (!name || !review || !improvement) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create a new review and add it to the reviews array
    const newReview = { name, review, improvement, date: new Date().toISOString() };
    reviews.push(newReview);

    // Return success response
    return res.status(200).json({ message: "Review posted successfully!" });
  }

  // GET request to fetch reviews
  if (req.method === "GET") {
    return res.status(200).json({ reviews });
  }

  // Handle unsupported HTTP methods
  return res.status(405).json({ error: "Method not allowed" });
}
