const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');
const verifyToken = require("../middleware/verification");


router.post('/send-location', async (req, res) => {
    try {
      // Assuming req.body contains latitude and longitude
      const {AdminId,userId,Name,latitude, longitude } = req.body;
    console.log(req.body)
      // Call saveUserLocationData with req and other parameters
      await DataController.saveUserLocationData(req,AdminId,userId,Name, latitude, longitude);
  
      res.status(200).json({ message: 'Location data saved successfully.' });
    } catch (error) {
      console.error('Error saving location data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/live-locations/:AdminId', async (req, res) => {
    try {
        const AdminId = req.params.AdminId; // Extract AdminId from request parameters
        const liveLocations = await DataController.getLiveUserLocationsByAdminId(AdminId);
        res.json({ success: true, data: liveLocations });
    } catch (error) {
        console.error('Error in fetching live locations:', error);
        res.status(500).json({ success: false, message: 'Error fetching live locations' });
    }
});

router.get('/live-location/:AdminId/:userId', async (req, res) => {
  try {
      const AdminId = req.params.AdminId;
      const userId = req.params.userId;
      const userLocation = await DataController.getLiveUserLocationByUserIdAndAdminId(AdminId, userId);

      if (userLocation) {
          res.json({ success: true, data: userLocation });
      } else {
          res.status(404).json({ success: false, message: 'User location not found' });
      }
  } catch (error) {
      console.error('Error fetching live user location:', error);
      res.status(500).json({ success: false, message: 'Error fetching live user location' });
  }
});
  router.delete('/delete/:userId', DataController.deleteUserLocation);
  module.exports = router;

module.exports = router;