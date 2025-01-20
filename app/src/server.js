const express = require('express');
const { initializeDatabase } = require('./config/database');
const producersRoutes = require('./routes/producers');

const app = express();
const PORT = process.env.PORT || 3000;
let server;

// Initialize the database
initializeDatabase();

// Middlewares
app.use(express.json());

// Routes
app.use('/producers', producersRoutes);

try {
  // Start the server
  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Error starting the server:', error);
}


module.exports = { app, server };
