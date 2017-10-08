// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

//Object Destructuring in ES6
// var user = {name:'Harsha', location:'Citrix'};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Error Connecting to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //deleteMany
  db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    console.log(result);
  });

  //deleteOne
  db.collection('Todos').deleteOne({text: 'Eat breakfast'}).then((result) => {
    console.log(result);
  });

  //findOneAndDelete
  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  })
  db.close();
});
