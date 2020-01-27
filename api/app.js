const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
const indexRouter = require('./routes/index');
const projectRouter = require('./routes/projects');

let _db;
const { initDb } = require('./db');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cors(5000));
// const uri = "mongodb+srv://admin:goldtree9@cluster0-47vgb.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   console.log("inside connect");
  
//   const db = client.db("test");
//   _db = db;
//   app.get('/',  async (req,res,next) => {
//     console.log("Listening at /");
    
//     let collection = db.collection('users');
//     let users = await collection.find();
//     console.log(users, " users");
    
//       res.send('Hello World!');
//   }) 
//   // perform actions on the collection object
//   client.close();
// });




initDb(function (err) {
    app.listen(port, function (err) {
        if (err) {
            throw err; //
        }
        console.log("API Up and running on port " + port);
    });
});

app.use('/', indexRouter);
app.use('/projects', projectRouter);
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))