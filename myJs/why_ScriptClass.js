/***************使用请保留以下信息***************
* 更新日期:2013年6月8日
* 名称:why_ScriptClass.js (含浪JS角本库)	
* E_mail: w.why@163.com ; QQ: 51474146;
************************************************/
{//加强内部对象
String.prototype.trim = function(){ //删除字符串的前后空格
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.Blength = function(){//返回字符串字节长度
	return this.replace(/([^\x00-\xFF])/g, "aa").length;
};
String.Blength = function(str){//返回str字节长度
	return str.replace(/([^\x00-\xFF])/g, "aa").length;
};
String.prototype.getBlength = function(){
	var str = this,n=0;
	for(var i=str.length;i--;){
        n += str.charCodeAt(i) > 255 ? 2 : 1;
    }
    return n;
};

String.format = function () {//JS实现String.format方法
    var i = 1, args = arguments;
    var str = args[0];
    var re = /\{(\d+)\}/g;
    return str.replace(re, function () { return args[i++] });
};

Math.guid = function(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
		var r = Math.random()*16|0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	})
}

function get_minint(n) {//获得最接近1或-1的整数;
    return (n>0?1:-1)*Math.ceil(Math.abs(n));
};
}

//*********必要,基本方法*********
{//以下为下正则表达式的三个方法(表达式后加i则不区分大小写,加g则全局查找;
function REsearch(re, str){ //正则查找
	return (str.search(re) != -1);
};

function REreplace(re, str, nstr){ //正则替换 返回替换后的结果
	return str.replace(re, nstr);
};

function REmatch(re, str){ //正则获取,反回结果数组
	return str.match(re); 
};
}

{//Cookie操作及GET方式的URL参数

function setCookie(c_name,value,expiredays){//设置Cookie值 键名,值,保存时长(天)
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+ ((expiredays==0) ? "" : ";expires="+exdate.toGMTString()) + ";path=/";
};

function getCookie(c_name){//获取Cookie值
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1)
		{
			c_start=c_start + c_name.length+1 ;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		};
	};
	return null;
};

function deleteCookie(name) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
    setCookie(name, "", -1);
};

function getURL_argument(kdy){//JS获取URL参数
	var url = location.href; 
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
	var paraObj = {} 
	for (i=0; j=paraString[i]; i++){ 
		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf ("=")+1,j.length); 
	}
	var returnValue = paraObj[kdy.toLowerCase()]; 
	if(typeof(returnValue)=="undefined"){ 
		return ""; 
	}else{
		return returnValue; 
	} 
};
/**
添加时间：2012年11月16日16时50分35秒
用法 
newurl = setURL_argument("key",val); //修改或添加单个参数
newurl = setURL_argument({key1:val1,key2:val2,key3:val3});//修改或添加多个参数
newurl = setURL_argument("key"); //删除单个参数
newurl = setURL_argument({"key1":,"key2":"";}); //删除单个参数
**/
function setURL_argument(){//修改、添加,删除URL参数
	var set = function(key,val,url_){
		var url = url_ || location.href;
		if(url.indexOf("?")<=-1){ url += "?";};
		var paraString = url.substring(url.indexOf("?")+1,url.length) , key = key || "", val = val || "";
		if(key=="") {return url.replace(/\?*\s*$/,"")};
		var reg = new RegExp('\\b' + key + '=[^&]*',"");
		if(reg.test(paraString) && val !=="" ){//值不为空，则替换
			paraString = paraString.replace(reg,key + "=" + val);
		}else if(reg.test(paraString) && val ==""){//值为空，则删除
			paraString = paraString.replace(reg,"");
		}else if(val!==""){//没有则添加
			paraString += "&" + key + "=" + val;
		}
		paraString = paraString.replace(/(^&*|&*$|&*(?=&))/g,"")
		return url.split("?")[0] + (paraString == "" ? "" : "?" + paraString);
	}
	if(typeof(arguments[0]) == "string"){
		return set(arguments[0],arguments[1],arguments[2]);
	}else if(typeof(arguments[0])=="object"){
		var arg = arguments[0],url = arguments[1] || location.href;
		for(aaa in arg){
			url = set(aaa,arg[aaa],url);
		};
		return url;
	}else{return location.href;}
}



}

