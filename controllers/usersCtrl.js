const User = require('../models/User');
const createJWT = require('../utils/createJWT');

function index(req, res) {
    User.find({}, (error, foundUsers) => {
        if(error) return res.status(500).json({
            message: 'mongoose encountered an error',
            error
        });
        res.json({ users: foundUsers });
    });
}

function show(req, res) {
    if(req.params.id !== req.user.id) return res.status(401).json({
        message: 'unauthorized'
    });

    User.findById(req.params.id)
        .populate('posts')
        .populate('replies')
        .exec((error, foundUser) => {
            if(error) return res.status(500).json({
                message: 'mongoose encountered an error',
                error
            });
            console.log(foundUser.posts)
            res.status(200).json({ user: foundUser });
        });
}

function update(req, res) {
    if(req.params.id !== req.user.id) return res.status(401).json({
        message: 'unauthorized'
    });

    if(req.body.userInfo.username) return res.status(403).json({
        message: 'the username may not be modified'
    });
    
    User.findByIdAndUpdate(req.params.id, req.body.userInfo, { new: true },
        (error, updatedUser) =>
    {
        if(error) return res.status(500).json({
            message: 'mongoose encountered an error',
            error
        });
        res.status(200).json({
            token: createJWT(updatedUser),
            user: updatedUser
        });
    });
}

module.exports = {
    index,
    show,
    update
};
