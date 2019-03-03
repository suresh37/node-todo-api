const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const dbName = 'TodoApp'; const col = 'Todos';
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err)
        return console.log("Error: " + err);
    console.log('successfully connected to mongodb...');
    var db = client.db(dbName);
    //Delete Many
    /* db.collection(col).deleteMany({ text: 'Eat dinner' })
    .then((res) => console.log(res))
    .catch((err) => console.log('Error: '+err)) */

    //Delete One
    /* db.collection(col).deleteOne({ text: 'Eat dinner' })
    .then((res) => console.log(res))
    .catch((err) => console.log('Error: '+err)) */
    //FindOneAndDelete
    db.collection(col).findOneAndDelete({ text: 'Eat dinner' })
        .then((result) => console.log(result))
})