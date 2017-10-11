var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://dbuser:dbuser@ds117625.mlab.com:17625/dry-lowlands-16071-mongodb'
};
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};
