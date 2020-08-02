const mongoose =require('mongoose');
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/CodeJudge");
autoIncrement.initialize(connection);

module.exports = {
    database : 'mongodb://localhost/CJSocialFeed',
    connection: connection
}