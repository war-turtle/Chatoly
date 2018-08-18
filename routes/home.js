const routes = require("express").Router();
const Group = require("../models/groups");
const async = require("async");
const _ = require("lodash");
const User = require("../models/users.js");

routes.get("/home", (req, res) => {
  async.parallel(
    [
      function(callback) {
        Group.find({}, (err, result) => {
          callback(err, result);
        });
      },
      function(callback) {
        Group.aggregate(
          [
            {
              $group: {
                _id: "$category"
              }
            }
          ],
          (err, newResult) => {
            callback(err, newResult);
          }
        );
      },
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
    (err, result) => {
      const res1 = result[0];
      const res2 = result[1];
      const res3 = result[2];

      const categorySorted = _.sortBy(res2, "_id");

      res.render("home", {
        title: "Chatoly - Home",
        chunks: res1,
        categories: categorySorted,
        user: req.user,
        request: res3
      });
    }
  );
});

routes.post("/home", (req, res) => {
  async.parallel(
    [
      function(callback) {
        Group.update(
          {
            _id: req.body.id,
            "user.username": { $ne: req.user.username }
          },
          {
            $push: {
              user: {
                username: req.user.username,
                email: req.user.email
              }
            }
          },
          (err, count) => {
            callback(err, count);
          }
        );
      }
    ],
    (err, result) => {
      res.redirect("/home");
    }
  );
});

module.exports = routes;
