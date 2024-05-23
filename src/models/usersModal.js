// models/User.js
const mongoose = require('mongoose');

const bcrypt = require("bcrypt");

const saltRounds = 10;

const userSchema = new mongoose.Schema({
  PhoneNumber:{
    type: String,
    required: true,
    unique: true,
  },
  otp:{
    type: String,
    required: true,
  },
  otpExpiration:{
    type: Date,
    default:Date.now,
    get:(otpExpiration)=>otpExpiration.getTime(),
    set:(otpExpiration)=>new Date(otpExpiration),
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  AdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});



userSchema.pre('save', function (next) {
    const user = this;

    // If Password is not modified, move to the next middleware
    if (!user.isModified('Password')) return next();

    // Generate a salt and hash the password
    bcrypt.hash(user.Password, saltRounds, function (err, hash) {
        if (err) return next(err);
        user.Password = hash;
        next();
    });
});

module.exports = mongoose.model('User', userSchema);
