const express = require('express')
const app = express()
const {getDb} = require('./../db');

//GET Call
app.get('/', async (req, res) => {  
  let db = getDb();
  const _res = await db.collection('projects').find().toArray();  
  res.send(_res);
});

//POST call
app.post('/',  async (req, res, next) => {
  console.log(req.body," request POST");
  
  let db = getDb();
  const _res = await db.collection('projects').insertOne({
      name: req.body.name,
      username: req.body.username,
      time: req.body.time
  });
  console.log(_res.ops[0], "fsfsf");
  
  res.send(_res.ops[0]);
})

module.exports = app;