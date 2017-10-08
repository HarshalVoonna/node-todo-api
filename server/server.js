var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo.js');
var {Users} = require('./models/users.js');

var app = express();

//middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  //console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('up and running on port 3000');
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
