var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper.js');
var router = express.Router();


router.post('/list',function(req,res,next) {
	query('CAll p_getCartInfo(?)',[req.session.name])
	.then(data => res.send(httpResult.success(data[0])))
	.catch(message => res.send(httpResult.error(null,message)));
});
//处理购物车页面的加运算
router.post('/increase',function(req,res,next) {
	//取出客户端想服务器发送的id
	var id = parseInt(req.body.id)
	query('UPDATE `dt_cart` SET `count` = `count` + 1,`shoppingTime`=? WHERE `id` = ?;',[new Date(),id])
	.then(results => {
		//判断数据库请求的结果是否成功,影响的行数(执行语句影响的行数)
		if(results.affectedRows === 1) {res.send(httpResult.success());}
		res.send(httpResult.failure(null,'新增数量失败'));
		})
	.catch(message => res.send(httpResult.error(null,message)));
});
//处理购物车页面的减运算
router.post('/decrease',function(req,res,next) {
	query('UPDATE `dt_cart` SET `count` = `count` - 1,`shoppingTime`=? WHERE `id` = ?;',[new Date(),parseInt(req.body.id)])
	.then(results => {
		if(results.affectedRows ===1) res.send(httpResult.success());
		res.send(httpResult.failure(null,'删减数量失败'));
		})
	.catch(message => res.send(httpResult.error(null,message)));
});
//处理收货地址的管理
router.post('/address',function(req,res,next) {
	//取出当前用户的名字发送给数据库，获取当前用户的所有收货地址
	var name = req.session.name;
	query('SELECT * FROM `dt_address` WHERE `name`=?',[name])
		.then(results => res.send(httpResult.success(results)))
		.catch(message => res.send(httpResult.error(null,message)));
	
})
//处理删除
router.post('/remove',function(req,res,next) {
	var ids = JSON.parse(req.body.ids);
	query('DELETE FROM `dt_cart` WHERE `id` IN (?);',[ids])
	.then(results => {
		if(results.affectedRows === ids.length) res.send(httpResult.success());
		res.send(httpResult.failure(null,'删除商品失败'));
		})
	.catch(message => res.send(httpResult.error(null,message)));
});

//处理结算功能
router.post('/settlement',function(req,res,next) {
	var account = parseInt(req.body.account);//取出时，值为字符串传到数据库为整型
	var ids = JSON.parse(req.body.ids).join(',');//join函数 用，链接起来成为字符串
	var name = req.session.name;//用户名
	var addressId = parseInt(req.body.addressId);//取购物车的地址id
	var date = new Date();//时间
	query('CALL p_settlement(?,?,?,?,?);',[ids,account,date,name,addressId])
	.then(results => { 
		res.send(httpResult.success(results[0][0].orderId));
		})
	.catch(message => res.send(httpResult.error(null,message)));
})


module.exports = router;