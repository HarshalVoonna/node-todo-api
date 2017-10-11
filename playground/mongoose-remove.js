const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '59de4959498efb0e3016bf89';

if(!ObjectID.isValid(id)) {
  return console.log('ID not valid');
}

Todo.remove({
   _id: id
}).then((result) => {
  console.log(result);
});

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findByIdAndRemove(id).then((todo) => {
  console.log('Deleted todo',todo);
});

Todo.findOneAndRemove({_id : id}).then((todo) => {
  console.log('Deleted todo',todo);
});
