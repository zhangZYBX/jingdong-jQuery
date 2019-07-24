var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper.js');
var router = express.Router();

//处理订单页列表
router.post('/list',function(req,res,next) {
	var name = req.session.name;
	query('CAll `p_getOrderPayInfo`(?)',[name])
		.then(results => res.send(httpResult.success(results)))
		.catch(message => res.send(httpResult.error(null,message)));
})
//处理删除事件
router.post('/delete',function(req,res,next) {
	var orderId = req.body.orderId;
	query('DELETE `dt_orderdetail`,`dt_order` FROM `dt_orderdetail`,`dt_order` WHERE dt_orderdetail.orderId = dt_order.id  AND dt_order.id = (?);',[orderId])
		.then(results => res.send(httpResult.success()))
		.catch(message => res.send(httpResult.error(null,message)));
})

module.exports = router;