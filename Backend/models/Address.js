import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: String,
        country: { type: String, required: true },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point", // ✅ better than required
            },
            coordinates: {
                type: [Number], // [lng, lat]
                required: true,
            },
        },
    },
    { timestamps: true } // ✅ handles createdAt & updatedAt automatically
);

// 🔥 required for geo queries
addressSchema.index({ location: "2dsphere" });

export default mongoose.model("Address", addressSchema);