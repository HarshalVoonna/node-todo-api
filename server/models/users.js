const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 1,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{value} is not valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//Instance Method - Overriding
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

//Instance Method
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'salt').toString();
  user.tokens.push({
    access,
    token
  });
  return user.save().then(()=> {
    return token;
  })
};

//Model method
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'salt')
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
   return Promise.reject();
  }
  return User.findOne({
    _id: decoded,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject({errorMessage: 'User not found'});
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if(result){
          resolve(user);
        } else {
          reject({
            errorMessage: 'Incorrect password'
          });
        }
      });
    });
  });
}

UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
      });
    });
  } else {
    next();
  }
});

var Users = mongoose.model('Users', UserSchema);

module.exports = {
  Users
};
