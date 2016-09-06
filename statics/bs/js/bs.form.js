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
	
	//日期控件
	jeDate({
	    dateCell: '#form-date',
		isinitVal:true,
	    format: 'YYYY-MM-DD' // 分隔符可以任意定义，该例子表示只显示年月 
		//minDate: '2015-06-01', //最小日期
	    //maxDate: '2017-06-01'  //最大日期
		//choosefun:function(val){alert(val)}
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
function addTabs(id,name,strings){
	var arr = strings.split(',');
	var html = '';
	for (var i = 0; i < arr.length; i++) {
		html += '<span><input type="radio" name="'+name+'" value="'+arr[i]+'" />'+arr[i]+'</span>';
	}
	$("#"+id).append(html);
	//绑定click事件，选中后移除其他选项卡效果，并点击radio
	$("#"+id+" span").click(function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
		$(this).siblings().children("input").removeAttr("checked");
		$(this).children("input").attr("checked","checked");
	});
	//选中选项卡的第一个选项
	$("#"+id).children("span:first").click();
}
