const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });
mongoose.connect('mongodb://Suresh:suresh007@ds129770.mlab.com:29770/sureysh',
    { useNewUrlParser: true })
module.exports = {
    mongoose
}