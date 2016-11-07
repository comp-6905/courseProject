//导入项目需要的包
var express = require('express');

var expressSession = require('express-session');
var stylus = require('stylus');
var nib = require('nib');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multer          =       require('multer');
var upload      =   multer({ dest: './public/images/userpicture/'});

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var session = require('express-session')
var monk = require('monk');
//连接到远程的数据库
var db = monk('localhost:27017/mcarshare');

//路由文件
var routes = require('./routes/index');
var users = require('./routes/users');

//Express实例化并赋值给变量的代码
var app = express();
function compile(str, path) {
	  return stylus(str)
	    .set('filename', path)
	    .use(nib())
	}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(expressSession({secret:'somesecrettokenhere',}));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(stylus.middleware(
		  { src: __dirname + '/public'
		  , compile: compile
		  }
		));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
告诉静态文件的位置;例如照片的位置在c:\node\nodetest1\public\images，
可以使用http://localhost:3000/images的链接进入
**/
app.use(express.static(path.join(__dirname, 'public')));

//connect to db

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect('mongodb://localhost/mcarshare');

app.use(function (req, res, next) {
    //console.log(db);
    req.db = db;
    next();
});

/**
这行命令告诉Express路由的使用方法。一般情况下，我会为了程序中不同的作用制作不同的路由文件。
例如，user路由可能就是添加用户，删除用户，更新用户等等的路由文件。
(kevin)你的页面文件需要注入到如下路由文件中,才能让app知道如何渲染.
**/
app.use('/', routes);
app.use('/users', users);

app.use(multer({ dest: './public/images/userpicture/',
    rename: function (filename) {
        return filename;
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}));

app.get('/picture',function(req,res){
      res.render('setpicture', { user : req.user });
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.redirect("/home");
    });
});

// app.use(session({
//   group: 'sessiongroup',
//   username: 'username',
//   password: 'spassword',
//   resultCustomerID:'1234567',
//   secret: 'hello',
//   resave: false,
//   saveUninitialized: true,
//   duration: 30 * 60 * 1000,
//   activeDuration: 5 * 60 * 1000,
// }));

// catch 404 and forward to error handler
//当无法在app.post查看到错误或者console时,可以关闭如下命令,让错误处理页面停止工作
app.use(function(req, res, next) {
  console.log(err.status);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
