const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
}
try {
    var token = jwt.sign(data, 'abc');
    console.log(token);
    var decoded = jwt.verify(token, 'ab');
    console.log('decoded: ' + JSON.stringify(decoded, undefined, 2));
}
catch (e) {
    console.log('Error: ' + e);
}

/*
var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'secret').toString()
}
var resHash = SHA256(JSON.stringify(data) + 'secret').toString()
//console.log(`hash: ${token.hash}`)
if (resHash == token.hash)
    console.log('data was not changed')
else
    console.log('data changed')
 */