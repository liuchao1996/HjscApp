//globalVariable.js内也有配置需要更改

//正式外文件地址
//https://file.arctron.cn
//正式外
var URL = 'https://bdms.arctron.cn';
//外
//var URL = 'http://203.156.220.3:8080';
//内
//var URL = 'http://10.252.26.240:8080';
//聊天url
var chaturl='http://42.159.154.173:8079';

/**
 * 用户信息
 */
var userReuslt;

/**
 * 概览页面
 */
var itemsdata = [
                {imgurl:'icon/gl1.png',name:'查询',zt: true,appurl:'../at_add/qr_code.html'},
//				{imgurl:'icon/gl2.png',name:'跟踪',zt: false,appurl:'javascript:void(0)'},
//				{imgurl:'icon/gl3.png',name:'检查',zt: false,appurl:'javascript:void(0)'},
				{imgurl:'icon/gl4.png',name:'主题',zt: true,appurl:'left.html?page=subject'},
//				{imgurl:'icon/gl5.png',name:'对话',zt: true,appurl:'../at_add/dialogue_list.html'},
				{imgurl:'icon/gl6.png',name:'会议',zt: true,appurl:'../at_add/huiyi_list.html'},
				{imgurl:'icon/gl7.png',name:'虚拟场景',zt: true,appurl:'../at_team/Space_container.html'},
				{imgurl:'icon/gl8.png',name:'工程日历',zt: true,appurl:'../at_add/engineering_calendar.html'},
				{imgurl:'icon/gl9.png',name:'工程任务',zt: true,appurl:'../at_team/left.html?page=engineering_task&isCould=add'},
				{imgurl:'icon/gl10.png',name:'工程云盘',zt: true,appurl:'../at_team/left.html?page=cloud_project_list&isCould=yes'},
				{imgurl:'icon/gl11.png',name:'云盘分享',zt: true,appurl:'../at_team/left.html?page=cloud_project_share&isCould=yes'},
				{imgurl:'icon/gl12.png',name:'中转站',zt: true,appurl:'../at_team/left.html?page=cloud_project_station&isCould=yes'},
				{imgurl:'icon/gl13.png',name:'联系人',zt: true,appurl:'../at_team/linkman.html'},
				{imgurl:'icon/gl14.png',name:'设置',zt: true,appurl:'../at_team/setup.html'},
				{imgurl:'icon/gl15.png',name:'添加',zt: true,appurl:'../at_team/gailan_add.html'},
				];

/**
 * ip地址
 */
var urlAddress;

/**
 * 是否记住密码
 */
var flag;

/**
 * 跳转页面
 */
var jumpPlace;

$('#login').on('tap', function() {

	login()
})

$(function() {

	var power = getGlobalPower();

	/**
	 * 自动登陆
	 */
	autoLogin();

})

/**
 * 登录
 */
