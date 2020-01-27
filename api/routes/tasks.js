const express = require('express')
const app = express()
const {getDb} = require('./../db');
//GET Call
app.get('/tasks', (req, res) => {
  let db = getDb();

  console.log(db, "dbinstacne");
  
  res.send('Hello World!');
});

app.post('/tasks',  async (req, res, next) => {
  let db = getDb();
  const insert = await db.collection('users').insertOne(
    {
      name: 'Lifafa',
      username: 'admin2',
      age: 24
    });
    console.log(insert, "insert");
    res.send('Post action complete');
})

module.exports = app;