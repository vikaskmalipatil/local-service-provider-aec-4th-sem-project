import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ServiceProvider from "../models/ServiceProvider.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import ServiceRequest from "../models/ServiceRequest.js";

const router = express.Router();

// ✅ PROVIDER SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, specialty, phone, bio, experience } = req.body;

    const existing = await ServiceProvider.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Provider already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const provider = await ServiceProvider.create({
      name, email,
      password: hashedPassword,
      specialty, phone, bio,
      experience: experience || 0,
    });

    res.status(201).json({ msg: "Provider registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PROVIDER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const provider = await ServiceProvider.findOne({ email });
    if (!provider) return res.status(400).json({ msg: "Provider not found" });

    if (!provider.approved) {
      return res.status(403).json({ msg: "Your account is pending approval" });
    }

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: provider._id, role: "provider", specialty: provider.specialty },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      provider: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        specialty: provider.specialty,
        available: provider.available,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET MY PROFILE (provider)
router.get("/profile", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.user.id).select("-password");
    if (!provider) return res.status(404).json({ msg: "Provider not found" });
    res.json({ provider });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE MY PROFILE (provider)
router.put("/profile", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const { bio, phone, experience, available, address, city, state, zip, country, lat, lng } = req.body;
    
    const updateData = { bio, phone, experience, available };
    
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zip !== undefined) updateData.zip = zip;
    if (country !== undefined) updateData.country = country;
    
    if (lat !== undefined && lng !== undefined) {
      updateData.location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };
    }

    const provider = await ServiceProvider.findByIdAndUpdate(
      req.user.id,
      updateData,
      { returnDocument: "after" }
    ).select("-password");
    res.json({ provider });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL APPROVED PROVIDERS (public, for customers)
router.get("/all", async (req, res) => {
  try {
    const { specialty, lat, lng, maxDistance } = req.query;
    
    if (lat && lng) {
      // Use geospatial aggregation to get distance
      const distanceLimit = maxDistance ? parseInt(maxDistance) : 50000; // default 50km
      const query = { approved: true };
      if (specialty && specialty !== "All") query.specialty = specialty;

      const providers = await ServiceProvider.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            distanceField: "distance", // Distance in meters
            maxDistance: distanceLimit,
            query: query,
            spherical: true
          }
        },
        { $unset: "password" }
      ]);
      return res.json(providers);
    }

    // Normal query without location
    const filter = { approved: true };
    if (specialty && specialty !== "All") filter.specialty = specialty;
    const providers = await ServiceProvider.find(filter).select("-password");
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET REQUESTS ASSIGNED TO THIS PROVIDER
router.get("/requests", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      assignedProvider: req.user.id
    }).populate("user", "name email").sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL OPEN REQUESTS MATCHING PROVIDER SPECIALTY
router.get("/available-requests", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.user.id);
    
    // We want to find requests that are Pending, AND:
    // 1. Requested specifically for this provider (requestedProvider = provider._id)
    // OR
    // 2. Open to anyone (requestedProvider = null), AND the serviceType matches provider specialty (or custom logic)
    const requests = await ServiceRequest.find({
      status: "Pending",
      assignedProvider: null,
      $or: [
        { requestedProvider: provider._id },
        { 
          requestedProvider: null, 
          $or: [
            { serviceType: provider.specialty },
            { serviceType: "Other" } // Give them a chance to see custom requests
          ]
        }
      ]
    }).populate("user", "name email").sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ACCEPT A REQUEST
router.post("/accept/:requestId", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    if (request.assignedProvider) return res.status(400).json({ msg: "Request already assigned" });

    request.assignedProvider = req.user.id;
    request.status = "Assigned";
    await request.save();

    res.json({ msg: "Request accepted", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE REQUEST STATUS
router.put("/request/:requestId/status", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ServiceRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    if (request.assignedProvider?.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not your request" });
    }

    request.status = status;
    if (status === "Completed") {
      await ServiceProvider.findByIdAndUpdate(req.user.id, { $inc: { totalJobs: 1 } });
    }
    await request.save();
    res.json({ msg: "Status updated", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE TRACKING INFO (ETA & Location)
router.put("/request/:requestId/tracking", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const { eta, location } = req.body;
    const request = await ServiceRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    if (request.assignedProvider?.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not your request" });
    }

    if (eta) request.estimatedArrivalTime = eta;
    if (location) request.providerLocation = location;

    await request.save();
    res.json({ msg: "Tracking info updated", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
