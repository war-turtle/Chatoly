const routes = require('express').Router();
const Group = require('../models/groups');

routes.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

routes.post('/dashboard', (req, res) => {
  const newGroup = new Group();
  newGroup.name = req.body.group;
  newGroup.category = req.body.category;
  newGroup.save(err => {
    if (!err) {
      res.render('admin/dashboard');
    }
  });
});

module.exports = routes;
