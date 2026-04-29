import express from "express";
import ServiceRequest from "../models/ServiceRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ CREATE REQUEST
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { serviceType, customServiceType, details, urgency, address, requestedProvider } = req.body;
    
    if (!serviceType || !details) {
      return res.status(400).json({ error: "Service type and details are required" });
    }

    const request = await ServiceRequest.create({
      user: req.user.id,
      serviceType,
      customServiceType: customServiceType || "",
      details,
      urgency: urgency || "Normal",
      address: address || "",
      requestedProvider: requestedProvider || null
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET MY REQUESTS
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user.id })
      .populate("assignedProvider", "name phone")
      .populate("requestedProvider", "name")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CANCEL REQUEST
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const request = await ServiceRequest.findOne({ _id: req.params.id, user: req.user.id });
    if (!request) return res.status(404).json({ error: "Request not found" });
    
    if (request.status === "Completed") {
      return res.status(400).json({ error: "Cannot cancel a completed request" });
    }

    request.status = "Cancelled";
    await request.save();

    res.json({ msg: "Request cancelled successfully", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
