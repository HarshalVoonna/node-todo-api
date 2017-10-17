const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var {Todo} = require('./../../models/todo');
var {Users} = require('./../../models/users');

const u1ID = new ObjectID();
const u2ID = new ObjectID();

const users = [{
  _id: u1ID,
  email: 'a@grr.la',
  password: 'aTest1234!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: u1ID.toHexString(), access: 'auth'}, 'salt').toString()
  }]
}, {
  _id: u2ID,
  email: 'b@grr.la',
  password: 'bTest1234!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: u2ID.toHexString(), access: 'auth'}, 'salt').toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: u1ID
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 123,
  _creator: u2ID
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  Users.remove({}).then(()=> {
     var userOne = new Users(users[0]).save();
     var userTwo = new Users(users[1]).save();
     return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