function login() {

	var account = $("#account").val();
	var password = $("#password").val();
	
	var isAndroid=getfromin();  //判断是不是安卓
	platformType="";
	if(isAndroid){
		platformType=2;
	}else{
		platformType=3;
	}

	var body = {
		email: account, //'spring', //mike
		password: hex_md5(password), ////hex_md5('123654'),
		platformType: platformType, // 平台类型 1:web, 2:android, 3:ios
		appType: 7 //应用类型  aec：7
	}

	//1.1
	$.ajax({
		type: "POST",
		url: URL + "/arctron-usercenter/api/server/userVerify.json",
		data: body,
		dataType: 'JSON',
		success: function(res) {
			userReuslt = res;
			//登录不成功
			if(res.responseInfo.responseCode != 1) {
				if(account==""){
					mui.toast("请输入账号");
				}else{
					if(password==""){
					mui.toast("请输入密码");
				}else{
					mui.toast(res.responseInfo.responseMessage);
				}
				}
//				mui.toast(res.responseInfo.responseMessage);
			} else { //登录成功
				//将手机类型加入
				userReuslt.userInfo.platformType=platformType;

				tokenId = res.userInfo.tokenId;
                    userReuslt.userInfo.LOGINURL=URL;
//                  userReuslt.userInfo.itemsdata=itemsdata;//保存进去
				/*判断是否有按钮信息，如果没有就创建本地存储并初始化*/
					var buttons=[{userId:res.userInfo.userId,infos:itemsdata}];
	                var buttonflag=localStorage.getItem('itemsdatas'); 
	                if(buttonflag){//存在本地存储，则需要判断该存储中是否存在当前登录用户的信息
	                	var n=1;
	                	var m=JSON.parse(buttonflag);
	                	$.each(m, function(i,e) {
	                		if(e.userId==res.userInfo.userId){
	                			n+=1;
	                		}
	                	});
	                	if(n<2){//不存在当前用户
	                		m.push({userId:res.userInfo.userId,infos:itemsdata});
	                		localStorage.setItem('itemsdatas',JSON.stringify(m));
	                		console.log("存在本地存储，但没有当前用户的信息")
	                	}else{
	                		//存在当前用户
	                		console.log("存在本地存储，并存在当前用户的信息")
	                	}
	                	
	                }else{
	                	localStorage.setItem('itemsdatas',JSON.stringify(buttons));
	                	console.log("不存在本地存储")
	                }
				//是否记住密码,如果记住密码就把tokenid存入本地缓存
				flag = $('#remember').prop('checked');

				if(flag) {
					saveTokenId(userReuslt.userInfo.tokenId);
//					alert('记住密码成功');
                    mui.toast("记住密码成功");
				}
				// 保存用户信息到本地缓存中
				userReuslt.userInfo.httpurl=URL;
				//存储聊天链接
				userReuslt.userInfo.chaturl=chaturl;
				setGlobalUserInfo(userReuslt.userInfo);
//					setGlobalUserInfo(userInfo);
				
				// 产品实例导航
				chanpin_sldh();
			}

		},
		error:function(){
			mui.toast('登录失败');
		}
	});
}

/**
 * 自动登录
 */
function autoLogin() {
	$('body').hide();
	var tokenid = getTokenId() //getGlobalUserInfo();
	if(tokenid != null) {
	var isAndroid=getfromin();  //判断是不是安卓
	platformType="";
	if(isAndroid){
		platformType=2;
	}else{
		platformType=3;
	}

		$.ajax({
			type: "POST",
			url: URL + "/arctron-usercenter/api/server/autoUserVerify.json",
			async: true,
			data: {
				tokenId: tokenid,
				platformType: '2',
				appType: 7
			},
			dataType: 'json',
			success: function(data) {
				console.log('自动登录',data);
				if(data.responseInfo.responseCode == 1) {
					//将手机类型加入
					data.userInfo.platformType=platformType;
					data.userInfo.LOGINURL=URL;
//					data.userInfo.itemsdata=itemsdata;
					/*判断是否有按钮信息，如果没有就创建本地存储并初始化*/
	                var buttonflag=localStorage.getItem('itemsdata'); 
	                if(buttonflag){
	                }else{
	                	localStorage.setItem('itemsdata',JSON.stringify(itemsdata));
	                }
					// 保存用户信息到本地缓存中
					data.userInfo.httpurl=URL;
					setGlobalUserInfo(data.userInfo);
					// 产品实例导航
					chanpin_sldh();
					
				} else {
					$('body').show(); 
				}
			},
			error: function() {
				mui.toast('发生异常');
				$('body').show();
			}

		});

	} else {
		$('body').show();
	}
}

/**
 * 保存tokenid到本地缓存
 * @param {Object} tokenid
 */
function saveTokenId(tokenid) {
	if(!window.localStorage) {
		alert("不支持localstorage");
		return false;
	} else {
		var storage = window.localStorage;
		storage.setItem("tokenid", tokenid);
	}
}

/**
 * 从本地缓存中获取tokenid
 */
function getTokenId() {
	if(!window.localStorage) {
		alert("不支持localstorage");
	} else {
		var storage = window.localStorage;
		var tokenId = storage.getItem("tokenid");
		return tokenId;
	}
}
//clearLocalStorage();
/**
 * 将localStorage的所有内容清除
 */
function clearLocalStorage() {
	var storage = window.localStorage;
	storage.clear();
}
//判断手机设备
function getfromin() {
				var u = navigator.userAgent;
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	return isAndroid;
}

