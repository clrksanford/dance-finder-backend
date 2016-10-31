var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('lodash');
var Upcoming = require('../models/upcoming');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;
