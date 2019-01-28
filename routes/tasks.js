'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { Task } = require('../models/Task');
const { Project } = require('../models/Project');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', jsonParser, (req, res) => {
  Task
    .find()
    .then(tasks => {
      res.json(tasks);
      // res.json({
      //   tasks: tasks.map(task => task.serialize())
      // });
      })
    .catch(err => {
      //   console.error(err);
      res.status(500).json({error: 'something went wrong'});
    });
});


//GET ONE
router.get('/:id', (req, res) => {
  Task
    .findById(req.params.id)
    .then(task => res.json(task.serialize()))
    .catch(err => {
      console.log(req.params.id);
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


//POST
router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  const requiredFields = ['name', 'parent','description', 'budget'];
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing ${field} in request body`;
      // console.error(message);
      return res.status(400).send(message);
    }
}
  Task.create({
    parent: req.body.parent,
    name: req.body.name,
    description: req.body.description,
    budget: req.body.budget,
    remaining: req.body.remaining
  })
  .then(task => {
    res.status(201).json(task.serialize());
    console.log(`new task ID is ${task.id}`);
  })
  .catch(err => {
    res.status(500).json({message: "Internal server error"});
  })
});

//PUT
router.put('/:id', jsonParser, (req, res) => {
    res.send(`trying to post something to ${req.params.id}`);
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {  //if they both are not undefined and are equal
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }
    const toUpdate = {};
    const updateableFields = ["name", "parent", "description", "budget", "remaining", "isActive"];

    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });

    Task
      .findByIdAndUpdate(req.params.id, { $set: toUpdate})
      .then(task => res.status(204).end())   //????
      .catch(err => res.status(500).json({ message: "Internal server error" }));
});

//DELETE
router.delete('/:id',  (req, res) => {
    console.log(req.params.id);
    Task
    .findByIdAndDelete(req.params.id)
    .then(task => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
  });

module.exports = router;