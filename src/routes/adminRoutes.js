const express = require('express');
const AdminRoute = express.Router();
const adminController = require('../controllers/adminController');

const { roles,
    checkUserRole,} = require('../middleware/rolebased');
// Create a new user
AdminRoute.post('/create_sub_admin',adminController.createAdmin);
AdminRoute.post("/signInAdmin", adminController.signInAdmin);
AdminRoute.post('/create_user',checkUserRole(roles.ADMIN),adminController.createUser);
AdminRoute.post("/signInUser", adminController.signInUser);
//AdminRoute.post("/send-otp", adminController.sendOtp);

module.exports = AdminRoute;
