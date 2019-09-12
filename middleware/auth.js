const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    let token = req.get('Authorization') || req.query.token || req.body.token;
    if(!!token) {
        token = token.replace('Bearer ', '');
        jwt.verify(token, 'Biggie was much better than Tupac', (err, decoded) => {
            if(!!err) next(err);
            else {
                req.user = decoded.user;
                next();
            }
        });
    } else next();
};

function checkAuth(req, res, next) {
    if(!!req.user) next();
    else res.status(401).json({ message: 'unauthorized' });
}

module.exports = {
    authenticate,
    checkAuth
};
