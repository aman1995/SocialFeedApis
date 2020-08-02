var express = require('express');
var router = express.Router();
var { Post, validate } = require('../modules/post');
var { User } = require('../modules/user');
var { MESSAGES } = require('../utility/constants');

//Create an Post
router.post('/create-post/:username', async function (req, res, next) {
  const result = validate(req.body);
  const user = await User.findOne({ username: req.params.username });


  if (result.error || !user) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    let post = new Post({
      caption: req.body.caption,
      imageUrl: req.body.imageUrl,
      username: user._id
    });

    await post.save();
    res.status(201).send(post);
  }
});

//Get all posts by user
router.get('/all-posts/:usernameA', async function (req, res, next) {
  const user = await User.findOne({ username: req.params.usernameA });

  if (!user) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    let postsArr = [];
    promise = new Promise(async (resolve) => {
      for await (const doc of Post.find({ username: user._id })) {
        let post = {
          postId: doc._id,
          imageUrl: doc.imageUrl,
          caption: doc.caption,
          upvotes: doc.upvotes,
        }
        postsArr.push(post);
      }
      resolve(postsArr);
    });
    promise.then((postArr) => {
      res.status(200).send(postArr);
    })
  }
})

module.exports = router;
