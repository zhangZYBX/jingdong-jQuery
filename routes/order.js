var express = require('express');
var httpResult = require('../config').httpResult;
//导入数据库
var query = require('../utils/dbHelper.js');

var router = express.Router();

//展示客户刚刚购买订单的信息
router.post('/list',function(req,res,next) {
	var orderId = req.body.orderId;
	query('CALL  p_getOrderInfo (?);',[orderId])
	.then(results => {
		//判断数据库请求的结果是否成功,影响的行数(执行语句影响的行数)
		console.log(results);
		res.send(httpResult.success(results))
		})
	.catch(message => res.end(httpResult.error(null,message)));
});
//处理支付状态的订单
router.post('/pay',function(req,res,next) {
	var orderId = req.body.orderId;
	query('UPDATE `dt_order` SET `pay` = 1 WHERE `id` = ?;',[orderId])
		.then(results => {
		if(results.affectedRows ===1) res.send(httpResult.success());
		res.send(httpResult.failure(null,'支付失败...'));
		})
		.catch(message => res.end(httpResult.error(null,message)));
})


module.exports = router;