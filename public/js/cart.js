//请求展示购物车
myHttp({
	type: 'post',
	url: '/cart/list',
	success: function(result) {
		result.forEach(function(item) {
			$(`
				<li data-id = '${ item.id }'>
					<span class="checkbox normal checked"></span>
					<span class="checkbox edit"></span>
					<a href='detail.html?id=${item.pid}' class="avatar-wrapper">
						<img src='${item.avatar}' alt=""/>
					</a>
					<div class='info'>
						<a href='datail.html?id=${item.id}' class='name'>${item.name}</a>
						<a href='datail.html?id=${item.id}' class='price-wrapper'>￥<span class='price'>${item.price}</span></a>
						<div class='count-wrapper'>
							<span class='decrease'>-</span>
							<span class='count'>${item.count}</span>
							<span class='increase'>+</spans>
						</div>
					</div>
				</li>
			`).appendTo('ul.cart-list');	
		});
		initPage();//给页面的标签//全选反选加上点击事件
		updataTotalCountAndprice();//更新footer里面的数量与总价格
	}
});
//请求地址
myHttp({
		type:'post',
		url:'/cart/address',
		success: function(result) {
			result.forEach(function(item,i) {
				console.log(item);
				var isDefault = item.isDefault.data[0]; //是否为默认的
				$(`
				<li  data-id='${ item.id }'>
					<input type='radio' name='addressType'/>
					<p>${ item.receiveAddress }</p>
				</li>
				`).appendTo('.all-address');
				if(isDefault === 1) {
					$(`ul.all-address>li:nth-child(${i+1})>input`).attr('checked',true);
					$('.select-address').text($(`ul.all-address>li:nth-child(${i+1})>input`).next().text());
					$('.select-address').attr('data-id',$(`ul.all-address>li:nth-child(${i+1})`).attr('data-id'));
				}
			
			});
		
		}
})
//给返回加点击事件
$('i.back').click(function() {
	window.location.href = 'category.html';
});
//选择收货地址
$('.close').click(function() {
	$('.chose-product').css('bottom','-100%');
});
//关闭地址选择
$('a.select-address').click(function() {
	$('.chose-product').css('bottom','0');
});
//更改收货地址
$('div.chose-product>div:last-child>span').click(function() {
	var address = $('ul.all-address>li>input:checked').next().text();
	$('.select-address').text(address);
	$('.select-address').attr('data-id',$('ul.all-address>li>input:checked').closest('li').attr('data-id'));
	$('.chose-product').css('bottom','-100%');
});
//更新总数量和价格
function updataTotalCountAndprice() {
	var totalCount = 0;
	var totalPrice = 0;
	 var count = 0,price = 0;
	$('span.checkbox.normal.checked').each(function(i,item) {
		count = parseInt($(item).closest('li').find('.count').text());
		price = parseInt($(item).closest('li').find('.price').text());
		totalCount += count;
		totalPrice += count* price;
	});
	$('span.total-count>em').text(totalCount === 0 ? 0: `${ totalCount}`);
	$('span.total-price').text(totalPrice);
}
//全选反选功能加上点击事件
function initPage() {
	//进入/退出编辑状态
	$('.btn-edit').click(function() {
		if($(this).text() === "完成") {
			updataTotalCountAndprice();
			if($('ul.cart-list span.checkbox.normal:not(.checked)').length === 0)
				$('.footer-normal span.all').addClass('checked');
		}
		$(this).text($(this).text() === "完成"? "编辑商品":"完成");
		$('.footer-normal,.footer-edit,.cart-list span.checkbox').toggle();
	});
	//全选反选
	$('.footer-normal span.all').click(function() {
	if($(this).hasClass('checked')) {$(this).add('ul.cart-list span.normal').removeClass('checked')}
	else $(this).add('ul.cart-list span.normal').addClass('checked');
	updataTotalCountAndprice();
	});
	$('.footer-edit span.all').click(function() {
		if($(this).hasClass('checked')) $(this).add('ul.cart-list span.edit').removeClass('checked');
		else $(this).add('ul.cart-list span.edit').addClass('checked');
	});
	$('span.checkbox.normal').click(function() {
		$(this).toggleClass('checked');
		if($('span.checkbox.normal:not(.checked)').length > 0) $('.footer-normal span.all').removeClass('checked');
		else { $('.footer-normal span.all.checkbox').addClass('checked');}
		updataTotalCountAndprice();
	});
	$('span.checkbox.edit').click(function() {
		$(this).toggleClass('checked');
		if($('span.checkbox.edit:not(.checked)').length > 0) $('.footer-edit span.all').removeClass('checked');
		else { $('.footer-edit span.all').addClass('checked');}
	});
	//加减数量（利用事件的冒泡）
	$('div.count-wrapper').click(function(e) {
		if($(e.target).hasClass('increase')) {increaseHandler(e);}
		if($(e.target).hasClass('decrease')) {decreaseHandler(e);}
	});
	$('.btn-remove').click(function() {
		var $checked = $('span.checkbox.edit.checked');
		var ids = [];
		if($checked.length < 1) { alert('请先选择..');return;}
		if(!confirm('删除？')) { return;}
		else{
			$checked.each(function(i,item) {
				ids.push(parseInt($(item).closest('li').attr('data-id')));
				console.log(ids);
			});
			myHttp({
				type: 'post',
				url: '/cart/remove',
				data: {ids:JSON.stringify(ids)},
				success: function(data) {
					$checked.each(function(i,item) {
						$(item).closest('li').remove();
					});
					$('.footer-edit span.all').removeClass('checked');
				}
			});
		}
	});
	//计算功绑定点击
	$('.btn-settlement').click(function() {
		var $checked = $('span.checkbox.normal.checked');
		if($checked.length < 1) { alert('请先加入商品..');return;}
			var ids = [];
			$checked.each(function(i,item) {
				ids.push(parseInt($(item).closest('li').attr('data-id')));
			}) 
			console.log(ids);
			myHttp({
				type: 'post',
				url: '/cart/settlement',
				data: {
					ids:JSON.stringify(ids),
					account:$('span.total-price').text(),
					addressId:$('.select-address').attr('data-id')
					},//服务传页面选择的物品的id与总价格
				success: function(data) {
					$checked.each(function(i,item) {
						$(item).closest('li').remove();
					});
					$('footer-normal span.all').removeClass('checked');
					updataTotalCountAndprice();//用户提交完成订单后没更新一下总金额与数量
					alert('结算生成订单成功，3秒后跳转支付界面...');
					var $overlay = $(`<div class='overlay'></div>`).appendTo('body');
					$overlay.toggle();
					setTimeout(function() {
						$overlay.toggle();
						window.location.href = `./order.html?${data}`;
					},3000);
				}
			});
	});
}
//购物车数量加
function increaseHandler(e) {
	if(parseInt($(e.target).prev().text()) === 5) {alert('商品已经达到上限...');return;} 
	myHttp({
		type: 'post',
		url:'/cart/increase',
		data:{ id: $(e.target).closest('li').attr('data-id') },
		success: function(data) {
			var $target =$(e.target).prev();
			$target.text(parseInt($target.text()) + 1);
			updataTotalCountAndprice();
		}
	});
}
//购物车数量的减
function decreaseHandler(e) {
	if(parseInt($(e.target).next().text()) === 0) {alert('请选择正确的商品数量...');return;} 
	myHttp({
		type: 'post',
		url:'/cart/decrease',
		data:{ id: $(e.target).closest('li').attr('data-id') },
		success: function(data) {
			var $target =$(e.target).next();
			$target.text(parseInt($target.text()) - 1);
			updataTotalCountAndprice();
		}
	});
}