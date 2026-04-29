import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  serviceRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderRole: {
    type: String,
    enum: ["user", "provider"],
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
