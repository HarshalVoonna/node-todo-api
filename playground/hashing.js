const {SHA256} = require('crypto-js');

var message = 'I am gonna hash you';
var hashedMessage = SHA256(message).toString();
console.log(`hashedMessage is ${hashedMessage}`);

var data = {
  id: 4
};
var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecretsalt').toString()
}

var resultHash = SHA256(JSON.stringify(token.data) +'somesecretsalt').toString();

if(resultHash === token.hash){
  console.log('Data was not changed');
} else {
  console.log('Warning! data was changed');
}
