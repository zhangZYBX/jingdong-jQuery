//给下方footer加点击切换
$('.footer>ul>li:nth-child(1),.footer>ul>li:nth-child(2)').click(function() {
	if($(this).find('a').hasClass('active')) return;
	$(this).find('a').addClass('active').closest('li').siblings().find('a').removeClass('active');
});
//绑定点击登录
// $('.footer>ul>li:nth-child(5)').click(function() {
// 	window.location.href = 'login.html';
// });
//页面发送请求加载一级分类
//处理一级分类
function updataMainCategory(data) {
	data.forEach(function(item) {
		$(`<li data-id='${item.id}' data-avatar='${item.avatar}'><span>${ item.name }</span></li>`).appendTo('ul.category-main');
	});
	$('ul.category-main>li').click(function() {
		if($(this).hasClass('active')) return;
		$(this).addClass('active').siblings().removeClass('active');
		$('.avatar-wrapper>img').attr('src',$(this).attr('data-avatar'));
		var id = parseInt($(this).attr('data-id'));
		getSubCategoryData(id);
	}).first().addClass('active');
	//默认让第一个一级分类处于激活状态
}
//处理二级分类
function updataSubCategory(data) {
	$('ul.category-sub').empty();
	data.forEach(function(item) {
		$(`<li data-id='${ item.fid}'>
				<a href='list.html?cid=${item.id}&name=${item.name}'>
					<img src='${item.avatar}'/>
					<span>${ item.name}</span>
				</a>
			</li>`).appendTo('.category-sub')
	});
}
//ajax 获取制定一级分类的二级分类的id
function getSubCategoryData(id) {
	myHttp({
		type: 'get',
		url:`/category/sub`,
		data: {id:id},
		success: function(data) {
			updataSubCategory(data);
		}
	});
}
//ajax 动态请求页面一级分类信息
myHttp({
	type: 'get',
	url: '/category/main',
	success: function(data) {
		updataMainCategory(data);
		getSubCategoryData(data[0].id);
	}
});