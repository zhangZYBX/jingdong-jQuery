var orderId = window.location.search.substr(1);

//给返回加点击事件
$('i.back').click(function() {
	window.location.href = './category.html';
});
//展示刚刚购买的订单商品
myHttp({
	type: 'post',
	url: '/order/list',
	data: { orderId: orderId},
	success: function(data) {
		var orderlist = data[0];
		console.log(data);
		orderlist.forEach(function(item,i) {
			$(`
			<li>
				<a class='avatar-wrapper'><img src='${ item.avatar }'></a>
				<div class='info'>
					<p>${ item.name }</p>
					<span>￥${ item.price }</span>
					<span>x${ item.count }</span>
				</div>
			
			</li>
			`).appendTo('.order-list');
		});
		$('em.price').text(data[0][0].account);
		$('li.order-id').text(data[0][0].id);
		$('li.shoppingTime').text(data[0][0].shoppingTime);
		$('.address-wrapper>p').text(data[0][0].receiveAddress);
		$('.address-wrapper>span:nth-child(1)').text(data[0][0].receiveName);
		$('.address-wrapper>span:nth-child(2)').text(data[0][0].receiveTel);
	}
})
//支付状态确认
$('span.confirm-pay').click(function() {
	if(!confirm('确认付款？')) return;
	else {
		var orderId = $('li.order-id').text();
		myHttp({
			type:'post',
			url:'/order/pay',
			data: {orderId:orderId},
			success: function(result) {
				alert('支付成功！')
				window.location.href = './profile.html';
			}
		})
	}
});
//地址选择
//请求地址
myHttp({
		type:'post',
		url:'/cart/address',
		success: function(result) {
			console.log(result);
			result.forEach(function(item,i) {
				var isDefault = item.isDefault.data[0]; //是否为默认的
				$(`
				<li  data-id='${ item.id }'>
					<input type='radio' name='addressType'/>
					<p class='receive-name'>${ item.receiveName }</p>
					<p class='receive-tel'>${ item.receiveTel }</p>
					<p class='receive-address'>${ item.receiveAddress }</p>
				</li>
				`).appendTo('.all-address');
				if(isDefault === 1) {
					$(`ul.all-address>li:nth-child(${i+1})>input`).attr('checked',true);
				}
			});
			//$('ul.all-address>li:first-child>input').attr('checked',true);
			// $('.select-address').text($('ul.all-address>li:first-child>input').next().text());
			// $('.select-address').attr('data-id',$('ul.all-address>li:first-child').attr('data-id'));
		}
})
//选择收货地址
$('.close').click(function() {
	$('.chose-product').css('bottom','-100%');
});
//关闭地址选择
$('div.address-wrapper').click(function() {
	$('.chose-product').css('bottom','0');
});
//更改收货地址
$('div.chose-product>div:last-child>span').click(function() {
	var address = $('ul.all-address>li>input:checked').siblings('p.receive-address').text();
	var name = $('ul.all-address>li>input:checked').siblings('p.receive-name').text();
	var tel = $('ul.all-address>li>input:checked').siblings('p.receive-tel').text();
	$('.address-wrapper>p').text(address);
	$('.address-wrapper>span:first-child').text(name);
	$('.address-wrapper>span:nth-child(2)').text(tel);
	$('.address-wrapper').attr('data-id',$('ul.all-address>li>input:checked').closest('li').attr('data-id'));
	$('.chose-product').css('bottom','-100%');
});