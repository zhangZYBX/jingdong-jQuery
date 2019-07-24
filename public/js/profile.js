//获取当前用户的信息
myHttp({
	type: 'post',
	url: '/profile/message',
	success: function(data) {
		$('.user-right-top>span:first-child').text(data[0].name);
		$('.user-right-body>span').text(data[0].name);
	}
})
$('.header-title i.back').click(function() {
	window.location.href = './home.html';
});
$('.management').click(function() {
	window.location.href = 'address.html'
})
$('.model-wrapper>div:last-child').click(function() {
	window.location.href = './orderDetail.html'
})
//退出登录
$('.user-right-top>span:last-child').click(function() {
	if(!confirm('确定退出？')) return;
	else {
		myHttp({
			type:'post',
			url:'/profile/loginout',
			success: function(reslult) {
				window.location.href = './home.html';
			}
		})
	}
});