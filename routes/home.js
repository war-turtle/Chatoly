const routes = require('express').Router();
const Group = require('../models/groups');
const async = require('async');
const _ = require('lodash');

routes.get('/home', (req, res) => {
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
                _id: '$category'
              }
            }
          ],
          (err, newResult) => {
            callback(err, newResult);
          }
        );
      }
    ],
    (err, result) => {
      const res1 = result[0];
      const res2 = result[1];

      const categorySorted = _.sortBy(res2, '_id');

      res.render('home', {
        title: 'Chatoly - Home',
        data: res1,
        categories: categorySorted
      });
    }
  );
});

module.exports = routes;
