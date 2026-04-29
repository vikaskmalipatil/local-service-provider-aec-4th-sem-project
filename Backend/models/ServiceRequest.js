import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  customServiceType: {
    type: String,
    default: ""
  },
  details: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ["Low", "Normal", "High", "Emergency"],
    default: "Normal"
  },
  address: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"],
    default: "Pending"
  },
  // For direct provider booking
  requestedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    default: null
  },
  assignedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    default: null
  },
  estimatedArrivalTime: {
    type: Date,
    default: null
  },
  providerLocation: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  reviewed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("ServiceRequest", serviceRequestSchema);

