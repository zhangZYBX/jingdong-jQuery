var express = require('express');
var httpResult = require('../config').httpResult;
//导入数据库
var query = require('../utils/dbHelper.js');

var router = express.Router();

//随机生成验证码发送给客户端
router.get('/getcode',function(req,res,next) {
	var letters = ['0','1','2','4','5','6','7','A','B','C','D','E','F','G','H','I','G','K','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	code = '';
	for(var i =1; i <= 4; i++ ){
		code += letters[Math.floor(Math.random()*letters.length)];
	}
	req.session.code = code;//将用户对应的验证码放入对应的seession中;
	res.send(httpResult.success(code));
});

//处理手机号验证码的登录
router.post('/phone',function(req,res,next) {
	var phone = req.body.phone;
	var code = req.body.code.toUpperCase();
	if(req.session.code == code) {
		query('CALL p_loginByPhone(?)',[phone])
		.then(results => {
			req.session.name = results[0][0].name;//取出数据库出来的名字
			res.cookie('user',results[0][0].name);
			res.send(httpResult.success());
		})
		.catch(message => res.end(httpResult.error(null,message)));
	} else {
		res.send(httpResult.failure(null,'验证码错误'));
	}
});
//处理密码登录
router.post('/pwd',function(req,res,next) {
	var name = req.body.name;
	var pwd = req.body.pwd;
	query('CAll p_loginByPwd(?,?)',[name,pwd])
	.then(results => {
		if(results[0][0].result === ''){
			req.session.name = name;
			res.cookie('user',name);
			res.send(httpResult.success());
		} else{
			res.send(httpResult.failure(null,results[0][0].result));
		}
	})
	.catch(message =>res.send(httpResult.error(null,message)));
});

module.exports = router;