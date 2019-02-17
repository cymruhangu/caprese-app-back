'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', {session: false});
const bodyParser = require('body-parser');
const { Project } = require('../models/Project');
const { User } = require('../models/User');
const { Task } = require('../models/Task');

const jsonParser = bodyParser.json();

// @route   GET api/projects
// @desc    Get projects
// @access  Public
router.get('/',  (req, res) => {
      Project
          .find()
          .then(projects => {
            res.json(projects.map(project => project.serialize())
            );
            })
          .catch(err => {
              console.error(err);
              res.status(500).json({error: 'something went wrong'});
          });
    });


// @route   GET api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', (req, res) => {
    Project
      .findById(req.params.id)
      .then(project => res.json(project.serialize()))
      .catch(err => {
        console.log(req.params.id);
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
  });


// @route   POST api/projects
// @desc    create new project
// @access  Public
router.post('/', jsonParser, (req, res) => {
    console.log('req.body is:');
    console.log(req.body);
    const requiredFields = ['name', 'owner','description', 'budget'];
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
  }
  Project.create({
      name: req.body.name,
      owner: req.body.owner,
      description: req.body.description,
      budget: req.body.budget,
      remaining: req.body.remaining
  })
  .then(project => {
    project
      .populate('owner')
      .execPopulate()
      .then(result => {
        console.log(result.serialize());
        res.status(201).json(result.serialize());
      }
  )})
  .catch(err => {
    console.log(err);
      res.status(500).json({message: "Internal server error"});
  })
});

// @route   PUT api/project/:id
// @desc    Edit project 
// @access  Public
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
    const updateableFields = ["name", "owner", "description", "budget", "remaining", "tasks", "isActive"];

    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });

    Project
      .findByIdAndUpdate(req.params.id, { $set: toUpdate})
      .then(project => res.status(204).end())   //????
      .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Public
router.delete('/:id',  (req, res) => {
    console.log(req.params.id);
    Project
    .findByIdAndRemove(req.params.id)
    .then(project => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
  });

module.exports = router;