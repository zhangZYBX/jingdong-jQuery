//返回到菜单列表页
// $('span>i.back').click(function() {
// 	window.location.href ='category.html';
// });
// 从当前浏览器url中解析出传来的id和name
//name值放在h1中显示
//把id发送ajax请求指定分类的商品列表数据
var params = window.location.search.substr(1).split('&');
var cid = parseInt(params[0].split('=')[1])
var name = decodeURI(params[1].split('=')[1]);
$('.header-title>p').text(name);
//返回成功的数据显示拼接到页面中
function updataList(data) {
	data.forEach(function(item) {
		$(`<li data-id='${item.id}'>
				<a href='detail.html?pid=${item.id}'>
					<div class='avatar-wrapper'>
						<img src="${item.avatar}">
					</div>
					<p class='ellipsis'>${item.name}</p>
					<em>￥<span>${item.price}</span></em>
					<h3>${item.store}&gt;</h3>
				</a>
			</li>`
		).appendTo('.content>ul')
	});
}

//页面发送ajax请求数据库取数据
myHttp({
	type: 'post',
	url: '/product/list',
	data: {cid: cid},
	success: function(data) {
		if(data.length === 0)
			$(`<p>暂无商品信息...</p>`).appendTo('div.content>ul'); //判断商品信息有无，没有就显示
		else updataList(data); //有商品信息就直接展示商品信息
		
		
	}
});