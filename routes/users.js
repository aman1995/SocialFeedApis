var express = require('express');
var router = express.Router();
var { User, validate } = require('../modules/user');
var { Follow } = require('../modules/follow');
var { Post } = require('../modules/post');
var { MESSAGES } = require('../utility/constants');

//Create an User
router.post('/', async function (req, res, next) {
  const result = validate(req.body);
  const dupUser = await User.findOne({ username: req.body.username });


  if (result.error || dupUser) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    let user = new User({
      username: req.body.username,
    });

    await user.save();
    res.status(201).send(user);
  }
});

/* GET users listing. */
router.get('/:username', async function (req, res, next) {

  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    res.status(404).send({
    });
  }
  else {
    
    const profile = {
      username: user.username,
      follower: [],
      following: [],
      posts: []
    };
    const followingArr = [];
    const followersArr = [];
    const postsArr = [];
    let promise = new Promise(async (resolve) => {

      for await (const doc of Follow.find({ following: user._id }).populate('follower'))
        followersArr.push(doc.follower.username);


      for await (const doc of Follow.find({ follower: user._id }).populate('following'))
        followingArr.push(doc.following.username);


      for await (const doc of Post.find({ username: user._id })) {
        let post = {
          postId: doc.postId,
          imageUrl: doc.imageUrl,
          caption: doc.caption,
          upvotes: doc.upvotes,
        }
        postsArr.push(post);
      }
      profile.follower = followersArr;
      profile.following = followingArr;
      profile.posts = postsArr;

      resolve(profile);
    });

    promise.then((profile) => {
      res.status(200).send(profile);
    })
  }
});

module.exports = router;
