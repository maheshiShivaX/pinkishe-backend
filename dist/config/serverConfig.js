"use strict";

var http = require('http');
var express = require('express');
var path = require('path');
var stockRoutes = require('../routes/stockRoutes');
var authRoutes = require('../routes/authRoutes');
var cors = require('cors');
var app = express();
var corsOptions = {
  origin: '*',
  // Allow all origins (change to specific domains for better security)
  methods: '*',
  // Allow all HTTP methods
  allowedHeaders: '*',
  // Allow all headers
  credentials: false // Setting this to `false` when `origin: '*'` since cookies/credentials require specific origins
};

// Use the CORS middleware globally
app.use(cors(corsOptions));
var port = process.env.PORT || 8000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the "uploads" folder (for image access)
// app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));  // Fixed the path

// Use dataRoutes for the API routes
app.use('/api', stockRoutes);
app.use('/api/auth', authRoutes);
var server = http.createServer(app);

// Start the server
server.listen(port, function () {
  console.log("Server running at http://localhost:".concat(port, "/"));
});
module.exports = {
  app: app,
  server: server
};