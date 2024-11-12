// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());




app.get('/hello', (req, res) => {
  res.json({ message: "Hello, your backend is working!" });
});

const productRoutes = require('./routes/ProductRoutes');
app.use('/products', productRoutes);

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;  // Use the MONGO_URI from the .env file

if (!mongoURI) {
  console.error('mongodb+srv://pasindumaduranga294:it22546784@studentmanagemntsystem.0aafibf.mongodb.net/student_db?retryWrites=true&w=majority&appName=StudentManagemntSystem');
  process.exit(1); // Exit the process if Mongo URI is missing
}

mongoose.connect(mongoURI, {
   //useNewUrlParser: true,
  //useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.error("Database connection error: ", err);
});

// Define your port (from .env or fallback to 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
