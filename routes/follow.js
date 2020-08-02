var express = require('express');
var router = express.Router();
var { User } = require('../modules/user');
var { Follow, validate } = require('../modules/follow');
var { MESSAGES } = require('../utility/constants');

//Create an User
router.post('/:usernameA/:usernameB', async function (req, res, next) {
  const result = validate(req.params);
  const userA = await User.findOne({ username: req.params.usernameA });
  const userB = await User.findOne({ username: req.params.usernameB });

  if (result.error || !userA || !userB) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    let follow = new Follow({
      follower: userA._id,
      following: userB._id,
    });

    await follow.save();
    res.status(202).send({
      status: "success"
    });
  }
});


module.exports = router;
