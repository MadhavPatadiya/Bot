const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Initialize Socket.io on the server
require('dotenv').config();
app.use(cors());
const Data = require('./models/location');
// MongoDB connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mztaaoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendLocationData', async ({ userId, AdminId, Name, latitude, longitude }) => {
    try {
      // Create or update the user's location data
      let location = await Data.findOneAndUpdate(
        { userId },
        { AdminId, Name, latitude, longitude }, // Update all fields including AdminId, latitude, and longitude
        { upsert: true, new: true }
      );
      console.log('Location data saved:', location);
      io.emit('newLocationData', location); // Broadcast the new location data
    } catch (error) {
      console.error('Error saving location data:', error);
      socket.emit('error', { message: 'Error saving location data' });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Routes
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const AdminRoute = require("./routes/adminRoutes");
app.use("/api/login", AdminRoute);

const locationrouter = require("./routes/locationRoutes");
app.use("/api/location", locationrouter);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Export the io instance for use in other modules
module.exports = { io };
