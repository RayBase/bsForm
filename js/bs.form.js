$(function(){
	//绑定click事件，选中后移除其他选项卡效果，加强form-tab的适用性
	$(".form-tab label").click(function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});
	$(".form-tab label").children("label:first").click();
	
})
//正则验证
function validateForm(obj){
	var flag = true;
	var inputList = obj.find(".bs-valid");
	$.each(inputList, function() {
		var str = $(this).attr("reg");
		//转义成正则对象
		var reg = eval(str);
		if(!reg.test($(this).val())){
			$(this).after('<span class="error">'+$(this).attr('errmess')+'</span>');
			// 标记表单可否通过，只要有一个条件不成立则 false
			flag = false;
		}else{
			$(this).siblings("span.error").remove();
		}
	});
	return flag;
}

//添加选项卡项目
function addTabs(id,strings){
	var arr = strings.split(',');
	var html = '';
	for (var i = 0; i < arr.length; i++) {
		html += '<input id="'+id+i+'" type="radio" name="pay['+id+']" value="'+arr[i]+'" /><label for="'+id+i+'">'+arr[i]+'</label>';
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
function addProducts(id,product,price,recomId){
	var arrProduct = product.split(',');
	var arrPrice = price.split(',');
	var html = '';
	for (var i = 0; i < arrProduct.length; i++){
		html += '<input id="'+id+i+'" type="radio" name="pay['+id+']" value="'+arrProduct[i]+'" /><label onclick="selectProduct($(this));" price="'+arrPrice[i]+'" for="'+id+i+'">'+arrProduct[i]+'</label>';
	}
	$("#"+id).append(html);
	//给推荐位加闪图
	if(recomId!=0){
		//取模防超出报错
		recomId > arrProduct.length ? recomId = arrProduct.length : recomId = recomId;
		$("#"+id).children("label").eq(recomId-1).append('<i class="recommend"></i>');
	}
	//绑定click事件，选中后移除其他选项卡效果
	$("#"+id+" label").click(function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});
	//选中推荐选项
	if(parseInt(recomId)==0){
		$("#"+id).children("label:first").click();
	}else{
		$("#"+id).children("label:eq("+(recomId-1)+")").click();
	}
}

//添加附加项目
function addExtra(id,extra,price){
	var arrExtra = extra.split(',');
	var arrPrice = price.split(',');
	var html = '';
	
	for (var i = 0; i < arrExtra.length; i++){
		html += '<input id="'+id+i+'" type="radio" name="pay['+id+']" value="'+arrExtra[i]+'" /><label onclick="selectExtra($(this));" price="'+arrPrice[i]+'" for="'+id+i+'">'+arrExtra[i]+'</label>';
	}
	$("#"+id).html(html);
	
	//绑定click事件，选中后移除其他选项卡效果
	$("#"+id+" label").click(function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});
	$("#"+id).children("label:first").click();
}


//选择产品发生的基价管理和计算
//基础单价
var proPrice = 0;
function selectProduct(obj){
	proPrice = obj.attr("price");
	calculate();
}

//选择折后叠加选项的计算
//折后加价变量
var extraPrice = 0;
function selectExtra(obj){
	extraPrice = parseInt(obj.attr("price"));
	calculate();
}

//选择基价打折的计算
//折扣变量，默认10折
var discount = 10;
function selectDiscount(obj){
	discount = parseInt(obj.attr("price"));
	calculate();
}

