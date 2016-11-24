var express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');
var model = require('../models.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/home');

    });
});

router.get('/home', loggedIn, function(req, res, next){

  if (req.user.username=='admin') {
    model.AddCar.find({}, {_id: 1, brand: 1, classType: 1, price: 1, parkLocation: 1, license: 1, color: 1}).exec(function(err,cars){
      if(err){
        console.log(err);
      }
      else{
        res.render('adminhome.jade',{cars: cars})
      }
    })
  }
  else {
    model.AddCar.find({}, {_id: 1, brand: 1, classType: 1, price: 1, parkLocation: 1, license: 1, color: 1}).exec(function(err,cars){
      if(err){
        console.log(err);
      }
      else{
        res.render('customerhome.jade',{cars: cars})
      }
    })
  }

})

/* GET home page. */
router.get('/index.html', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Cars page. */
router.get('/available_cars.html', function(req, res, next) {
  model.AddCar.find({}, {_id: 1, brand: 1, classType: 1, price: 1, parkLocation: 1, license: 1, color: 1}).exec(function(err,cars){
      if(err){
        console.log(err);
      }
      else{
        res.render('available_cars.jade',{cars: cars})
      }
    })
});

/* GET login page. */
router.get('/login.html', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET contact page. */
router.get('/contactform.html', function(req, res, next) {
  res.render('contactform', { title: 'Contact' });
});

function customerLogin(req, res, next) {
    if (req.user.username == 'admin') {
        res.redirect('/index.html');
    } else {
        next();
    }
}

function adminLogin(req, res, next) {
    if (req.user.username=='admin') {
        next();
    } else {
        res.redirect('/adminhome');
    }
}

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You need to be logged in to access this page');
    }
}

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});



router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username, _id : req.body.driverID,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                // program : req.body.progtype,
                // semester: req.body.semester,
                email: req.body.emailsignup
                }), req.body.password, function(err, account) {
        if (err) {
          return res.render("error", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

router.get('/addcar',loggedIn, adminLogin, function(req, res, next) {
    res.render('adminhome', { user : req.user });
});

router.post('/addcar', function(req, res) {

    new model.AddCar({
    _id:      req.body.CarID,
    brand:    req.body.Brand,
    classType:     req.body.Class,
    price:        req.body.Price,
    parkLocation:    req.body.Location,
    license:        req.body.License,
    color:          req.body.Color,
    customer:       req.body.Customer


    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("There was some error" );
            }
            else {
                //Success !!!
                res.redirect('/home');
                // res.end("Event Registered!");
            }
        });
});

router.post('/rent', function(req, res) {
    res.render('rent.jade', {
      id : req.body.id,
      brand: req.body.brand,
      price: req.body.price,
      classType: req.body.classType,
      license: req.body.license,
      location: req.body.location});

});

router.post('/finish', function(req, res) {
  model.AddReservation.update({_id: req.body.car}, {paid: 1}).exec(function(err,cars){
      if(err){
        console.log(err);
      }
      else{
        res.redirect('/home');
      }
    })
    // res.redirect('/home');

});



router.post('/pay', function(req, res) {
    res.render('pay.jade', {
      price : req.body.price,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      id: req.body.id
      });

});

router.get('/reserve',loggedIn, customerLogin, function(req, res, next) {
    res.render('rent', { user : req.user });
});

router.post('/reserve', function(req, res) {

    new model.AddReservation({
    renteeName:      req.body.RenteeName,
    startDate:    req.body.StartDate,
    endDate:     req.body.EndDate,
    location:        req.body.Location,
    renteeID:    req.body.DriverID,
    _id:        req.body.CarID,
    price:          req.body.Price,
    paid: 0


    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("There was some error" );
            }
            else {
                //Success !!!
                res.redirect('/home');
                // res.end("Event Registered!");
            }
        });
});

router.get('/reservation', loggedIn, function(req, res, next){

    model.AddReservation.find({paid: 0}, {_id: 1, paid: 1 ,renteeName: 1, startDate: 1, endDate: 1, location: 1, renteeID: 1, price: 1}).exec(function(err,reservations){
      if(err){
        console.log(err);
      }
      else{
        res.render('reservation.jade',{reservations: reservations})
      }
    })


})

module.exports = router;
