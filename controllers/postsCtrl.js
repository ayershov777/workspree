const Post = require('../models/Post');
const Reply = require('../models/Reply');
const User = require('../models/User');

// The Reply schema contains 'consumerUsername' and 'messages' keys.
// 'messages' is an array of all messages between the post owner and the reply owner.
// Which replies are visible when you acess a post is based on which user is viewing them.

function populatePost(reqUser, post, cb) {
  // check if a user is logged in
  if(!!reqUser) {
    // check if the author is viewing the post by comparing usernames
    // side note: reqUser comes directly from a jwt payload,
      // which means it contains the username without having to look it up in the database
    if(reqUser.username === post.authorUsername) { // post author, view all replies
      Post.populate(post, { path: 'replies' }).then(post => cb(post));
    } else {
      // search the post's replies for one which belongs to the request user
      User.findById(reqUser.id, (err, currentUser) => {
        let reply = post.replies.find(reply => currentUser.replies.includes(reply) && reply);
        
        // check to see if a reply was found
        if(!!reply) Post.populate(post, { // reply owner, view just the onw reply (and all messages)
          path: 'replies',
          match: { _id: reply._id }
        }).then(post => cb(post));
        else cb(post); // unrelated user, view no replies
      });
    }
  } else cb(post); // user not logged in, view no replies
}

function index(req, res) {
  Post.find({}, (err, allPosts) => {
    if(err) return res.json({
      message: 'mongoose ran into an error',
      error: err
    });
    res.json({ posts: allPosts });
  });
}

function show(req, res) {
  Post.findById(req.params.id, (err, foundPost) => {
    if(err) return res.json({
      message: 'mongoose ran into an error',
      error: err
    });

    populatePost(req.user, foundPost, (populatedPost) => res.json({ post: populatedPost }));
  });
}

function create(req, res) {
  req.body.post.authorUsername = req.user.username
  Post.create(req.body.post, (err, newPost) => {
    if(err) return res.json({
      message: 'mongoose ran into an error',
      error: err
    });

    User.findById(req.user.id, (err, currentUser) => {
      currentUser.posts.push(newPost);
      currentUser.save();
    });

    res.json({ post: newPost });
  });
}

function update(req, res) {
  Post.findByIdAndUpdate(req.params.id, req.body.postInfo, { new: true}, (err, updatedPost) => {
    if(err) return res.json({
      message: 'mongoose ran into an error',
      error: err
    });

    res.json({ post: updatedPost });
  });
}

function remove(req, res) {
  console.log(req.params);
  Post.findById(req.params.id)
    .then(async post => {
        post = await Post.populate(post, { path: 'replies' })
        User.findById(req.user.id)
          .then(user => {
            let postIdx = user.posts.findIndex(post => post._id === req.params.id);
            user.posts.splice(postIdx, 1);
            user.save();

            post.replies.forEach(reply => {
              console.log(reply)
              Reply.findByIdAndRemove(reply._id).catch(console.log);
              User.findOne({ username: reply.consumerUsername })
                .then(user => {
                  console.log(user);
                  replyIdx = user.replies.findIndex(r => r._id === reply._id);
                  user.replies.splice(replyIdx, 1);
                  user.save();
                })
                .catch(console.log);
            });

            Post.findByIdAndRemove(req.params.id)
              .then(deletedPost => res.json({ post: deletedPost}))
              .catch(console.log);
          })
          .catch(console.log)
    })
    .catch(console.log);
}

module.exports = {
  index,
  show,
  create,
  update,
  remove
};
