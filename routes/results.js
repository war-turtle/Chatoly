const routes = require("express").Router();
const Group = require("../models/groups");
const async = require("async");

routes.get("/", (req, res) => {
  res.redirect("/home");
});

routes.post("/", (req, res) => {
  async.parallel(
    [
      function(callback) {
        let regex = new RegExp(req.body.country, "gi");

        Group.find(
          { $or: [{ category: regex }, { name: regex }] },
          (err, result) => {
            callback(err, result);
          }
        );
      }
    ],
    (err, results) => {
      const res1 = results[0];

      res.render("results", {
        title: "Chatoly - Result",
        user: req.user,
        chunks: res1
      });
    }
  );
});

module.exports = routes;
