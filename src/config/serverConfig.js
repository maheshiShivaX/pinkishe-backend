const http = require('http');
const express = require('express');
const path = require('path'); 
const stockRoutes = require('../routes/stockRoutes');  
const roleRoutes = require('../routes/roleRoutes');  
const authRoutes = require('../routes/authRoutes'); 
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: '*', // Allow all origins (change to specific domains for better security)
  methods: '*', // Allow all HTTP methods
  allowedHeaders: '*', // Allow all headers
  credentials: false, // Setting this to `false` when `origin: '*'` since cookies/credentials require specific origins
};

// Use the CORS middleware globally
app.use(cors(corsOptions));

const port = process.env.PORT || 8000;  

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the "uploads" folder (for image access)
// app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));  // Fixed the path

// Use dataRoutes for the API routes
app.use('/api', stockRoutes);
app.use('/api', roleRoutes);
app.use('/api/auth', authRoutes);
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = { app, server };  
