const Data = require('../models/location');

exports.saveUserLocationData = async (req,AdminId,userId, Name, latitude, longitude) => {
  try {
    let existingLocation = await Data.findOne({ userId: userId });

    if (existingLocation) {
      existingLocation.Name = Name;
      existingLocation.AdminId = AdminId;
      existingLocation.userId = userId;
      existingLocation.latitude = latitude;
      existingLocation.longitude = longitude;
      existingLocation.timestamp = new Date();
      await existingLocation.save();
      return existingLocation;
    } else {
      const newLocation = new Data({
        Name: Name,
        AdminId: AdminId,
        userId: userId,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date(),
      });

      const savedLocation = await newLocation.save();
      return savedLocation;
    }
  } catch (error) {
    console.error('Error saving location data:', error);
    throw error;
  }
};



exports.getLiveUserLocationsByAdminId = async (AdminId) => {
  try {
    // Query the database for live location data based on the admin ID
    const liveLocations = await Data.find({ AdminId: AdminId }).sort({ timestamp: -1 }).limit(10);
    return liveLocations;
  } catch (error) {
    // Handle any errors
    console.error('Error fetching live user locations:', error);
    throw error; // Throw the error to be caught by the calling function
  }
};
exports.deleteUserLocation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedLocation = await Data.findOneAndDelete({ userId });
    if (!deletedLocation) {
      return res.status(404).json({ error: 'Location not found',});
    }
    res.json({ message: 'Location deleted successfully',data:deletedLocation  });
  } catch (error) {
    console.error('Error deleting location data:', error);
    res.status(500).json({ error: 'Error deleting location data' });
  }
};
exports.getLiveUserLocationByUserIdAndAdminId = async (AdminId, userId) => {
  try {
    // Query the database for live location data based on AdminId and userId
    const userLocation = await Data.findOne({ AdminId: AdminId, userId: userId }).sort({ timestamp: -1 });
    
    return userLocation; // Return the user-specific location data
  } catch (error) {
    // Handle any errors
    console.error('Error fetching live user location:', error);
    throw error; // Throw the error to be caught by the calling function
  }
};