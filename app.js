//导入项目需要的包
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var session = require('express-session')
var monk = require('monk');
//连接到远程的数据库
var db = monk('luojiamun:87664653@ds053196.mlab.com:53196/comp6905');

//路由文件
var routes = require('./routes/index');
var users = require('./routes/users');

//Express实例化并赋值给变量的代码
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/**
告诉静态文件的位置;例如照片的位置在c:\node\nodetest1\public\images，
可以使用http://localhost:3000/images的链接进入
**/
app.use(express.static(path.join(__dirname, 'public')));

//connect to db
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

app.use(session({
  group: 'sessiongroup',
  username: 'username',
  password: 'spassword',
  resultCustomerID:'1234567',
  secret: 'hello',
  resave: false,
  saveUninitialized: true,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// catch 404 and forward to error handler
//当无法在app.post查看到错误或者console时,可以关闭如下命令,让错误处理页面停止工作
app.use(function(req, res, next) {
  console.log(err.status);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.post('/',function(request,response){

  console.log('app.post is working!');
  var group = request.body.group;
  var username =request.body.username;
  var password =request.body.password;
  var table;

  request.session.group=group;
  request.session.username=username;
  request.session.password=password;
  console.log(request.session);

  switch (group) {
    case '1':
    console.log('123232424535345');
    db.on('error', function (err) { console.error(err); });

    table ='newCustomer';
    connection.query('SELECT * FROM newCustomer WHERE name=? AND password=?  ',[username,password],function(err,rows){
      if(err) throw err;
      // console.log('the searched stuedent result is', rows);
      if (rows[0] !=null) {
      var getCustomer =rows[0].CustomerID;
      // console.log('the selected id is',getCustomer);
      console.log('the result of newCustomer is 111 ', rows[0]);

        connection.query('SELECT * FROM timeline WHERE CustomerID=?',getCustomer,function(err,events){
          if(err) throw err;
          // console.log('the result of timeline is ', events);
         if (events=="") {

           console.log('start events ', events);
           events={eventID: 1,
 time: '00.00.2000',
 eventName: 'no event',
 CustomerID: 201422222};
 // console.log('the timeline is', events);

 connection.query('SELECT * FROM events',function(err,results){
   if(err) throw err;

console.log('start serching employee 1', rows[0].employeeID);
 if (rows[0].employeeID!=null) {

   console.log('the employeerrrrr is really', rows[0].employeeID);
    connection.query('SELECT * FROM employee WHERE employeeID = ?',rows[0].employeeID,function(err,employees){
      if(err) throw err;
      console.log('the helllllllll is really', employees);
  response.render('login', { title: 'login' ,results:results,rows:rows,events:events,employees:employees});
})

 }else {
   var employees="";
 response.render('login', { title: 'login' ,results:results,rows:rows,events:events,employees:employees});

 }

// response.render('login', { title: 'login' ,results:results,rows:rows,events:events});
})

 }else {
    console.log('start esle 1111 ');
    console.log('start employee id 1111', rows[0].employeeID);
   connection.query('SELECT * FROM events',function(err,results){
     if(err) throw err;
    //  console.log('the result is really', results);

    if (rows[0].employeeID!=null) {

      console.log('the employeerrrrr is really', rows[0].employeeID);
       connection.query('SELECT * FROM employee WHERE employeeID = ?',rows[0].employeeID,function(err,employees){
         if(err) throw err;
         console.log('the helllllllll is really', employees);
     response.render('login', { title: 'login' ,results:results,rows:rows,events:events,employees:employees});
   })

    }else {
      var employees="";
    response.render('login', { title: 'login' ,results:results,rows:rows,events:events,employees:employees});

    }
    //  response.render('login', { title: 'login' ,results:results,rows:rows,events:events});
   })
 }



        })





      }else{
        return response.redirect("/fail");
        // connection.end();
      }
    });

      break;

    default:

  }
  console.log(username);


})

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
