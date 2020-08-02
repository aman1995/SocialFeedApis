const mongoose = require('mongoose');
const Joi = require('joi');
var {User} = require('../modules/user');

const followSchema = new mongoose.Schema({

    follower:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    following:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

})

const Follow = mongoose.model('Follow', followSchema);

const validate = ((follow)=>{
    const schema = {
        usernameA : Joi.string().required(),
        usernameB : Joi.string().required()
     };
     return Joi.validate(follow , schema)
})

module.exports.followSchema = followSchema;
module.exports.Follow = Follow;
module.exports.validate = validate;