const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use("/", express.static("public")); // Serve static files from 'public' directory
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI =
  "mongodb+srv://surendernirvana425:uJFcIC5QiQHflK2B@userbridgecluster.fjgwswe.mongodb.net/?retryWrites=true&w=majority&appName=UserBridgeCluster"; // Replace with your URI if using Atlas

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
});

const User = mongoose.model("User", userSchema);

// Routes

// POST: Save user
app.post("/api/users", async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const newUser = new User({ firstName, lastName, email, phone });
    await newUser.save();
    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// GET: Fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
