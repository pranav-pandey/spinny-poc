const express = require('express')
const app = express()
const {getDb} = require('./../db');
const {ObjectID} = require('mongodb');

//GET Call
app.get('/', async (req, res) => {  

  let fomattedArray = [];
  let db = getDb();
  const _res = await db.collection('tasks').find().toArray();
  
  if(_res.length > 0) {
    (function getProjectName() {
      let task = _res.splice(0,1)[0];
      db.collection('projects').findOne({ _id: ObjectID(task.projectId)}).then((p) => {
        if (p) {
          task.projectName = p.name;
          fomattedArray = [...fomattedArray, task];
          if(_res.length === 0) {
            res.send(fomattedArray);
          } else {
            getProjectName();
          }
        }
      }).catch((e) => {
        console.log("error",e);
      });
    })();
  } else {
    res.send(_res);
  }
});

//POST call
app.post('/',  async (req, res, next) => {
  console.log(req.body," request POST");

  let db = getDb();
  const _res = await db.collection('tasks').insertOne({
      name: req.body.name,
      description: req.body.description,
      time: req.body.time,
      projectId: req.body.projectId
      // projectName: req.body.projectName
  });
  const projectObj = await db.collection('projects').findOne({_id: ObjectID(req.body.projectId)});
  let task = _res.ops[0];
  task.projectName = projectObj.name;
  res.send(task);
})

module.exports = app;