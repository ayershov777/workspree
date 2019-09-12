const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    enum: ['seeking', 'offering'],
    required: true
  },
  //searchTags: [String],
  authorUsername: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Reply'
  }]
}, {
  timestamps: true
});

postSchema.methods.toJSON = function() {
  let post = this.toObject();
  post.replies.forEach((reply, idx) => {
    if(!reply.consumerUsername)
     post.replies.splice(idx, 1);
  });
  return post;
};

module.exports = mongoose.model('Post', postSchema);
