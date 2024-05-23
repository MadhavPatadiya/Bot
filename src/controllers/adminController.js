const User = require('../models/usersModal');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');

 const saltRounds = 10;

const AdminController = {
 
 
 createAdmin: async (req, res) => {
    try {
        const { EmailId, Password, role } = req.body;
        
        // Check if the email already exists
        const existingSubAdmin = await User.findOne({ EmailId });
        if (existingSubAdmin) {
            return res.status(400).json({ error: 'Email already exists' });
        }


        // Create a new sub admin object
        const newAdmin = new User({
            EmailId,
            Password,
            role,
           
        });

        // Save the sub admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Sub admin created successfully',data:newAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
},

  signInAdmin: async (req, res) => {
    try {
        const { EmailId, Password } = req.body;
        const foundAdmin = await User.findOne({ EmailId });

        if (!foundAdmin) {
            return res.status(404).json({ error: ' admin not found' });
        }

        // Compare hashed password with the user-provided password
        const passwordMatch = await bcrypt.compare(Password, foundAdmin.Password);
        if (!passwordMatch) {
            return res.json({ success: false, message: "Incorrect password!" });
        }

        // Passwords match
        const token = jwt.sign({ userId: foundAdmin._id, userType: foundAdmin.role,}, 'your-secret-key', { expiresIn: '5h' });
        console.log(token);
        return res.json({  message: 'Admin created successfully', data: foundAdmin, token: token });
    } catch (ex) {
        console.log(ex);
        return res.json({ success: false, message: "error" });
    }
},

createUser: async (req, res) => {
    try {
        const { EmailId, Password,role} = req.body;
        const AdminId = req.user.userId; 
       

        const user = new User({
            EmailId,
            Password,
            role,
            AdminId,
            
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully',data:user  });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
},

signInUser: async function (req, res) {
    try {
        const { EmailId, Password } = req.body;
        const foundUser = await User.findOne({ EmailId: EmailId });
        if (!foundUser) {
            return res.json({ success: false, message: "User not found!" });
        }
        const passwordMatch = bcrypt.compareSync(Password, foundUser.Password);
        if (!passwordMatch) {
            return res.json({ success: false, message: "Incorrect password!" });
        }

        // Generate JWT token with user's ID and role
        const token = jwt.sign({ userId: foundUser.id, userType: foundUser.role,AdminId:foundUser.AdminId }, "your-secret-key", {
            expiresIn: "5h",
        });

        console.log(token);

        return res.json({  message: 'User login successfully', data: foundUser, token: token });
    } catch (ex) {
        console.log(ex)
        return res.json({ success: false, message: "error" });
    }
},


}
module.exports = AdminController;