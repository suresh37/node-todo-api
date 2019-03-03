const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const dbName = 'TodoApp'; const col = 'Todos';
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err)
        return console.log("Error: " + err);
    console.log('successfully connected to mongodb...');
    var db = client.db(dbName);
    /* db.collection(col).find({ _id: new ObjectID('5c7b642bf41c84711826a44e') }).toArray()
        .then((docs) => {
            console.log(JSON.stringify(docs, undefined, 2));
        })
        .catch((err) => console.log('Error retrieving Docs - ' + err))
 */
    /* db.collection(col).count()
        .then((count) => console.log('Total Docs count: ' + count))
        .catch((err) => console.log('Error - ' + err)) */
    db.collection('Users').find({ _id: new ObjectID('5c7b758749ea0b77e824f318') })
        .toArray()
        .then((res) => console.log(JSON.stringify(res, undefined, 2)))
        .catch((err) => console.log('Error fetching data: ' + err))
})