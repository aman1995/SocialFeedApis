var express = require('express');
var router = express.Router();
var { Post, validate } = require('../modules/post');
var { User } = require('../modules/user');
var { Follow } = require('../modules/follow');
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
      userId: user._id
    });

    await post.save();
    res.status(201).send(post);
  }
});

//Get all posts whom user is following
router.get('/all-posts/:usernameA', async function (req, res, next) {
  const user = await User.findOne({ username: req.params.usernameA });

  if (!user) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    let followingArr = [];
    for await (const doc of Follow.find({ follower: user._id })) {
      followingArr.push(doc.following);
    }

    let promisesArr = [];
    followingArr.forEach((following) => {
      promisesArr.push(getPosts(following));
    })

    let obj = [];
    Promise.all(promisesArr).then((postsArr) => {
      postsArr.forEach((posts) => {
        posts.forEach((post) => {
          obj.push(post);
        })
      })
    }).then(() => {
      res.status(200).send(obj);
    })
  }
})

//get posts asynchronously
function getPosts(following) {
  return new Promise(async (resolve) => {
    let postsArr = [];
    for await (const doc of Post.find({ userId: following })) {
      let post = {
        postId: doc.postId,
        imageUrl: doc.imageUrl,
        caption: doc.caption,
        upvotes: doc.upvotes,
      }
      postsArr.push(post);
    }
    resolve(postsArr);
  })
}

module.exports = router;