function $browser(){//返回浏览器(name)及版本(Version)
	var Sys = new Object;
	var ua = navigator.userAgent;
	if(ua.indexOf("MSIE")>0){ /*判断IE*/
		Sys.name = "IE";
		Sys.Version= ua.match(/msie ([\d.]+)/i)[1];
	}else if(ua.indexOf("Firefox")>0){ /*判断FF*/ 
		Sys.name = "FF";
		Sys.Version= ua.match(/firefox\/([\d.]+)/i)[1];
	}else if(window.MessageEvent && !document.getBoxObjectFor){
		Sys.name="Chrome";
		Sys.Version = ua.match(/chrome\/([\d.]+)/i)[1];
	}else if(ua.indexOf("Opera")>0){
		Sys.name = "Opera"; 
		Sys.Version = ua.match(/opera.([\d.]+)/i)[1];
	}else if(ua.indexOf("Safari")>0){
		Sys.name = "Safari";
		Sys.Version = ua.match(/version\/([\d.]+)/i)[1];
	}else{
		 return {name:0,Version:0}
	};
	return Sys;
};

function $browser_(){//返回浏览器(name)及版本(Version),滤镜(lj)支持
    var Sys = new Object;
    var ua = navigator.userAgent.toLowerCase();
    if(window.ActiveXObject){ /*判断IE*/
        Sys.name = "IE";
        Sys.Version= ua.match(/msie ([\d.]+)/)[1];
    }else if(document.getBoxObjectFor){ /*判断FF*/ 
        Sys.name = "FF";
        Sys.Version= ua.match(/firefox\/([\d.]+)/)[1];
    }else if(window.MessageEvent && !document.getBoxObjectFor){
        Sys.name="Chrome"; 
        Sys.Version = ua.match(/chrome\/([\d.]+)/)[1];
    }else if(window.opera){
        Sys.name = "Opera"; 
        Sys.Version = ua.match(/opera.([\d.]+)/)[1];
    }else if(window.openDatabase){
        Sys.name = "Safari";
        Sys.Version = ua.match(/version\/([\d.]+)/)[1];
    }else{
        0;
    };
    if(Sys.name=="IE" && parseFloat(Sys.Version)<8){//滤镜支持判断
        Sys.filter=true;
    }else{
        Sys.filter=false;
    };
    return Sys;
};

function Bandin(el,type,code){//绑定事件
	if(el.addEventListener){//DOMMouseScroll
		if(type=="mousewheel"){
			if(typeof arguments.callee.browser == 'undefined') {
				var user = navigator.userAgent;
				var b = {};
				b.opera = user.indexOf("Opera") > -1 && typeof window.opera == "object";
				b.khtml = (user.indexOf("KHTML") > -1 || user.indexOf("AppleWebKit") > -1 || user.indexOf("Konqueror") > -1) && !b.opera;
				b.ie = user.indexOf("MSIE") > -1 && !b.opera;
				b.gecko = user.indexOf("Gecko") > -1 && !b.khtml;
				arguments.callee.browser = b;
			};
			type="DOMMouseScroll";
			type= arguments.callee.browser.gecko ? 'DOMMouseScroll' : 'mousewheel'
		}
		el.addEventListener(type,code,false);
	}else{
		el.attachEvent("on"+type,code);
	};
};

//捕获事件鼠标位置(相对页面可见区)(e为事件参数例document.onmousemove=function(event){var mouse_ = oMouse(event);})
function oMouse(e){
	if(!!e.pageX){//FF
		return {x:e.pageX-(document.documentElement.scrollLeft+document.body.scrollLeft), y:e.pageY-(document.documentElement.scrollTop+document.body.scrollTop)}; 
	}else{//IE
		return{x:e.clientX,y:e.clientY};
	};
};

