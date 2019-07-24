var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper.js');
var router = express.Router();


// 处理列表的刷新
router.post('/list',function(req,res,next) {
	var name = req.session.name;
	query('SELECT * FROM `dt_address` WHERE `name` =?;',[name])
		.then(results => res.send(httpResult.success(results)))
		.catch(message => res.send(httpResult.error(null,message)));
});
//处理修改默认地址
router.post('/updateId',function(req,res,next) {
	var beforeName = req.session.name;
	var afterId = parseInt(req.body.afterId);
	query('CALL `p_setDefault` (?,?)',
		[beforeName,afterId]
	)
		.then(results => {
			if(results.affectedRows === 1) {res.send(httpResult.success(null,'默认地址修改成功...')); return;}
			else res.send(httpResult.failure(null,'默认地址修改失败...'));
		})
		.catch(message => res.send(httpResult.error(null,message)));
})
// 处理地址的新增
router.post('/add',function(req,res,next) {
	var receiveName = req.body.receiveName;
	var receiveTel = req.body.receiveTel;
	var receiveAddress = req.body.receiveAddress;
	var name = req.session.name;
	query('INSERT `dt_address`(`name`,`receiveName`,`receiveTel`,`receiveAddress`) VALUES(?,?,?,?)',[name,receiveName,receiveTel,receiveAddress])
		.then(results => {
			console.log(results);
			res.send(httpResult.success({
				id:results.insertId, //返回刚刚新增的数据的id
				name: name //返回用户名 ，用于构造数据
			}));
		})
		.catch(message => res.send(httpResult.error(null,message)));
});
//处理单个地址的编辑事件
router.post('/edit',function(req,res,next) {
	var id = parseInt(req.body.id);
	query('SELECT * FROM `dt_address` WHERE `id` = ?',[id])
	.then(results => res.send(httpResult.success(results[0])))
	.catch(message => res.send(httpResult.error(null,message)))
});
//处理地址的删除
router.post('/delete',function(req,res,next) {
	var id = parseInt(req.body.id);
	query('DELETE FROM `dt_address` WHERE `id` = ?;',[id])
		.then(results => {
			if(results.affectedRows === 1) res.send(httpResult.success());
			else res.send(httpResult.failure(null,'删除失败...'))
		})
		.catch(message => res.send(httpResult.error(null,message)));
})
//处理修改事件
router.post('/update',function(req,res,next) {
	var receiveName = req.body.receiveName;
	var receiveTel =req.body.receiveTel;
	var receiveAddress = req.body.receiveAddress;
	var id = parseInt(req.body.id);
	console.log(receiveAddress);
	query('UPDATE `dt_address` SET `receiveName`=?,`receiveTel`=?,`receiveAddress`=? WHERE `id`=?',
		[receiveName,receiveTel,receiveAddress,id]
	)
		.then(results => {
			if(results.affectedRows === 1) {res.send(httpResult.success(null,'地址修改成功...')); return;}
			else res.send(httpResult.failure(null,'地址更新失败...'));
		})
		.catch(message => res.send(httpResult.error(null,message)));
})
module.exports = router;