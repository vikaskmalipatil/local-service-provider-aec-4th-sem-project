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
  
  // Location fields
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zip: { type: String, default: "" },
  country: { type: String, default: "" },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0]
    }
  }
}, { timestamps: true });

// Required for geo queries
serviceProviderSchema.index({ location: "2dsphere" });

export default mongoose.model("ServiceProvider", serviceProviderSchema);
