const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
var mongoose = require('./db/mongoose');
var { Todos } = require('./models/Todos');
var port = process.env.PORT || 7000;
var { Users } = require('./models/Users');
var { authenticate } = require('./middleware')
var bcrypt = require('bcryptjs')
//app.set('views', path.join(__dirname, 'views'))
app.use(express.static('views'))
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
// get base route
app.get('/', (req, res) => {
    res.sendFile('index.html');
})
// post todos data
app.post('/todos', (req, res) => {
    var todo = new Todos({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });
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
// get todos all data
app.get('/todos', (req, res) => {
    Todos.find()
        .then(todos => res.send({ todos }))
        .catch(err => res.send('Error occurred while getting: ' + err))
})
// get todo data by id
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
// delete todo data by id
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(400).send('Invalid ID');
    Todos.findByIdAndDelete(id)
        .then(doc => {
            if (!doc) return res.status(400).send('ID not found');
            res.send('Deleted the todo data with given ID: ' + doc)
        })
        .catch(err => res.status(400).send('Error while deleting data ' + err))
})
// path todo data
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    //console.log(JSON.stringify(req.body, undefined, 2));
    var body = _.pick(req.body, ['text', 'completed']);
    // console.log('Lodash Body: ' + JSON.stringify(body, undefined, 2));
    if (!ObjectID.isValid(id))
        return res.status(400).send('Invalid ID');
    if (_.isBoolean(body.completed) && body.completed)
        body.completedAt = new Date().getHours() + ':' +
            (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes();
    else {
        body.completed = false;
        body.completedAt = null;
    }
    Todos.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if (!todo) return res.status(400).send('No todo data found with ID');
            else
                res.send({ todo });
        })
        .catch(err => res.status(400).send('Error while updating data ' + err))

})
//Users API
//====================================================
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new Users(body);
    user.save()
        .then(() => {
            return user.genAuthToken();
        })
        .then((token) => {
            console.log('Successfully inserted user data...' + user);
            res.header('x-auth', token).send(user)
        })
        .catch(err => {
            console.log('Error while saving user: ' + err);
            res.status(400).send(err);
        })
})

app.get('/users', (req, res) => {
    Users.find()
        .then(users => {
            res.send(users);
        })
        .catch(err => res.status(400).send('Error while fetching users ' + err))
})

app.get('/users/me', authenticate, (req, res) => {

    res.send(req.user);
})
app.get('/users/verify/', (req, res) => {
    //var password = req.params.password;
    var email = req.query.email;
    var password = req.query.password;
    //res.send(email + ' ' + password);
    //console.log('User: ' + email + ' Password: ' + password);
    Users.getHashPassword(email)
        .then((user) => {
            var hashPass = user.password;
            var token = user.tokens[0].token;
            console.log("Comparing " + password + " " + hashPass)
            bcrypt.compare(password, hashPass)
                .then(result => {
                    //console.log(result);
                    res.header('x-auth', token).send("Verification: " + result);
                })
        })
        .catch(err => res.status(401).send(err))
})

app.listen(port, () => {
    console.log('App is listening on ' + port)
})

module.exports = { app }