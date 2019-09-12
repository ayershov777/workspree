const User = require('../models/User');
const createJWT = require('../utils/createJWT');
const bcrypt = require('bcrypt');

function signup(req, res) {
    bcrypt.hash(req.body.userInfo.password, 6, (err, hash) => {
        if(err) return res.status(500).json({
            message: 'bcrypt encountered an error',
            error: err
        });

        req.body.userInfo.password = hash;
        User.create(req.body.userInfo, (err, newUser) => {
            if(err) return res.status(400).json({ 
                message: 'bad request',
                error: err
            });
            const token = createJWT(newUser);
            return res.status(201).json({
                message: 'new user created successfully',
                token
            });
        });
    });
}

function login(req, res) {
    User.findOne({ username: req.body.userInfo.username }, (err, foundUser) => {
        if(err) return res.status(500).json({ 
            message: 'mongoose encountered an unexpected error',
            error: err
        });
        if(!foundUser) return res.status(400).json({ message: 'invalid credentials' })
        bcrypt.compare(req.body.userInfo.password, foundUser.password, (err, result) => {
            if(err) return res.status(500).json({
                message: 'bcrypt encountered an unexpected error',
                error: err
            });
            if(result) {
                console.log(foundUser)
                const token = createJWT(foundUser);
                return res.status(200).json({
                    message: 'logged in successfully',
                    token
                });
            }
            return res.status(400).json({ message: 'invalid credentials' });
        });
    });
}

module.exports = {
    signup,
    login
};
