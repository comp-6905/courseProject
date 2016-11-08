var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/index.html', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Cars page. */
router.get('/available_cars.html', function(req, res, next) {
  res.render('available_cars', { title: 'Express' });
});

/* GET login page. */
router.get('/login.html', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET contact page. */
router.get('/contactform.html', function(req, res, next) {
  res.render('contactform', { title: 'Contact' });
});
module.exports = router;
