var express = require('express');
var router = express.Router();

/* GET Account Profile. */
router.get('/', function(req, res, next) {
  res.json({name: 'Matt Herron'});
});

module.exports = router;
