import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Get messages for a specific service request
router.get("/:requestId", async (req, res) => {
  try {
    const messages = await Message.find({ serviceRequestId: req.params.requestId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
