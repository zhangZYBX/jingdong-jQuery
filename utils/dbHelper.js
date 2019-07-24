//负责连接数据库
var mysql = require('mysql');//导入数据库
//创建连接数据库
function query(sql,params = []) {
	//params =params || [];
	var connect = mysql.createConnection({
		host:'localhost',
		user: 'root',
		password: '123',
		database: 'jingdong'
	});
	return new Promise(function(resolve,reject) {
		connect.query(sql,params,function(err,results,fields) {
		connect.end();//关闭连接
		if(err) reject(err.message);//如果访问数据库有错误
		else resolve(results);//没错
		});
	});
	
}
module.exports= query;
	