// pages/api/predict_safety.js
import cors, { runMiddleware } from '../../utils/corsMiddleware';

export default async function handler(req, res) {
  // Apply CORS middleware
  await runMiddleware(req, res, cors);

  // Handle only POST requests
  if (req.method === 'POST') {
    const { Magnitude, Crime_Types, time_of_day, shops_nearby, proximity_police_station, reported_crimes } = req.body;

    // Validate the data (basic validation)
    if (
      Magnitude === undefined ||
      Crime_Types === undefined ||
      time_of_day === undefined ||
      shops_nearby === undefined ||
      proximity_police_station === undefined ||
      reported_crimes === undefined
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Mock response for prediction (since we don't have the real model here)
    const safetyScore = Math.random() * 100; // Random safety score for demonstration

    // Return safety prediction
    res.status(200).json({
      safetyScore,
      message: 'Safety prediction successful',
    });
  } else {
    // If method is not POST, return 405 (Method Not Allowed)
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
