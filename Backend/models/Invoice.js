import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity:    { type: Number, required: true, min: 1 },
  unitPrice:   { type: Number, required: true, min: 0 },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
  },
  serviceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lineItems: [lineItemSchema],
  subtotal:   { type: Number, default: 0 },
  taxRate:    { type: Number, default: 0 },   // percentage e.g. 18
  taxAmount:  { type: Number, default: 0 },
  discount:   { type: Number, default: 0 },   // flat discount amount
  total:      { type: Number, default: 0 },
  notes:      { type: String, default: "" },
  status: {
    type: String,
    enum: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"],
    default: "Sent",
  },
  dueDate: { type: Date, default: null },
}, { timestamps: true });

// Auto-generate invoice number before save
invoiceSchema.pre("save", async function () {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;
  }
});

export default mongoose.model("Invoice", invoiceSchema);
