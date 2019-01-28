'use strict';
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const User = require('./User');
const Task = require('./Task');

const projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // owner: String,
    description: String,
    budget: Number,
    remaining: Number,
    tasks:[{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    isActive: {type: Boolean, default: true}
});

projectSchema.pre('find', function(next) {
    this.populate('owner');
    // this.populate('tasks');
    next();
});

projectSchema.pre('findOne', function(next) {
    this.populate('owner');
    // this.populate('tasks');
    next();
});

projectSchema.post('save', function(next){
  console.log('this ran');
  this.populate('owner');
  });

projectSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        owner: this.owner,
        description: this.description,
        budget: this.budget,
        remaining: this.remaining,
        tasks: this.tasks,
        isActive: this.isActive
    }
}

const Project = mongoose.model('Project', projectSchema);
module.exports = { Project };