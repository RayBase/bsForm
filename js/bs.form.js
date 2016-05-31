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
				}
			},
			messages: {
				"ly[name]": "姓名不能为空",
				"ly[email]": "请输入有效的电子邮件地址",
				"ly[phone]": {
					required: "请输入您的电话号码",
					minlength: "电话号码长度不能小于6个数字",
					maxlength: "电话号码长度不能大于20个数字",
					digits: "电话号码只能输入数字"
				},
				"ly[qq]": {
					minlength: "QQ号码的长度不能小于5位数字",
					maxlength: "QQ号码的长度不能大于10位数字",
					digits: "QQ号码只能输入数字"
				}
			},
			submitHandler: function(form) {
				//调用提交次数验证
				returnSubmitByCount(form);
			}
		});
		
		//省市区联动
		$("#vForm").citySelect({
			//省市区数据位置
			url:"js/city.min.js"
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
