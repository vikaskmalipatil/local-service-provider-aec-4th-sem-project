import express from "express";
import Invoice from "../models/Invoice.js";
import ServiceRequest from "../models/ServiceRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ─── PROVIDER: CREATE INVOICE ───────────────────────────────────────────────
router.post("/", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const { serviceRequestId, lineItems, taxRate, discount, notes, dueDate } = req.body;

    // Validate service request belongs to provider
    const request = await ServiceRequest.findById(serviceRequestId);
    if (!request) return res.status(404).json({ error: "Service request not found" });
    if (request.assignedProvider?.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not your request" });
    }

    // Calculate totals
    const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const tax      = taxRate ? (subtotal * taxRate) / 100 : 0;
    const disc     = discount || 0;
    const total    = subtotal + tax - disc;

    const invoice = await Invoice.create({
      serviceRequest: serviceRequestId,
      provider:       req.user.id,
      client:         request.user,
      lineItems,
      subtotal,
      taxRate:    taxRate || 0,
      taxAmount:  tax,
      discount:   disc,
      total,
      notes:      notes || "",
      dueDate:    dueDate || null,
    });

    // Populate for response
    const populated = await Invoice.findById(invoice._id)
      .populate("serviceRequest", "serviceType customServiceType details address")
      .populate("provider", "name email phone specialty")
      .populate("client", "name email");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PROVIDER: GET MY SENT INVOICES ─────────────────────────────────────────
router.get("/provider", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const invoices = await Invoice.find({ provider: req.user.id })
      .populate("serviceRequest", "serviceType customServiceType details address")
      .populate("client", "name email")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PROVIDER: UPDATE INVOICE STATUS ────────────────────────────────────────
router.put("/:id/status", authMiddleware, roleMiddleware("provider"), async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findOne({ _id: req.params.id, provider: req.user.id });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    invoice.status = status;
    await invoice.save();
    res.json({ msg: "Status updated", invoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── CLIENT: GET MY RECEIVED INVOICES ───────────────────────────────────────
router.get("/client", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ client: req.user.id })
      .populate("serviceRequest", "serviceType customServiceType details address")
      .populate("provider", "name email phone specialty")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SHARED: GET SINGLE INVOICE (provider or client) ────────────────────────
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("serviceRequest", "serviceType customServiceType details address createdAt")
      .populate("provider", "name email phone specialty address city state")
      .populate("client", "name email");

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    // Must be provider or client
    const isProvider = invoice.provider._id.toString() === req.user.id;
    const isClient   = invoice.client._id.toString() === req.user.id;
    if (!isProvider && !isClient) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
