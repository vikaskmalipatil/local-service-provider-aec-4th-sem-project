import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";

import authRoutes from "./routes/auth.js";
import addressRoutes from "./routes/addressRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/requests", serviceRequestRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/invoices", invoiceRoutes);

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (requestId) => {
    socket.join(requestId);
    console.log(`User joined room: ${requestId}`);
  });

  socket.on("send_message", async (data) => {
    const { requestId, senderId, senderRole, content } = data;
    
    try {
      const newMessage = new Message({
        serviceRequestId: requestId,
        senderId,
        senderRole,
        content
      });
      await newMessage.save();
      
      io.to(requestId).emit("receive_message", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// JSON 404 fallback
app.use((req, res, next) => {
  res.status(404).json({ error: "API Route Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// start server
httpServer.listen(5000, () => console.log("Server running on port 5000"));