var express = require('express');
var httpResult = require('../config').httpResult;
//导入数据库
var query = require('../utils/dbHelper.js');

var router = express.Router();

router.post('/message',function(req,res,next) {
	var name = req.session.name;
	query('SELECT * FROM `dt_user` WHERE `name`=?',[name])
		.then(results => res.send(httpResult.success(results)))
		.catch(message => res.send(httpResult.error(null,message)));
});
router.post('/loginout',function(req,res,next) {
	req.session.name = '';
	res.cookie('user','');
	res.send(httpResult.success());
});

module.exports = router;