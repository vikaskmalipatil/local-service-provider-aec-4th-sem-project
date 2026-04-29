import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "provider" },
  specialty: {
    type: String,
    required: true
  },
  phone: { type: String },
  bio: { type: String, default: "" },
  experience: { type: Number, default: 0 }, // years of experience
  rating: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  approved: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  profileImage: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("ServiceProvider", serviceProviderSchema);
