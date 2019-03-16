const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('./db/mongoose');
const { ObjectID } = require('mongodb')
var port = process.env.PORT || 7000;
var bodyParser = require('body-parser');
var { Todos } = require('./models/Todos');
//var { Users } = require('./models/Users');

app.use((req, res, next) => {
    var now = new Date();
    var log = `${now} - ${req.method} - ${req.url}\n`;
    fs.appendFile('server.log', log, (err) => {
        if (err)
            return console.log('Unable to write to Server log file.')
    })
    next();
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todos({ text: req.body.text });
    // console.log(req.body);
    todo.save()
        .then((doc) => {
            console.log('Successfully inserted todo data...' + doc)
            res.send(doc)
        })
        .catch((err) => {
            console.log('Error occurred while inserting: ' + err)
            res.send(err)
        })

})
app.get('/todos', (req, res) => {
    Todos.find()
        .then(todos => res.send({ todos }))
        .catch(err => res.send('Error occurred while getting: ' + err))
})
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(400).send('Invalid Id');
    Todos.findById(id)
        .then(doc => {
            if (!doc)
                return res.status(400).send('Id not found in DB')
            else
                res.send(doc);
        })
        .catch(err => res.status(400).send('Error while fetching' + err))
})
app.listen(port, () => {
    console.log('App is listening on ' + port)
})

module.exports = { app }