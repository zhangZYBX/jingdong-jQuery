var addressForm = document.forms.address;//获取表单输入的值
$('.header-title i.back').click(function() {
	window.location.href = './profile.html';
});
//展示当前数据库的地址
function getAddressList() {
	myHttp({
		type:'post',
		url:'/address/list',
		success: function(result) {
			updateAddressList(result);
		}
	});
}
getAddressList();
//封装的新增函数
function updateAddressList(result) {
	result.forEach(function(item,i) {
		var isDefault = item.isDefault.data[0]; //是否为默认的
		console.log(isDefault);
		var pam = item.receiveAddress;
		$(`<li data-id='${ item.id }'>
			<span class='receive receive-name'>${ item.receiveName }</span>
			<span class='receive receive-tel'>${ item.receiveTel }</span>
			<span class='is-default'>默认地址:<i></i></span>
			<p class='receive-address'>
				${ pam }
			</p>
			<span class='address-edit'>编辑</span>
		</li>`).appendTo('.address-wrapper>ul');
		if(isDefault === 1) $(`.address-wrapper li[data-id = '${item.id}']`).find('span.is-default>i').addClass('checked');
	});
	//默认地址修改
	$('.address-wrapper li>span.is-default>i').click(function() {
		if($(this).hasClass('checked')) return;
		else{
			//var beforeName = $('i.checked').parent().siblings('span.receive-name').text();
			//console.log(beforeName);
			$(this).addClass('checked');
			$(this).closest('li').siblings('li').find('i.checked').removeClass();
			var afterId = $(this).closest('li').attr('data-id');
			//console.log(afterId);
			myHttp({
				type:'post',
				url:'/address/updateId',
				data: { 
					afterId:afterId
				},
				success: function(result) {
					console.log(result);
				}
			})	
		} 
	});
	//编辑状态的地址管理
	$('span.address-edit').click(function() {
		addressForm.mode.value = '0';
		var id = $(this).closest('li').attr('data-id');
		myHttp({
			type: 'post',
			url: '/address/edit',
			data: { id:id},
			success: function(result) {
				addressForm.reset();
				//让删除的按钮显示
				$('div.form-wrapper ul').attr('data-id',result.id);
				$('div.form-wrapper li.determine:last-child').css('display','block');
				$('input.receive-name').val(result.receiveName);
				$('input.receive-tel').val(result.receiveTel);
				$('li.info>a').text(result.receiveAddress);
				$('div.form-wrapper').toggle();
			}
		})
	});	
}
//新增的事件
$('div.footer>a').click(function() {
	addressForm.reset();
	$('div.form-wrapper').toggle();
	addressForm.mode.value = '1';
});
// 新增确定按钮
$('div.form-wrapper li.new-address').click(function() {
	var receiveName = $('input.receive-name').val();
	var receiveTel = $('input.receive-tel').val();
	var receiveAddress = $('.info>a').text();
	$('div.form-wrapper').toggle();
	if(addressForm.mode.value !== '1') {return;}
	else {
			myHttp({
				type:'post',
				url:'/address/add',
				data: {receiveTel:receiveTel,receiveName:receiveName,receiveAddress:receiveAddress},
				success: function(result) {	
					//新增完成后表单里面清空刚刚填写的数据
					addressForm.reset();
					//重新把刚刚加载的数据，，重新请求一遍，数据库梅川汇
					$('div.address-wrapper>ul').empty();
					getAddressList();
				}
			})
	}
});
//删除
$('.form-wrapper li:last-child').click(function() {
	if(!confirm('删除？！')) {  return;}
	else{
			var id = $(this).closest('ul').attr('data-id');
			myHttp({
				type: 'post',
				url:'/address/delete',
				data: {id:id},
				success: function(data) {
					var lis = $('.address-wrapper li');
					for(var i =0;i < lis.length; i++){
						if(lis.eq(i).attr('data-id') === id) {
							lis[i].remove();
							alert('删除成功...');
						}
					}
					addressForm.reset();
					$('div.form-wrapper').toggle();
				}
			});
	}
		
});
//修改
$('div.form-wrapper li.new-address').click(function(event) {
	if( addressForm.mode.value !== '0') return;
	else{
		var receiveName = $('input.receive-name').val();
		var receiveTel = $('input.receive-tel').val();
		var receiveAddress = $('.info>a').text();
		var id = $(this).closest('ul').attr('data-id');
			myHttp({
			type:'post',
			url:'/address/update',
			data:{receiveName:receiveName,receiveTel:receiveTel,receiveAddress:receiveAddress,id:id},
			success:function(result) {
				addressForm.reset();
				// var lis = $('.address-wrapper li');
				// for(var i =0;i < lis.length; i++){
				// 	if(lis.eq(i).attr('data-id') === id) {
				// 		lis.eq(i).find('span.receiveName').text(receiveName);
				// 		lis.eq(i).find('span.receiveTel').text(receiveTel);
				// 		lis.eq(i).find('p.receiveAddress').text(receiveAddress);
				// 	}
				// }
				//alert('修改成功...');
				$('div.address-wrapper>ul').empty();
				getAddressList();
			}
		});
	}
})