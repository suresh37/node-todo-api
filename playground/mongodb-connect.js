const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const dbName = 'TodoApp'; const col = 'Todos';
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err)
        return console.log("Error: " + err);
    console.log('successfully connected to mongodb...');
    var db = client.db(dbName);
    db.collection(col).insertOne({
        text: 'Something to do 2', completed: false
    }, (err, result) => {
        if (err)
            return console.log('Unable to insert - Error' + err);
        console.log(JSON.stringify(result.ops, undefined, 2));
        client.close();
    })
    /*  if (err)
         return console.log("Error connecting mongodb -" + err);
     console.log('Succesfully connected to mongodb')
     const db = client.db('TodoApp');
     db.collection('Users').insertOne(
         {
             name: 'Ganesh', id: 121, location: 'Chennai'
         }, (err, res) => {
             if (err)
                 return console.log('Error inserting document - ' + err);
             console.log(JSON.stringify(res.ops, undefined, 2));
            // console.log(JSON.stringify(res.ops[0]._id.getTimestamp(), undefined, 2));
         })
     client.close(); */
    //
})