const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  id: String,
  type: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  properties: mongoose.Schema.Types.Mixed
}, { _id: false });

const viewSchema = new mongoose.Schema({
  id: String,
  name: String,
  components: [componentSchema]
}, { _id: false });

const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  collaborators: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  accessCode: { 
    type: String, 
    unique: true 
  },
  views: [viewSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Room', roomSchema);