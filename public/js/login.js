$('span[class^=title]').click(function() {
	$('.login-phone,.login-pwd,span.title-phone,span.title-pwd').toggle()
});
$('.header>i').click(function() {
	window.location.href = './home.html';
});
//获取验证码
$('button.code').click(function() {
	myHttp({
		url: '/login/getcode',
		type: 'get',
		success: function(data) {
			$('.code').text(data);
		}
	})
});
//手机号登录
$('.btn-phone').click(function() {
	if($('.code').text() !== $('.mcode').val().toUpperCase()) {
		alert('验证码错误');
		return;
	}
	else {
		var tel = $('.form-item-wrapper>input.mphone').val();
		var num = $('.mcode').val();
		myHttp({
			url: '/login/phone',
			type: 'post',
			data: {phone:tel,code:num},
			success:function(data) {
				window.location.href = Cookies.get('target');
			}
		})
	}
});
//手机号密码登录
$('.btn-pwd').click(function() {
	$(this).addClass('disabled').attr('disabled',true);
	var tel = decodeURI($('.form-item-wrapper>input.pwd-phone').val());
	var code = $('.form-item-wrapper>input.pwd-word').val();
	myHttp({
		url:'/login/pwd',
		type: 'post',
		data: {name: tel,pwd: code},
		success: function(data) {
			console.log(data);
			$('.btn-pwd').removeClass('disabled').attr('disabled',false);
			window.location.href = Cookies.get('target');
		}
	});
});