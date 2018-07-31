const router = require("express").Router();
const User = require("../models/users.js");
const async = require("async");

router.get("/:name", (req, res) => {
  let name = req.params.name;

  async.parallel(
    [
      function(callback) {
        User.findOne({
          username: req.user.username
        })
          .populate("request.userId")
          .exec((err, result) => {
            callback(err, result);
          });
      }
    ],
    (err, results) => {
      let result1 = results[0];
      console.log(result1);

      res.render("groupChat/group", {
        title: "Chatoly - Group",
        user: req.user,
        name: name,
        request: result1
      });
    }
  );
});

router.post("/:name", (req, res) => {
  async.parallel(
    [
      function(callback) {
        if (req.body.receiver) {
          User.update(
            {
              username: req.body.receiver,
              "request.userId": { $ne: req.user._id },
              "friendsList.friendId": { $ne: req.user._id }
            },
            {
              $push: {
                request: {
                  userId: req.user._id,
                  username: req.user.username
                }
              },
              $inc: { totalRequest: 1 }
            },
            (err, count) => {
              callback(err, count);
            }
          );
        }
      },
      function(callback) {
        if (req.body.receiver) {
          User.update(
            {
              username: req.user.username,
              "sentRequest.username": { $ne: req.body.receiver }
            },
            {
              $push: {
                sentRequest: {
                  username: req.body.receiver
                }
              }
            },
            (err, count) => {
              callback(err, count);
            }
          );
        }
      }
    ],
    (err, results) => {
      res.redirect("/group/" + req.params.name);
    }
  );

  async.parallel(
    [
      function(callback) {
        if (req.body.senderId) {
          User.update(
            {
              _id: req.user._id,
              "friendsList.friendId": req.body.senderId
            },
            {
              $push: {
                friendsList: {
                  friendId: req.body.senderId,
                  friendName: req.body.senderName
                }
              },
              $pull: {
                request: {
                  userId: req.body.senderId,
                  userName: req.body.senderName
                }
              },
              $inc: { totalRequest: -1 }
            },
            (err, count) => {
              callback(err, count);
            }
          );
        }
      },
      function(callback) {
        if (req.body.senderId) {
          User.update(
            {
              _id: req.body.senderId,
              "friendsList.friendId": req.user._id
            },
            {
              $push: {
                friendsList: {
                  friendId: req.user._id,
                  friendName: req.user.username
                }
              },
              $pull: {
                sentRequest: {
                  username: req.user._id
                }
              }
            },
            (err, count) => {
              callback(err, count);
            }
          );
        }
      }
    ],
    (err, results) => {
      if (err) {
        console.log("errors are present");
      }
      res.redirect("/group/" + req.params.name);
    }
  );
});

module.exports = router;
