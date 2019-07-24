var uploadPaths = require('../config').uploadPaths;//导入config文件中的上传文件处理
var multer = require('multer'); //导入图片上传
var storage = multer.diskStorage({
	destination: function(req,file,cb) {
		cb(null,uploadPaths.temp); //配置保存图片的位置 cb callback回调函数
	},
	filename: function(req,file,cb) {
		var arr = file.originalname.split('.'), //分割开上传的图片的名字与后缀
			extName = arr[arr.length - 1], //取后缀名
			name = (new  Date()).getTime();	//随机生成一个图片名
		cb(null,`${ name }.${ extName }`)
	}
});
module.exports = multer({ storage:storage})