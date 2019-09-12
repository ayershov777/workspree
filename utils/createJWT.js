const jwt = require('jsonwebtoken');

module.exports = (user) => {
  return jwt.sign({
      user: {
          id: user._id,
          username: user.username,
          zipcode: user.zipcode
      }
  }, 'Biggie was much better than Tupac', { expiresIn: '24h' });
};
