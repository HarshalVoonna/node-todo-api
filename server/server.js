require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo.js');
var {Users} = require('./models/users.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;
//Middleware
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc)=>{
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  // console.log(req);
  Todo.find({_creator: req.user._id}).then((todos)=> {
    res.status(200).send({
      todos: todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send({
        'error': 'Invalid Id'
      });
    }
    Todo.findOne({_id: id, _creator: req.user._id}).then((todo)=> {
      if(!todo){
        return res.status(404).send({
          'error': 'No TODO found'
        });
      }
      return res.status(200).send({todo})
    }).catch((e) => {
      res.status(400).send({
        'error': 'Invalid request'
      });
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    // console.log(req);
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send({
        'error': 'Invalid Id'
      });
    }
    Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then((todo)=> {
      if(!todo){
        return res.status(404).send({
          'error': 'No TODO found'
        });
      }
      return res.status(200).send({todo})
    }).catch((e) => {
      res.status(400).send({
        'error': 'Invalid request'
      });
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)){
      return res.status(404).send({
        'error': 'Invalid Id'
      });
    }
    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
      if(!todo){
        return res.status(404).send({
          'error': 'No TODO found'
        });
      }
      return res.status(200).send({todo})
    }).catch((e) => {
      res.status(400).send({
        'error': 'Invalid request'
      });
    });
});

//POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new Users(body);
    user.save().then((user)=> {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  Users.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }).catch((e) => {
      res.status(400).send();
    })
});

app.listen(port, () => {
  console.log(`up and running on port ${port}`);
});


// var newTodo = new Todo({
//   text: 'Cook Dinner',
//   completed: false
// });

// newTodo.save().then((doc) => {
//   console.log('Saved Todo', doc);
// }, (e) => {
//   console.log(e);
// });

// var newUser = new Users({email: ' voonna.harshal@gmai.com  '});
//
// newUser.save().then((doc)=> {
//   console.log(doc);
// }, (e) => {
//   console.log(e);
// });

module.exports = {app};
