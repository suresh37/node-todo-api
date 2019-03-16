const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV == "production") {
    mongoose.connect('mongodb://Suresh:suresh007@ds129770.mlab.com:29770/sureysh',
        { useNewUrlParser: true })
}
else if (process.env.NODE_ENV == "development") {
    // console.log("Dev environment")
    mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

} else
    mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });


module.exports = {
    mongoose
}



/* mongoose.connect('mongodb://Suresh:suresh007@ds129770.mlab.com:29770/sureysh',
{ useNewUrlParser: true }) */
// process.env.MONGODB_URI