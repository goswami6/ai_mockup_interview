// Sample data to simulate storing reviews (in-memory)
let reviews = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, review, improvement } = req.body;

    if (!name || !review || !improvement) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newReview = {
      name,
      review,
      improvement,
      date: new Date().toISOString(),
    };

    reviews.push(newReview);

    return res.status(200).json({ message: "Review posted successfully!" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
