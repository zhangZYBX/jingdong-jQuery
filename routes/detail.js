var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper.js');
var router = express.Router();

router.post('/add',function(req,res,next) {
	var name = req.session.name;
	var pid = parseInt(req.body.pid);
	var count = parseInt(req.body.count);
	var date = new Date();
	query('CAll p_addProductToCart(?,?,?,?)',[name,pid,count,date])
	.then(results => {
		if(results[0][0].result === '') res.send(httpResult.success());
		else{
			res.send(httpResult.failure(null,results[0][0].result));
		}
	})
	.catch(message => res.send(httpResult.error(null,message)));
});



module.exports = router;