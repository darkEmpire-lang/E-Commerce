// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set up Helmet for Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "https://vercel.live"], // Allow scripts from vercel.live
      "default-src": ["'self'"],
    },
  })
);

// Sample Route to Check Server Status
app.get('/', (req, res) => {
  res.json({ message: "Hello, your backend is working!" });
});

// Import and Use Product Routes
const productRoutes = require('./routes/ProductRoutes');
app.use('/products', productRoutes);

// MongoDB Connection
const mongoURI = process.env.MONGO_URI; // Use the MONGO_URI from the .env file

if (!mongoURI) {
  console.error("Error: Missing MONGO_URI in .env file");
  process.exit(1); // Exit the process if Mongo URI is missing
}

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
   // useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error: ", err);
  });

// Define your port (from .env or fallback to 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
