//新建一个遮罩层
var $overlay = $(`<div class='overlay'></div>`).appendTo('body');
function myHttp(options) {
	options.dataType = 'json';
	var success = options.success;
	options.success = function(result) {
		$overlay.toggle(); //ajax请求成功之后遮罩层隐藏切换
		if(result.message !== '') alert(result.message);
		switch(result.status) {
			case 200: 
				success(result.data);
				break;
			case 401:
				Cookies.set('target',window.location.href);
				window.location.href = './login.html';
				break;
			default:
				break;
		}
	};
	//让着遮罩层切换显示
	$overlay.toggle();
	//延时1s时间发送ajax
	setTimeout(function() {$.ajax(options);},500);
}