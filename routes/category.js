var express = require('express');
var httpResult = require('../config').httpResult;
var uploadPaths = require('../config').uploadPaths;//导入config文件中的上传文件
//导入数据库
var query = require('../utils/dbHelper.js');
var file = require('../utils/file.js');//导入删除图片路径模块
var path  = require('path'); //导入路径模块
var multer = require('multer');
var upload = require('../utils/upload.js');


var router = express.Router();

//var category = null;
	//通过connect对象调用query方法自动连接数据库，执行指定的sql语句
// query('SELECT * FROM `dt_category`;')
// 	.then(results => {category = results;})
// 	.catch(message => {console.log(null,message);} );

//图片处理
router.post('/upload',upload.single('avatar'),function(req,res,next) {
	res.send(httpResult.success(req.file.filename));
})
//处理一级请求
router.get('/main',function(req,res,next) {
	//var data = category.filter(function(item) { return item.fid === 0});
	//var data = category.filter(item => item.fid === 0);
	query('SELECT * FROM `dt_category` WHERE `fid` = 0')
		.then(data => res.send(httpResult.success(data)))
		.catch(message => res.send(httpResult.error(null,message)));
	//res.send(httpResult.success(data));
});
//处理二级请求
router.get('/sub',function(req,res,next) {
	var id = parseInt(req.query.id);
	//var data = category.filter(item => item.fid === id);
	query('SELECT * FROM `dt_category` WHERE `fid` =?',[id])
		.then(data => res.send(httpResult.success(data)))
		.catch(message => res.send(httpResult.error(null,message)));
	//res.send(httpResult.success(data));
});
//处理是删除分类事件
router.post('/remove',function(req,res,next) {
	var id = parseInt(req.body.id);
	var avatar = req.body.avatar;
	console.log(avatar);
	query('CALL p_removeCategory(?);',[id])
		.then(results => results[0][0].result)
		.then(results => {
			if(results === '') {
				if(avatar === '') {
					res.send(httpResult.success(null,'删除成功...'));
				}
				if( avatar !== ''){
					var avatarPath = path.join(__dirname,'../public',avatar);
					file.unlink(avatarPath)
						.then(() => res.send(httpResult.success(null,'删除成功...')))
						.catch((err) => res.send(httpResult.failure(null,err.message)))
				}
			}
			else res.send(httpResult.failure(null,results));
		})
		.catch(message => {res.send(httpResult.error(null,message))});
})
//处理新增事件
router.post('/add',function(req,res,next) {
	var { fid, name, avatar } = req.body;
	var { temp, root, category } = uploadPaths;
	var fromPath = path.join(temp,avatar);
	var toPath = path.join(root,category,avatar);
	if(avatar ==='') {
		query('CALL p_addCategory(?,?,?)',[fid,name,avatar])
			.then(data => res.send(httpResult.success(data[0][0].result,'新增成功')))
			.catch(message => res.send(httpResult.error(null,message)));
		return;
	}
	else {
		file.copy(fromPath,toPath)
		.then( () => file.unlink(fromPath))
		.then( () => query('CALL p_addCategory(?,?,?)',[fid,name,category+avatar]))
		.then( results => results[0][0].result)
		.then( data => res.send(httpResult.success(data,'新增成功')))
		.catch( message => res.send(httpResult.error(null,message)))
	}
	
})
//处理修改
router.post('/update',function(req,res,next) {
	var {id,fid,name,avatar,oldAvatar} = req.body;//结构当前传过来的值
	 new Promise(function(resolve,reject) {
		 if(avatar !== oldAvatar) {
			 var { temp, root, category } = uploadPaths;
			 var fromPath = path.join(temp,avatar);
			 var topath = path.join(root, category, avatar);
			 file.copy(fromPath,topath)
				.then( () => file.unlink(fromPath)) //	删除temp缓存文件夹里面的图片
				.then( () => file.unlink(path.join(root,avatar)))
				.then( () => resolve());
		 }
		 else resolve();
	 })
		.then( () => {
			avatar = avatar !== oldAvatar ? (uploadPaths.category + avatar): avatar;
			console.log(avatar);
			return query('UPDATE `dt_category` SET `fid`=?,`name`=?,`avatar`=? WHERE `id`=?;',[fid,name,avatar,id])
		})
		.then( () => res.send(httpResult.success(null,'修改成功!!')))
		.catch( message => res.send(httpResult.error(null,message)));
});
//react根据上传的fid筛选
router.post('/getListByFid',function(req,res,next) {
	var fid = parseInt(req.body.fid);
	query('SELECT * FROM `dt_category` WHERE `fid` = ?',[fid])
		.then(data => res.send(httpResult.success(data)))
		.catch(message => res.send(httpResult.error(null,message)))
})
//处理用户名的登录信息
router.post('/login',function(req,res,next) {
	res.send(httpResult.success(req.session.name));
})
module.exports = router;
