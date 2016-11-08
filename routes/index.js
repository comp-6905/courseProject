//导入Express,绑定router变量到express路由方法
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var model = require('../models.js');
var router = express.Router();

/*
GET home page.
(kevin)也可以说,当你输入yoururl/之后,会渲染的页面,为views中的index文件
注意这里已经设置了title变量
*/
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/*
GET Welcome page of M-CarSystem.
(kevin)也可以说,当你输入yoururl/之后,会渲染的页面,为views中的welcome文件
注意这里已经设置了title变量;如果view中重新设置了,会被覆盖
这个路由的意思是:当你在代码中输入'/'跳转或字符时,该如何处理
比如这里,输入了'/',那么渲染view中的welcome,即:将用户跳转至welcome.jade定义的页面去
app.post和router.get比较容易糊涂:目前来看,在页面内定义了post命令action的form,会跳至app.js执行post的app.post;
在routes中定义的router.get只是负责跳转页面而已,并没有命令来执行; 暂且这么认为和处理.
*/
router.get('/', function(req, res, next){

  res.render('welcome', {title: 'M-CarShare'})
})

router.get('/home', loggedIn, function(req, res, next){

  if (req.user.username=='admin') {
    model.AddCar.find({}, {_id: 1, brand: 1, classType: 1, price: 1, parkLocation: 1, license: 1, color: 1}).exec(function(err,cars){
      if(err){
        console.log(err);
      }
      else{
        res.render('adminhome',{cars: cars})
      }
    })
  }
  else {
    model.AddCar.find({}, {_id: 1, brand: 1, classType: 1, price: 1, parkLocation: 1, license: 1, color: 1}).exec(function(err,cars){
      if(err){
        console.log(err);
      }
      else{
        res.render('customerhome',{cars: cars})
      }
    })
  }

})



router.post('/', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/home');

    });
});

/*
About Us
小组的联系方式及介绍.
*/
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'M-CarShare!' });
});

/*
Customer car list page;
First page after Login;
小组的联系方式及介绍.
*/
router.get('/customercarlist', function(req, res, next) {
  res.render('customercarlist', { title: 'M-CarShare!' });
});

/*
Failed page.
*/
router.get('/failed', function(req, res){
  res.render('error', {title: 'Failed'})
})

/*
GET helloworld page.
(kevin)也可以说,当你输入yoururl/helloworld之后,会渲染的页面,为views中的helloworld文件
注意这里已经设置了title变量
*/
router.get('/helloworld', function(req, res){
  res.render('helloworld', {title: 'Hello, World!!!!'})
})

router.get('/userlist', function (req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function (e, docs) {
        res.render('userlist', {
            "userlist": docs
        });
    });
});

//这里的/register代表view表格中的相应action，由动作定义，这里定义如何跳转
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
                res.redirect('/helloworld');
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

module.exports = router;
