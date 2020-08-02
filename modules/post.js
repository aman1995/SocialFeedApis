const mongoose = require('mongoose');
const Joi = require('joi');
const {connection} = require('../config/db');
Joi.objectId = require('joi-objectid')(Joi)
var {User} = require('../modules/user');
const postSchema = new mongoose.Schema({
    postId:{
        type:Number,
        unique:true,
        index:true
    },
    caption:{
        type:String
    },
    imageUrl:{
        type:String,
        required:true
    },
    upvotes:{
        type : Number,
        default: 0
    },
    username:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    }
})

postSchema.plugin(autoIncrement.plugin, { model: 'Post', field: 'postId' });
const Post = mongoose.model('Post', postSchema);

const validate = ((post)=>{
    const schema = {
        caption : Joi.string(),
        imageUrl : Joi.string().required()
     };
     return Joi.validate(post , schema)
});

module.exports.postSchema = postSchema;
module.exports.Post = Post;
module.exports.validate = validate;