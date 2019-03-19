var { Users } = require('./models/Users');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    Users.findByToken(token)
        .then((user) => {
            //res.send(user);
            req.user = user;
            req.token = token;
            next();
        })
        .catch((err) =>
            res.status(401).send('Error while fetching user: ' + err))



}

module.exports = { authenticate }