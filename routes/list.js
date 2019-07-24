var express = require('express');
var httpResult = require('../config').httpResult;
//链接数据库
var query = require('../utils/dbHelper.js');
var upload = require('../utils/upload.js'); //导入上传文件
var uploadPaths = require('../config').uploadPaths;//导入config文件中的上传文件处理
var file = require('../utils/file.js'); //导入file模块
var path = require('path'); //导入路径

var router = express.Router();

//项目2
router.post('/list',function(req,res,next) {
	var cid = parseInt(req.body.cid);
	query('SELECT * FROM `dt_list` WHERE `cid`=?',[cid])
		.then(results => res.send(httpResult.success(results)))
		.catch(results => res.send(httpResult.error(null,message)));
});
//项目2.5vue仓库请求ajax
router.post('/list2',function(req,res,next) {
	var cid = parseInt(req.body.cid);
	var begin = parseInt(req.body.begin);
	var count= parseInt(req.body.count);
	query('SELECT * FROM `dt_list` WHERE `cid`=? LIMIT ?,?',[cid,begin,count])
		.then(results => res.send(httpResult.success(results)))
		.catch(results => res.send(httpResult.error(null,message)));
});
router.post('/detail',function(req,res,next) {
		var pid = parseInt(req.body.pid);
		query('SELECT * FROM `dt_list` WHERE `id`=?',[pid])
		.then(results => res.send(httpResult.success(results)))
		.catch(results => res.send(httpResult.error(null,message)));
});
//处理admin的product事件
router.post('/admin-list',function(req,res,next) {
	var { name,mid,sid,begin,pageSize } = req.body;
	query('CALL p_getProductByCondition(?,?,?,?,?)',[name,mid,sid,begin,pageSize])
		.then(results => {
			res.send(httpResult.success({total:results[0][0].total,list:results[1]}))
		})
		.catch(results => res.send(httpResult.error(null,message)));
});
//处理详情轮播图上传
router.post('/banner/upload',upload.single('banner'),function(req,res,next) {
	var  id  = parseInt(req.body.id);
	var { temp, root,product:{ banner } } = uploadPaths;
	var fileName = req.file.filename;
	var filePath = banner + fileName; //链接文件的位置路径
	console.log(filePath);
	var fromPath = path.join(temp,fileName);
	var toPath = path.join(root,banner,fileName);
	file.copy(fromPath,toPath)
		.then( () => file.unlink(fromPath)) //删除临时文件图片
		.then( () => query('CALL p_uploadProductBanner(?,?)',[filePath,id]))
		.then( data => res.send(httpResult.success(filePath)))
		.catch(message => res.send(httpResult.error(null,message)))
})
//修改bannerImage
router.post('/banner/remove',function(req,res,next) {
	var { id, filePath, newBannerImgs } = req.body;
	query('UPDATE `dt_list` SET `bannerImage` =? WHERE `id` =?',[newBannerImgs,id])
		.then( () => file.unlink(path.join(uploadPaths.root,filePath)))
		.then( () => res.send(httpResult.success()))
		.catch(message => res.send(httpResult.error(null,message)));
})
//处理商品的图片上传
router.post('/uploadAvatar',upload.single('avatar'),function(req,res,next) {
			res.send(httpResult.success(req.file.filename));
})
//处理商品的新增
router.post('/addNewProduct',function(req,res,next) {
	var { name,store, avatar1 } = req.body;
	var cid = parseInt(req.body.cid);
	var price = parseInt(req.body.price);
	var { temp, root,product:{ avatar } } = uploadPaths;
	var fromPath = path.join( temp,avatar1); //原临时文件的路径
	var toPath = path.join(root,avatar,avatar1);// 转过去的文件根路径
	file.copy(fromPath,toPath)
		.then( () => file.unlink(fromPath))
		.then( () => query('INSERT `dt_list`(cid,name,price,avatar,store,bannerImage) VALUES (?,?,?,?,?,?)',[cid,name,price,avatar+avatar1,store,'']) )
		.then( results => {
			if(results.affectedRows === 1) {
				console.log(results);
				res.send(httpResult.success(results.insertId,'新增成功'));
			}
			else {
				res.send(httpResult.failure(null,'新增失败..'))
			}
		})
		.catch( message => res.send(httpResult.error(null,message)));
})
//处理单个商品的删除
router.post('/removeProduct',function(req,res,next) {
	var {  id, bannerImage,avatar1 } =  req.body;
	console.log(id);
	console.log(bannerImage);
	console.log(avatar1);
	var { temp, root,product:{ avatar,banner } } = uploadPaths;
	query('DELETE FROM `dt_list` WHERE id = ?',[id])
		.then(results => {
			if(results.affectedRows === 1) {
				if(bannerImage.length > 0) { //如果有轮播图
					bannerImage.forEach((item,i) => {
						file.unlink(path.join(root,item))
					})
					file.unlink(path.join(root,avatar1))
						.then(() => res.send(httpResult.success(null,'删除成功')))
				}
				else { //如果没有轮播图
						file.unlink(path.join(root,avatar1))
							.then( () => res.send(httpResult.success(null,'删除成功')))
				}
			}
		})
		.catch(message => res.send(httpResult.error(null,message)));
	
})
module.exports = router;