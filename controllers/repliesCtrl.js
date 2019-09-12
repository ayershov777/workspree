const Post = require('../models/Post');
const Reply = require('../models/Reply');
const User = require('../models/User');

function index(req, res) {
  Reply.find({}, (err, allReplies) => {
    if(err) return res.json({
      message: 'mongoose ran into an error',
      error: err
    });

    res.json({ replies: allReplies });
  });
}

function show(req, res) {
  Reply.findById(req.params.id, (err, foundReply) => {
    if(err) return res.json({
      message: 'mongoose ran into an error',
      error: err
    });

    res.json({ reply: foundReply });
  });
}

async function create(req, res) {
  let currentUser = await User.findById(req.user.id);

  Post.findById(req.body.postId, (err, targetPost) => {
    if(currentUser.username === targetPost.authorUsername) {
      //author is replying to a reply on his post
      Reply.findById(req.body.replyId, (err, reply) => {
        reply.messages.push({
          authorUsername: req.user.username,
          body: req.body.reply
        });
        reply.save();
        res.json({ reply })
      });
    } else {
      let reply = targetPost.replies.find(reply => currentUser.replies.includes(reply) && reply);
      if(!reply) {
        //user is replying to the post for the first time
        reply = {
          consumerUsername: req.user.username,
          messages: [{
            authorUsername: req.user.username,
            body: req.body.reply
          }]
        };
      
        Reply.create(reply, (err, newReply) => {
          if(err) return res.json(({ err }));
          currentUser.replies.push(newReply);
          currentUser.save();
          
          targetPost.replies.push(newReply);
          targetPost.save();
      
          res.json({ reply: newReply });
        });
      } else {
        //user is replying again
        let message = {
          authorUsername: req.user.username,
          body: req.body.reply
        };
        Reply.findById(reply._id, (err, reply) => {
          reply.messages.push(message);
          reply.save();
          res.json({ reply });
        });
      }
    }
  });
}

function removeMessage(req, res) {
  Reply.findById(req.params.id)
    .then(reply => {
      let idx = parseInt(req.body.messageIdx);
      if(req.user.username == reply.messages[idx].authorUsername) {
        if(reply.messages.length > 1) {
          reply.messages.splice(idx, 1);
          reply.save();
        } else {
          // 1) remove the reply from the replies collection
          Reply.findByIdAndRemove(req.params.id)
            .then(() => {
              // 2) remove the reply from the user's replies
              User.findById(req.user.id)
                .then(user => {
                  let replyIdx = user.replies.findIndex(reply => reply._id === req.params.id)
                  user.replies.splice(replyIdx);
                  user.save();
                  // 3) remove the reply from the post's replies
                  Post.findById(req.body.postId)
                    .then(post => {
                      let replyIdx = post.replies.findIndex(reply => reply._id === req.params.id);
                      post.replies.splice(replyIdx, 1);
                      post.save();
                      res.json({ message: 'the message was deleted successfully' });
                    })
                    .catch(console.log);
                })
                .catch(console.log);
            })
            .catch(console.log);
        }
      } else {
        res.status(401).json({ message: 'unauthorized' })
      }
    })
    .catch(err => res.json({
      message: 'mongoose encountered an error',
      error: err
    }));
};

module.exports = {
  index,
  show,
  create,
  removeMessage
};
