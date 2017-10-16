const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var data = {
  id: 10
};

var token = jwt.sign(data, 'somesecretsalt');
console.log(token);

var decoded = jwt.verify(token, 'somesecretsalt');
console.log('decoded',decoded);

var password = '123abc!';
var salt = bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$4Hxv3LzFq22JFXkUt7fo0.XxbyVaV3ACNNzhKE2mRiQOOaeXyXOrS';
bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log(result);
});
