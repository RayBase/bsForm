$(function() {
	$("#vForm").validate({
		rules: {
			"ly[name]": "required",
			"ly[email]": "email",
			"ly[phone]": {
				required: true,
				minlength: 6,
				maxlength: 20,
				digits: true
			},
			"ly[qq]": {
				minlength: 5,
				maxlength: 10,
				digits: true
			},
			"ly[prov]":"required",
			"ly[city]":"required"
		},
		messages: {
			"ly[name]": "姓名不能为空",
			"ly[email]": "请输入有效的电子邮件地址",
			"ly[phone]": {
				required: "电话号码不可为空",
				minlength: "电话号码长度不能小于6个数字",
				maxlength: "电话号码长度不能大于20个数字",
				digits: "电话号码只能输入数字"
			},
			"ly[qq]": {
				minlength: "QQ号码的长度不能小于5位数字",
				maxlength: "QQ号码的长度不能大于10位数字",
				digits: "QQ号码只能输入数字"
			},
			"ly[prov]":"此项必选",
			"ly[city]":"此项必选"
		},
		errorElement:"span",
		submitHandler: function(form) {
			//调用提交次数验证
			returnSubmitByCount(form);
		}
	});
	
	//省市区联动
	$("#vForm").citySelect({
		//省市区数据位置
		url:"js/city.min.js",
		required:false
	});
})
//同一个浏览器不得提交超过3次，依赖jquery-cookie
function returnSubmitByCount(form) {
	var flag = false;
	var subCount = $.cookie('subCount');
	if (subCount == undefined) {
		$.cookie('subCount', '1');
		flag = true;
	} else {
		subCount = $.cookie('subCount');
		if (subCount < 3) {
			subCount++;
			$.cookie('subCount', subCount);
			flag = true;
		} else {
			alert('提示：请不要在短时间内重复提交！');
			flag = false;
		}
	}
	if (flag) {
		form.submit();
	}
}
//添加选项卡项目
function addTabs(id,strings){
	var arr = strings.split(',');
	var html = '';
	for (var i = 0; i < arr.length; i++) {
		html += '<input id="'+id+i+'" type="radio" name="ly['+id+']" value="'+arr[i]+'" /><label for="'+id+i+'">'+arr[i]+'</label>';
	}
	$("#"+id).append(html);
	//绑定click事件，选中后移除其他选项卡效果
	$("#"+id+" label").click(function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});
	//选中选项卡的第一个选项
	$("#"+id).children("label:first").click();
}
//添加产品项目
function addProducts(id,product,price,recommend){
	var arrProduct = product.split(',');
	var arrPrice = price.split(',');
	var html = '';
	for (var i = 0; i < arrProduct.length; i++){
		//判断推荐位
		if(i+1==recommend){
			html += '<input id="'+id+i+'" type="radio" name="ly['+id+']" value="'+arrProduct[i]+'" /><label onclick="selectProduct($(this))" price="'+arrPrice[i]+'" for="'+id+i+'">'+arrProduct[i]+'<img class="recommend" src="images/hot.gif"/></label>';
		}else{
			html += '<input id="'+id+i+'" type="radio" name="ly['+id+']" value="'+arrProduct[i]+'" /><label onclick="selectProduct($(this))" price="'+arrPrice[i]+'" for="'+id+i+'">'+arrProduct[i]+'</label>';
		}
	}
	$("#"+id).append(html);
	//绑定click事件，选中后移除其他选项卡效果
	$("#"+id+" label").click(function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});
	//选中推荐选项
	$("#"+id).children("label:eq("+(recommend-1)+")").click();
}
//发货滚动
function scrollComment(id){
	// 获得ul容器对象
	var sWrap = $("#"+id).children("ul");
	// 声明最后li元素
	var liLast = null;
	// 声明最后li 元素高度
	var liHeight = 0;
	setInterval(run,5000);
	function run(){
		// 循环获得当前容器里最后的 li 元素
		liLast = sWrap.children("li:last-child");
		// 获得最后 li 元素的高度
		liHeight = liLast.css("height");
		sWrap.animate(
			{paddingTop:liHeight},
			function(){
				sWrap.css({"padding-top":"0px"})
				.prepend(liLast.hide().fadeIn("slow"));
			}
		);
	}
}

//计算总价功能
//单价
var proPrice = 0;
//产品数量
var proNumber = 1;
//产品总价
var totalPrice = 0;
//选择产品后的改变
function selectProduct(obj){
	proPrice = obj.attr("price");
	calculate();
}
function reduceNumber(){
	if(proNumber>1){
		proNumber-=1;
		$("#form-number").val(proNumber);
		calculate();
	}
}
function plusNumber(){
	proNumber+=1;
	$("#form-number").val(proNumber);
	calculate();
}
function calculate(){
	totalPrice = proPrice*proNumber;
	$("#form-price").val(totalPrice);
}