//产品数量控制与计算函数
//产品数量
var proNumber = 1;
//减数量按钮
function reduceNumber(){
	if(proNumber>1){
		proNumber-=1;
		$("#form-number").val(proNumber);
		calculate();
	}
}
//加数量按钮
function plusNumber(){
	proNumber+=1;
	$("#form-number").val(proNumber);
	calculate();
}
//name:批发优惠制度
//date:20161001
//ver:0.11
var isWholesale = false;	//是否启动批发优惠
var wholesaleDiscount = 0;  //计算得出的优惠总价
var wholePrices = null;	//优惠价格数组
var wholeNumbers = null;	//优惠件数数组
var wholeStatus = 0;	//优惠状态
//name: 启动批发优惠的开关
function openWholesale(prices,numbers,status){
	isWholesale = true;
	wholePrices = prices.split(',');
	wholeNumbers = numbers.split(',');
	wholeStatus = status;
}
//name:计算批发优惠的正式方法并返回当前基价和数量相对应的优惠价格
//date:20161001
//ver:0.12
//info:20161002修复计价衔接错误问题
function wholesale(){
	var length = wholeNumbers.length;
	//临时优惠价格数组，不参与外部固定优惠价格
	var tempPrices = new Array();
	//每次都重新计算当前基价之下的相对优惠价格组，组成临时优惠数组，防止影响到其他组件方法的正常运行
	if(wholeStatus == 0){
		for(var i = 0;i < length; i++){
			tempPrices[i] = proPrice - wholePrices[i];
		}
	}else if(wholeStatus == 1){
		for(var i = 0;i < length; i++){
			tempPrices[i] = proPrice * wholePrices[i] / 10;
		}
	}
	tempPrices[length] = parseInt(proPrice);
	
	for (var i = length-1; i >= 0; i--){
		if(proNumber > (wholeNumbers[i]-1)){
			return tempPrices[i] * proNumber;
		}else if(proNumber < wholeNumbers[0]){
			return tempPrices[length] * proNumber;
		}
	}
}
//end:产品数量控制与计算函数完毕

//name:总价的计算，包含各种扩展折扣、附加价格等
//date:20161001
//ver:0.31
//info:20161001扩展了批发优惠的计算
var totalPrice = 0;	//产品总价
function calculate(){
	//计算批发优惠
	if(isWholesale){
		totalPrice = wholesale();
	}else{
		//产品单价*数量
		totalPrice = proPrice*proNumber;
	}
	
	//打折
	totalPrice = totalPrice*discount/10;
	//附加价格
	totalPrice += extraPrice;
	//价格做了小数点后2位向上取整
	$("#form-price").val(Math.ceil(totalPrice*100)/100);
}
//计算功能结束

//根据三联动增加地址
function autoAddress(){
	var address = '';
	address += $("select[name='pay[prov]']").val();
	address += " " + $("select[name='pay[city]']").val();
	address += " " + $("select[name='pay[dist]']").val() + " ";
	$("textarea[name='pay[address]']").val(address);
}
//绑定选择事件
function bindAddress(){
	$("select[name='pay[prov]']").change(function(){autoAddress()});
	$("select[name='pay[city]']").change(function(){autoAddress()});
	$("select[name='pay[dist]']").change(function(){autoAddress()});
}

//替换评论产品
function replacePro(proId,comId){
	//动态创建发货列表
	$.ajaxSettings.async = false;
	$.getJSON("js/customer.json",function(data){
    	//data就是json对象了，不需要再转换
		var customer = data.customer;
		//乱序
		customer.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
		var html = '<ul>';
		$.each(customer,function(i,element){
			if(i>20){
				return false;
			}
			html+='<li>';
			html+='<p>'+customer[i].name+' ['+customer[i].mobile+']</p>';
			html+='<p>您订购的产品 <span class="fg-green">'+customer[i].proId+'</span> 已发货！</p>';
			html+='</li>';
		});
		html+='</ul>';
		$("#"+comId).append(html);
	});
	
	var products = $("#"+proId+" input");
	var proLength = products.length;
	var tempNum = 0;
	$("#"+comId+" span").each(function(index,element){
		//防止不填数字或者数字与产品数量不符
		tempNum = parseInt($(this).html())%proLength;
		$(this).html(products[tempNum].value);
	})
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

//同一个浏览器不得提交超过10次，依赖jquery-cookie

function returnSubmitByCount(form) {
	var flag = false;
	var subCount = $.cookie('subCount');
	if (subCount == undefined) {
		$.cookie('subCount', '1');
		flag = true;
	} else {
		subCount = $.cookie('subCount');
		if (subCount < 10) {
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