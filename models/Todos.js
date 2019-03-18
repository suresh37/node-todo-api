const mongoose = require('mongoose');
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
        // default: new Date().getHours() + ':' + new Date().getMinutes()
    }
})
TodoSchema.pre('save', function (next) {
    if (this.completed == true)
        this.completedAt = new Date().getHours() + ':' + new Date().getMinutes()
    else
        this.completedAt = null;
    next();
});

var TodoModel = mongoose.model('Todos', TodoSchema);

module.exports = { Todos: TodoModel }