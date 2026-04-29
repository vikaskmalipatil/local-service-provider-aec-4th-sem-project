import express from "express";
import Review from "../models/Review.js";
import ServiceProvider from "../models/ServiceProvider.js";
import ServiceRequest from "../models/ServiceRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ SUBMIT A REVIEW (customer only, after job is completed)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { serviceRequestId, providerId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Ensure the request belongs to this user and is Completed
    const request = await ServiceRequest.findOne({
      _id: serviceRequestId,
      user: req.user.id,
      status: "Completed"
    });
    if (!request) {
      return res.status(404).json({ error: "Completed request not found or not yours" });
    }
    if (request.reviewed) {
      return res.status(400).json({ error: "You have already reviewed this job" });
    }

    // Create the review
    const review = await Review.create({
      serviceRequest: serviceRequestId,
      provider: providerId,
      customer: req.user.id,
      rating,
      comment: comment || ""
    });

    // Mark request as reviewed
    request.reviewed = true;
    await request.save();

    // Recalculate provider's average rating
    const allReviews = await Review.find({ provider: providerId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await ServiceProvider.findByIdAndUpdate(providerId, {
      averageRating: parseFloat(avg.toFixed(1)),
      reviewCount: allReviews.length
    });

    res.status(201).json({ msg: "Review submitted", review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already reviewed this job" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL REVIEWS FOR A PROVIDER (public)
router.get("/provider/:providerId", async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
