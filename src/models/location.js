// models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  Name:{
    type: String,
    required: true
  },
  userId: {
    type:String,
    required: true,
  },
  AdminId: {
    type: String,
    required: true,
  },
  latitude:{type: Number,
    required: true,
  },
  longitude: {type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Data', dataSchema);
