const assert = require("assert");
const MongoClient = require('mongodb').MongoClient;
let _db;

const uri = "mongodb+srv://admin:goldtree9@cluster0-47vgb.mongodb.net/test?retryWrites=true&w=majority";
const clientObject = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

function initDb(callback) {
  if (_db) {
      console.warn("Trying to init DB again!");
      return callback(null, _db);
  }
  clientObject.connect((err, client) => {  
      if (err) {
          return callback(err);
      }
      console.log("DB initialized - connected");
      
      _db = client.db('test');
      return callback(null, _db);
  })
}
function getDb() {
    assert.ok(_db, "Db has not been initialized. Please called init first.");
    return _db;
}
module.exports = {
    getDb,
    initDb
};