function getfct(){//获取父窗体,(不能跨域)
	var fct;
	if(self!=top){
		return parent;
	}else if(opener!=null){
		return opener;
	}else if(dialogArguments != null){ 
		return dialogArguments;
	}else{
		return document;
		//return null;
	}
};

function HTMLEncode(html){//js巧妙利用DOM的textContent与innerHTML方法的HTMLEncode函数;
	var temp = document.createElement ("div");
	(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
	var output = temp.innerHTML;
	temp = null;
	return output;
};

function HTMLDecode(text){//js巧妙利用DOM的textContent与innerHTML方法的HTMLDecode函数;
	var temp = document.createElement("div");
	temp.innerHTML = text;
	var output = temp.innerText || temp.textContent;
	temp = null;
	return output;
};

function RemoveHTML(html) {//移除标签,空格;
	var regEx = /<[^>]*>/g;
	var temp=html.replace(regEx, "");
	temp=temp.replace(/^\s+|\s+$/g,"");
	return temp.replace("&nbsp;","");
};
//*********必要,基本方法*********

//***简单Ajax***
function getAjaxObj(){
	var xmlHttp;
	try{xmlHttp=new XMLHttpRequest();}
	catch (e){
		try	{xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");}
		catch (e){
			try{xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");}
			catch (e){
         		alert("您的浏览器不支持AJAX！");
         		return null;
			};
		};
	};
	return xmlHttp;
}

function ajax_GET(url,callback){//get请求
	var xmlHttp;
	xmlHttp=getAjaxObj();
	xmlHttp.onreadystatechange=function(){
		if(xmlHttp.readyState==4){
			callback(xmlHttp.responseText);
		};
	};
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
};

function GetNow() {//返回本机时间,格式为2009-10-13 23:40:33
    var d, s;
    d = new Date();
    s = d.getFullYear() + "-";
    s += d.getMonth() + 1 + "-";
    s += d.getDate() + " ";
    s += d.getHours() + ":";
    s += d.getMinutes() + ":";
    s += d.getSeconds();
    return (s);
};

//mongoDB的ID中获取时间信息
function ObjectIdToDate(id){
	var d = new Date(parseInt(id.substr(0,8),16)*1000);
	return d.getFullYear() + "-" +
		(d.getMonth() + 1) + "-" + 
		d.getDate() + " " +
		d.getHours() + ":" + 
		d.getMinutes() + ":" +
		d.getSeconds();
}

//数字转中文 
function numberToChlang(num,m) {
        var n = +num
            ,sn = m? num.toString() : n.toString();
        var ch = '零一二三四五六七八九'
            ,ch_u = '个十百千万亿';
        if(!m){
            if(n<10){
                return ch[n];
            }
            if(n<20){
                return ch_u[1]+ch[+sn[1]].replace(/零*$/,'');
            }
        }
        if(sn.length==1){
            return ch[n];
        }else if(sn.length<=4){
            var str = '';
            for(var i=0,n=sn.length;n--;){
                var _num = +sn[i];
                str += numberToChlang(sn[i],true) + (_num && n?ch_u[n]:'')
                i++;
            }
            str = str.replace(/零+/g,'零');
            str = str.replace(/零*$/,'')
            return str;
        }else{
            var d = sn.length/4>>0
                ,y = sn.length%4
                ,str = ''
                ,es = y || 4;
            while (y==0 || !ch_u[3+d]){
                y+=4;
                d--;
            }
            if(+sn.substr(0,y)){
                str = numberToChlang(sn.substr(0,y),true) + ch_u[3+d] + numberToChlang(sn.substr(y),true)
            }else{
                str = numberToChlang(sn.substr(0,y),true) + numberToChlang(sn.substr(y),true)
            }
            str = str.replace(/零+/g,'零');
            if(!m) {str = str.replace(/零*$/,'')}
            return str;
        }
    }


{//实际应用

	function ipToInt (ip,type){
		var REG =/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,result = REG.exec(ip);
		if(!result){return -1;}
		
		type = type || 0;
		switch (type)
		{
			case 0: //直接计算  0.0012 |  0.65
				ip = parseInt(result[1]) * 0x1000000 + parseInt(result[2]) * 0x10000 + parseInt(result[3]) * 0x100 + parseInt(result[4]);
				//ip = parseInt(result[1]) * 16777216 + parseInt(result[2]) * 65536 + parseInt(result[3]) * 256 + parseInt(result[4]);
				break;
			case 1:
				ip = (parseInt(result[1]) << 24 
					| parseInt(result[2]) << 16
					| parseInt(result[3]) << 8
					| parseInt(result[4])) >>> 0;
				break;
			case 2:	//拼接成16位字符串 0.0026 | 0.64
				var xH = "";
				for(var i=1;i<=4;i++){
					var h = parseInt(result[i]);
					xH += (h > 15 ? "" : "0") + h.toString(16);
				}
				ip = parseInt(xH,16);
				break;
			case 3:	//拼接字符串2
				var ip2 = "000000" + ((parseInt(result[2]) << 16) | (parseInt(result[3]) << 8) | parseInt(result[4])).toString(16);
				ip = parseInt(parseInt(result[1]).toString(16) + ip2.substr(ip2.length - 6),16);
				break;
			default: //代码最短
				ip = parseInt(ip.replace(/\d+\.?/ig,function(a){
					a = parseInt(a); 
					return (a > 15 ? "" : "0") + a.toString(16);
				}),16);
		}
		return ip;
	}

    function CopyValue(txt) {//拷贝字符串到剪贴板
        //window.clipboardData.setData('text', str);
        if (window.clipboardData) {
            window.clipboardData.clearData();
            window.clipboardData.setData("Text", txt);
        } else if (navigator.userAgent.indexOf("Opera") != -1) {
            window.location = txt;
        } else if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
            }
            var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
            if (!clip) return;
            var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
            if (!trans) return;
            trans.addDataFlavor('text/unicode');
            var str = new Object();
            var len = new Object();
            var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            var copytext = txt;
            str.data = copytext;
            trans.setTransferData("text/unicode", str, copytext.length * 2);
            var clipid = Components.interfaces.nsIClipboard;
            if (!clip)
                return false;
            clip.setData(trans, null, clipid.kGlobalClipboard);
            alert("复制成功！")
        }
    };

function pwd_security(a){//简单检查密码强度(返回值 -1:空; 0:极弱; 1:弱; 2:一般; 3:较强; 4:强)
	if(a==""){return -1;};//为空反回-1
	if(REsearch(/^(.?)(\1*)$|^\d{0,5}$|^.{0,3}$/,a)){
		return 0;
	}else if(REsearch(/^(\d){4,8}$|^([A-Z]{3,6}|[a-z]{3,6})$/,a)||(REsearch(/^[a-z_]+[^a-z_]|[^a-z_]+[a-z_]+$|^[A-Z_]+[^A-Z_]|[^A-Z_]+[A-Z_]+$|^[0-9]+[^0-9]|[^0-9]+[0-9]+$/,a)&&a.length<=5)){
		return 1;
	}else if((REsearch(/^[a-z_]+[^a-z_]|[^a-z_]+[a-z_]+$|^[A-Z_]+[^A-Z_]|[^A-Z_]+[A-Z_]+$|^[0-9]+[^0-9]|[^0-9]+[0-9]+$/,a)&&a.length>=12&&!REsearch(/[^\w\.]+/,a))||((a.length<=12&&a.length>=8)&&REsearch(/[^\w\.]+/,a))){
		return 3;
	}else if(REsearch(/[^\w\.]+/,a)&&a.length>=13){
		return 4;//强(13位及以上混合字符+特殊符号的字符串)
	}else{
		return 2;//一般
	};
};

function quanxuan(form,name,bool){ //全选,全不选 (表单,多选按钮组名称,状态)
	for (var i=0;i<form.elements.length;i++)
	{
		var e = form.elements[i];
		if(e.name==name){e.checked = bool;};
	};
};

function clearInfo(form){//清空表单内容
	if(!form) return;
	//var length = form.length
	for(i=0;i<form.length;i++)
	{
		 //获取类型; 
		 var type = form.elements[i].type;
		 var name = form.elements[i].name;
		 var tag = form.elements[i].tagName;
		 //针对特定类型做处理
		 if(type == "text" || type == "password" || tag=="textarea")
		 {
				form.elements[i].value = "";
		 }
		 if(type == "select")
		 {
			 //给它指定回默认值
			  form.elements[i].value = "-1";
		 }
	}
};

function Zdiv(id) {//生成ID为id遮罩层
    var zzw = document.documentElement.clientWidth > document.documentElement.scrollWidth ? document.documentElement.offsetWidth : document.documentElement.scrollWidth;
    var zzh = document.documentElement.clientHeight > document.documentElement.scrollHeight ? document.documentElement.offsetHeight : document.documentElement.scrollHeight;
    if (!document.getElementById(id)) {
        var Zdiv = document.createElement("div");
        Zdiv.id = id;
        document.body.appendChild(Zdiv);
    };
    var Zid = document.getElementById(id);
    with (Zid.style) {
        position = "absolute";
        top = "0";
        left = "0";
        backgroundColor = "#999999";
        width = "100%"; //视情况定义宽度;
        height = zzh + "px";
        filter = "Alpha(style=0,opacity=40)"; //IE6,IE7
        opacity = "0.4"; //FF,IE8,Opera;
        display = "block";
    };
};

function Zdiv_() {//生成遮罩层
    this.oDiv;
    this.inset = function (id, _color, op, ie6, show) {//重新定义并显示
		if (!document.getElementById(id)) {
            var Zdiv = document.createElement("div");
            Zdiv.id = id;
            document.body.appendChild(Zdiv);
        };
        this.oDiv = document.getElementById(id);
		var ie6 =!-[1,]&&!window.XMLHttpRequest;
		if(ie6){
			this.oDiv.style.cssText =
				 "width:expression(eval(document.documentElement.scrollLeft+document.documentElement.clientWidth));"+
				"height:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight));";
		}
        with (this.oDiv.style) {
            position = ie6 ? "absolute" : "fixed";
			backgroundColor = _color;
            filter = "Alpha(style=0,opacity=" + op + ")"; //IE6,IE7
            opacity = op / 100; //FF,IE8,Opera;
            display = show ? "block" : "none";
			zIndex = "10";
			top = "0";
			left = "0";			
            if(!ie6){

				width = "100%";
				height = "100%";
			}
        };
    };
    this.Show = function () {this.oDiv.style.display = "block";} //显示
    this.Close = function () {this.oDiv.style.display = "none";} //隐藏
};

function show_jz(id) {//居中显示指定ID的浮动元素
    var th = document.getElementById(id);
    th.style.display = "block";
    var jz_l = parseInt((document.documentElement.clientWidth - th.clientWidth) / 2 + document.documentElement.scrollLeft);
    var jz_t = parseInt((document.documentElement.clientHeight - th.clientHeight) / 2 + document.documentElement.scrollTop);
    th.style.left = jz_l > 0 ? jz_l + "px" : 0 + "px";
    th.style.top = jz_t > 0 ? jz_t + "px" : 0 + "px";
};

/***
id:对像ID
w2:最终值
type:改变的属性暂时只支持位置和大小(top,left,right,bottom,,width,height)
***/
function HDDW(id,w2,type,sd,auto,sllp) {//滑动改变值;
	var obj = document.getElementById(id);
	sd = sd>1? 1: sd;
	switch(type){
		case "top":
			var ntype = (parseInt(obj.style.top)||0);
			if(ntype==w2) return;
			obj.style.top = ntype + get_minint((w2-ntype)*sd) + "px";
			break;
		case "left":
			var ntype = (parseInt(obj.style.left)||0);
			if(ntype==w2) return;
			obj.style.left = ntype + get_minint((w2-ntype)*sd) + "px";
			break;
		case "right":
			var ntype = (parseInt(obj.style.right)||0);
			if(ntype==w2) return;
			obj.style.right = ntype + get_minint((w2-ntype)*sd) + "px";
			break;
		case "bottom":
			var ntype = (parseInt(obj.style.bottom)||0);
			if(ntype==w2) return;
			obj.style.bottom = ntype + get_minint((w2-ntype)*sd) + "px";
			break;
		case "width":
			var ntype = (parseInt(obj.style.width)||0);
			if(ntype==w2) return;
			obj.style.width = ntype + get_minint((w2-ntype)*sd) + "px";
			break;
		case "heigth":
			var ntype = (parseInt(obj.style.height)||0);
			if(ntype==w2) return;
			obj.style.height = ntype + get_minint((w2-ntype)*sd) + "px";
			break;
		default:
			alert("参数错误！");
			return;
			break;
	};
	if(auto) setTimeout(function(){HDDW(id,w2,type,sd,auto,sllp)},sllp);
}

function $ime_disabled(obj,hc){//文本框只能输入数字
	hc = hc || true;
	obj.style.imeMode = 'disabled';
	obj.onkeydown = function(e){
	    var keynum,keychar,numcheck ;
        if(window.event){
            keynum = event.keyCode;
        }else if(e.which){
            keynum = e.which;
        };
        if (keynum == 13 && hc) { return true }; //回车事件
		if((keynum >= 96 && keynum <= 105) || keynum==9 || keynum==37 || keynum==38 || keynum==39 || keynum==40 || keynum==46) return true;//小键盘数字,tabe键,方向键;
		keychar = String.fromCharCode(keynum);
		numcheck = /[\d\ch]/; //匹配数字,退格;
		return numcheck.test(keychar);
	}
	obj.onkeyup = function(e){
		this.value = this.value.replace(/[^\d]/ig,"");
	}
	obj.onmousedown = function(event){//点右键时失去焦点,防止右键粘贴.
		event =window.event||event;         
		if(event.button ==2){           
			this.blur();
			return false;
		}
	};
};

//int转IP地址
function intToIp(INT){
	if(INT < 0 || INT > 0xFFFFFFFF){
		throw ("The number is not normal!");
	}
	return (INT>>>24) + "." + (INT>>>16 & 0xFF) + "." + (INT>>>8 & 0xFF) + "." + (INT>>>0 & 0xFF);
}

//ip地址转int
function ipToInt(IP){
	var result = IP_REGEXP1.exec(IP),ip;
	if(result){
		var ip_Arr = result.slice(1);
		ip =(parseInt(ip_Arr[0]) << 24 
			| parseInt(ip_Arr[1]) << 16
			| parseInt(ip_Arr[2]) << 8
			| parseInt(ip_Arr[3])) >>> 0;
	}else if(/^\d+$/.test(IP) && (ip=parseInt(IP))>=0 && ip <= 0xFFFFFFFF ){
		return ip;
	}else{
		throw ("The IP address is not normal!");
	}
	return ip;
}

//转化制定位数的LITTLE-ENDIAN为BIG-ENDIAN
function LITTLEtoBIG(data,begin,end){
	dbug && console.log(data);
	var int_=0.0 , i=begin || 0; max = end || (data.length-1);
	for(var n = 0;n<data.length;n++){
		int_ |= (data[i++] << (8*n));
		dbug && console.log(int_.toString(16));
		if(i>max){break;}
	}
	return int_;
}

}

