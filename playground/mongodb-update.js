const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const dbName = 'TodoApp'; const col = 'Todos';
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err)
        return console.log("Error: " + err);
    console.log('successfully connected to mongodb...');
    var db = client.db(dbName);
    //find one and update
    db.collection(col).findOneAndUpdate({ _id: new ObjectID('5c7b642bf41c84711826a44e') },
        {
            $set: {
                completed: true
            }
        },
        { returnOriginal: false })
        .then((res) => console.log(res))
})