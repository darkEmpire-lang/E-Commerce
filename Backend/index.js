// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Initialize Express app
const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'https://e-commerce-frontend-one-rouge.vercel.app', 
  'https://deal-mate-admin-panel.vercel.app',
  'https://e-commerce-frontend-y03qtvm4g-pasindus-projects-e32111c9.vercel.app',
   'https://deal-mates-kohl.vercel.app/'
];

// CORS middleware configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, CURL)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
      }
    }
  })
);

app.use(express.json()); // JSON parser middleware

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
  res.send({ message: "Hello, your backend is working!" });
});

// Import and Use Product Routes
const productRoutes = require('./routes/ProductRoutes');
app.use('/products', productRoutes);

// MongoDB URI (checking if it's correctly loaded from .env)
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("Error: Missing MONGO_URI in .env file");
  process.exit(1); // Exit if Mongo URI is missing
}

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
