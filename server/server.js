const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo.js');
var {Users} = require('./models/users.js');

var app = express();
const port = process.env.PORT || 3000;
//Middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  // console.log(req);
  Todo.find().then((todos)=> {
    res.status(200).send({
      todos: todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send({
        'error': 'Invalid Id'
      });
    }
    Todo.findById(id).then((todo)=> {
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

app.delete('/todos/:id', (req, res) => {
    // console.log(req);
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send({
        'error': 'Invalid Id'
      });
    }
    Todo.findByIdAndRemove(id).then((todo)=> {
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

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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
