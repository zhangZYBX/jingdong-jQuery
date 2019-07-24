var path = require('path');//导入路径处理模块
//图片文件夹的获取
exports.uploadPaths = {
	temp: path.join(__dirname,'../temp'),	//临时文件目录 join拼接文件名
	root: path.join(__dirname,'../public'), //根目录
	category: '/images/category/',
	product:{
		banner:'/images/detail/banner/',
		avatar:'/images/list/avatar/'
	},
}
exports.httpResult = {
	success:function(data, message) { //成功
		data = data || null;
		message = message || '';
		return{ status: 200,data: data, message: message};
		
	},
	failure:function(data, message) {
		data = data || null;
		message = message || '';
		return{ status: 199,data: data, message: message};
		
	},
	error:function(data, message) {
		data = data || null;
		message = message || '';
		return{ status: 500,data: data, message: message};
		
	},
	untoken:function(data, message) {
		data = data || null;
		message = message || '';
		return{ status: 401,data: data, message: message};
		
	},
	notFound:function(data, message) {
		data = data || null;
		message = message || '';
		return{ status: 404,data: data, message: message};
		
	}
};


exports.sessionOptions = {
	secret:'xiaomi',//加密格式
	cookie: { httpOnly: true, secure: false, maxAge: 1000*60*20 },//maxAge表示存活时间
	rolling: true, //让客户端与服务器每一次都强制刷新一下保存seeeionID的客户端cookie的maxAge
	saveUninitialized:false, //只需要session的时候才开始创建客户端对应的session
	resave: false //客户端与服务器端交互后不强制刷新客户端在服务器端相关的session
};

//写的正则表达式判断当前访问的是否事个人中心和购物车访问过来的页面有没有登录
exports.authPathsReg = /^\/(profile|cart|detail|address|orderDetail)/;