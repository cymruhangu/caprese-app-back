'use strict';
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Project = require('./Project');
const User = require('./User');

const taskSchema = new mongoose.Schema({
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    name: {type: String, required: true},
    description: String,
    budget: Number,
    remaining: Number,
    isActive: {type: Boolean, default: true}
});

taskSchema.pre('find', function(next) {
    this.populate('parent');
    next();
});

taskSchema.pre('findOne', function(next) {
    this.populate('parent');
    next();
});

taskSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        parent: this.parent,
        description: this.description,
        budget: this.budget,
        remaining: this.remaining,
        isActive: this.isActive
    }
}

const Task = mongoose.model('Task', taskSchema);
module.exports = { Task };