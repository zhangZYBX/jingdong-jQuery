//给返回加点击事件
$('i.back').click(function() {
	window.location.href = './profile.html';
});
//加载页面的购买信息
myHttp({
	type:'post',
	url:'/orderDetail/list',
	success: function(results) {
		console.log(results);
		var result = results[0];
		//迭代未付款的订单
		result.forEach(function(item,i) {
			if(item.pay.data[0] === 0)
					$(`<li data-id='${ item.id }' >
						<div class='header'>
							<span class='logo'></span><span class='jingdong'>京东</span>
							<span class='delete'></span>
						</div>
						<span>订单编号: ${item.id}</span>
						<div>订单时间: ${ item.shoppingTime }</div>
						<div class='avatar-wrapper'>
							<img src='${ item.avatar }'/>
						</div>	
						<div class='total-price2'>
							<span>总价钱:￥ ${ item.account }</span>
							<span class='no-pay'>去付款</span>
						</div>
					</li>`).appendTo('ul.order-list');
		})
		//迭代已经付款的订单
		result.forEach(function(item,i) {
			if(item.pay.data[0] === 1)
				$(`<li data-id='${ item.id }'>
						<div class='header'>
							<span class='logo'></span><span class='jingdong'>京东</span>
							<span class='delete'></span>
						</div>
						<span>订单编号: ${item.id}</span>
						<div>订单时间: ${ item.shoppingTime }</div>
						<div class='avatar-wrapper'>
							<img src='${ item.avatar }'/>
						</div>	
						<div class='total-price'>
							<span>总价钱:￥ ${ item.account }</span>
							<span>已支付</span>
						</div>
						<div class='other-wrapper'>
							<span>看相似</span>
							<span>再次购买</span>
						</div>
					</li>`).appendTo('ul.order-list');
		});
		$('span.no-pay').click(function() {
			var id = $(this).closest('li').attr('data-id');
			window.location.href = `./order.html?${ id }`;	
		});
		//加上订单删除事件
		//删除相应订单
		$('span.delete').click(function(e) {
			if(!confirm("删除订单？")) return;
			else{
				var  orderId = $(this).closest('li').attr('data-id');
				myHttp({
					type: 'post',
					url:'/orderDetail/delete',
					data: {orderId: orderId },
					success: function(result) {
						$(e.target).closest('li').remove();
						alert('删除成功！');
					}
				})
			} 
		});
	}
})
