var createError = require('http-errors');
var express = require('express');
var path = require('path');
//有了session 不需要用cookie
//var cookieParser = require('cookie-parser');
var logger = require('morgan');

//引入session这个包
var session = require ('express-session');

//引入session处理
var sessionOptions = require('./config').sessionOptions;
//引入数据传送客户端的结果
var httpResult = require('./config').httpResult;
//引入处理购物车和个人详情判断处理
var authPathsReg = require('./config').authPathsReg;

//引入自定义的服务内部处理数据
var categoryRouter = require('./routes/category.js');
var listRouter = require('./routes/list.js');
var loginRouter = require('./routes/login.js');
var cartRouter = require('./routes/cart.js');
var detailRouter = require('./routes/detail.js');
var orderRouter = require('./routes/order.js');
var profileRouter = require('./routes/profile.js');
var addressRouter = require('./routes/address.js');
var orderDetailRouter = require('./routes/orderDetail.js');
var adminRouter =  require('./routes/admin.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//导入session 就不用Cooikes了
app.use(session(sessionOptions));

//专门对登陆进行验证，看是否登陆
app.use('*',function(req,res,next) {
	var isAuthPath = authPathsReg.test(req.baseUrl);
	if(isAuthPath && !req.session.name) {
		res.send(httpResult.untoken());
	}
	else next();
})
//一级筛选，二级处理
app.use('/category',categoryRouter);
app.use('/product',listRouter);
app.use('/login',loginRouter);
app.use('/cart',cartRouter);
app.use('/detail',detailRouter);
app.use('/order',orderRouter);
app.use('/profile',profileRouter);
app.use('/address',addressRouter);
app.use('/orderDetail',orderDetailRouter);
app.use('/admin',adminRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
