var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper.js');

var router = express.Router();

//处理登录验证
router.post('/login',function(req,res,next) {
	var { name,pwd } = req.body;
	query('SELECT `pwd` FROM `dt_admin` WHERE `name` = ?;',[name])
		.then(results => {
			if(results.length > 0) { //如果大于等于说明，有这个用户
				if(results[0].pwd === pwd) res.send(httpResult.success());
				else res.send(httpResult.failure(null,'账号密码错误!'));
			}
			else res.send(httpResult.failure(null,'用户名不存在'))
		})
		.catch(message => res.send(httpResult.error(null,message)))
});
//处理修改用户密码
router.post('/password',function(req,res,next) {
	var { name,pwd,newPwd } = req.body;
	query('CALL `p_password`(?,?,?)',[name,pwd,newPwd])
		.then(results =>  {
			console.log(results);
			return results[0][0].result
		})
		.then(results => {
			if(results === '') res.send(httpResult.success(null,'密码修改成功!'));
			else res.send(httpResult.failure(null,results));
		})
		.catch(message => res.send(httpResult.error(null,message)))
});
module.exports = router;