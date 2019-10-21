const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MessageSchema = new Schema({
  sent_from: {
    name: {
      type: String,
      default: 'Admin'
    },
    email: {
      type: String,
      default: 'Support@MySideHussle.com'
    }
  },
  sent_to_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  sent_to_details: {  
    name: {
      type: String
    },
    email: {
      type: String
    }
  },
  subject: {
    type: String
  },
  content: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Message = mongoose.model('message', MessageSchema);
