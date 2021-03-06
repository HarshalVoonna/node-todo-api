var {Users} = require('./../models/users');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  Users.findByToken(token).then((user)=> {
    if(!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch(() => {
    res.status(401).send({
      message: 'Invalid token'
    });
  });
};

module.exports = {authenticate};
