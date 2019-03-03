const express = require('express');
const app = express();
var port = process.env.PROD || 7000;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

var TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: String,
        default: new Date().getHours() + ':' + new Date().getMinutes()
    }
})
var TodoModel = mongoose.model('Todos', TodoSchema);

var todo = new TodoModel({
    text: '  take a nap   ',
    //completed: true,
    completedAt: "21:00"
})

todo.save()
    .then((res) => console.log('Successfully inserted todo data...' + res))
    .catch((err) => console.log('Error occurred while inserting: ' + err))

app.listen(port, () => {
    console.log('App is listening on ' + port)
})