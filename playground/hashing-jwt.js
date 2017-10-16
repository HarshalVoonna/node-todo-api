const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, 'somesecretsalt');
console.log(token);

var decoded = jwt.verify(token, 'somesecretsalt');
console.log('decoded',decoded);
