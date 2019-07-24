//展示弹窗
$('.add-cart').click(function() {
	$('.chose-product').css('bottom','0');
});
//关闭弹窗
$('.close').click(function() {
	$('.chose-product').css('bottom','-100%');
});
//跳转购物车
$('span.cart-list').click(function() {
	window.location.href = './cart.html';
});
var params = window.location.search.substr(1).split('=');
var pid = params[1];
//详情页面加载商品的详情
myHttp({
	type: 'post',
	url: '/product/detail',
	data: {pid:pid},
	success: function(data) {
		var path = data[0].bannerImage;
		var name = data[0].name;
		var price = data[0].price;
		var avatar = data[0].avatar;
		var pathes = path.substr(0).split('?');
		pathes.forEach(function(item,i) {
			$(`<li class='swiper-slide'><img src='${item}'></li>`).appendTo('ul.swiper-wrapper');
		});
		$(`<div class="swiper-pagination"></div>`).appendTo('.swiper-container')
		$('.product-name').text(name);
		$('.price-wrapper>div:first-child>em>span,span.hidden-price>em').text(price);
		$('.detail-avatar>img').attr('src',avatar);
		
		var mySwiper = new Swiper('.swiper-container',{
				autoplay: true,
				loop: false,
				pagination: {
					el: '.swiper-pagination',
				},
			});
	
	}
});
$('span.increase').click(function() {
	var num = parseInt($('span.count').text());
	if(num > 4) {alert('购买上限！');return;}
	{
		num += 1;
		$('span.count').text(num);
	}
});
//给返回加点击事件
// $('i.back').click(function() {
// 	window.location.href = './category.html';
// });
$('span.decrease').click(function() {
	var num = parseInt($('span.count').text());
	if(num < 1) {alert('请输入正确的商品数量！');return;}
	{
		num -= 1;
		$('span.count').text(num);
	}
});
$('.add-mcart').click(function() {
	var count = $('span.count').text();
	if( count === '0') { alert('请选择购买数量！');return;} 
	myHttp({
		type: 'post',
		url: '/detail/add',
		data:{count:count,pid:pid},
		success: function(data) {
			if(data !== null ) alert(data);
			else  {
				$('.chose-product').css('bottom','-100%');
				alert('加入购物车成功！');  //window.location.href ='./cart.html';
			}
		}
	})
});