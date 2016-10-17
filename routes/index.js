//导入Express,绑定router变量到express路由方法
var express = require('express');
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


module.exports = router;
