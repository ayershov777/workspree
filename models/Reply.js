const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  authorUsername: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const replySchema = new Schema({
  consumerUsername: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  postId: {
    type: String,
    //required: true
  }
});

module.exports = mongoose.model('Reply', replySchema);
