const mongoose = require('mongoose');
const { ObjectID } = require('mongodb')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });
var { Todos } = require('../models/Todos')
var id = "5c8ce6168344de35b01828d5";

if (!ObjectID.isValid(id))
    console.log('Object Id not valid')

Todos.findById(id)
    .then((res) => {
        if (!res) return console.log("No result found with " + id)
        console.log(res)
    })
    .catch((err) => console.log("Error occurred: " + err))

/* Todos.findOne({ _id: id })
    .then((res) => console.log(res))
    .catch((err) => console.log("Error occurred: " + err)) */

/* Todos.find({ _id: id })
    .then((res) => console.log(res))
    .catch((err) => console.log("Error occurred: " + err)) */
