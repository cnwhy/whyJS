// var DEBUG = false;
function isk(code){
	// DEBUG && console.log(code,':',String.fromCharCode(code));
	if(code == 32 || (code <= 13 && code >= 9)) return true;
	// if(code <= 13 && code >= 9) return true;
	return false;
}

function is0to9(code){
	return (code >= 48 && code <= 57);
}

function isn(code){
	return (code >= 45 && code <= 57);
}

var CODE_S = 34 // "
	,CODE_S_D = 39 // '
	,CODE_A_S = 91 // [
	,CODE_A_E = 93 // ]
	,CODE_O_S = 123 // {
	,CODE_O_E = 125 // }
	,CODE_SP = 44 // ,
	,CODE_XG = 92 // \
	,CODE_M = 58 // :
	,CODE_D = 46 // .

function getMap_old(path){
	// var REG_SPL = /\.|(?=\[)/,
	var REG_SPL = /["']?\]\[["']?|\.\[["']?|["']?\]\.|\.|\[["']?|["']?\]/,
		REG_I = /^\[(\d+)\]$/,
		REG_KEY = /^\[(['"])(([^\\]|\\.)*?)\1\]$/
	var maps = path ? path.split(REG_SPL) : [];
	if(maps[0] == "") maps.sift();
	if(maps[maps.length-1] == "") maps.pop();
	return maps;
	// // DEBUG && console.log(maps);
	// for(var i = 0; i<maps.length; i++){
	// 	var key = maps[i];
	// 	var exec;
	// 	if(exec = REG_I.exec(key)){
	// 		n = search(json,n,+exec[1]);
	// 	}else if(exec = REG_KEY.exec(key)){
	// 		n = search(json,n,exec[2]);
	// 	}else{
	// 		n = search(json,n,key);
	// 	}
	// 	if(n == -1) break;
	// }
}

function getMap(path){
	var maps = [];
	if(!path) return maps;
	function getsp(n,cb){
		for(n;n<path.length;n++){
			var char = path.charCodeAt(n);
			if(char === CODE_D || char === CODE_A_S) return n-1;
		}
		return n-1;
	}
	var S=0;
	for(var i=0; i<path.length; i++){
		var char = path.charCodeAt(i);
		if(S === 0){
			if(char === CODE_D) throw Error("path wrong format!");
		}
		if(S === 0 || S === 2){
			if(char === CODE_A_S){
				var oi = ++i;
				char = path.charCodeAt(i);
				if(char === CODE_S || char === CODE_S_D){
					i = re_string(path,i,char);
					maps.push(path.substring(oi+1,i));
				}else if(is0to9(char)){
					i = re_number(path,i);
					maps.push(+path.substring(oi,i+1));
				}else{
					throw new Error("path wrong format!");
				}
				S = 1;
				continue;
			}else if(char === CODE_D){
				var oi = ++i;
				i = getsp(i);
				maps.push(path.substring(oi,i+1));
				S = 2;
				continue;
			}
		}
		if(S === 0){
			var oi = i;
			i = getsp(i);
			maps.push(path.substring(oi,i+1));
			S = 2;
		}
		if(S === 1){
			if(char === CODE_A_E){
				S = 2
			}
		}
	}
	return maps;
}


function jsonGet(json,path){
	var n = 0;
	//var maps = path.split(".");
	var maps = getMap(path);
	// var maps = getMap_old(path);
	// console.log(maps);
	// DEBUG && console.log(maps);
	for(var i = 0; i<maps.length; i++){
		var key = maps[i];
		n = search(json,n,key);
		if(n == -1) return undefined;
	}
	return value_any(json,n);

	// if(n !== -1){
	// 	// var type_mark;
	// 	// for(;n<json.length;n++){
	// 	// 	var char = json.charCodeAt(n);
	// 	// 	if(!isk(char)){
	// 	// 		type_mark = char;
	// 	// 		break;
	// 	// 	}
	// 	// }
	// 	// var on = n;
	// 	// n = re_any(json,n)
	// 	// return json.substring(on,n+1);
	// 	 return value_any(json,n);
	// }
	// return undefined;
	//return eval("('"+json+"')");
}

function search(json,start,map){
	var mark;
	var type_mark;
	for(var i=start; i<json.length; i++){
		var char = json.charCodeAt(i);
		if(!isk(char)){
			type_mark = char;
			break;
		}
	}
	if(char === CODE_O_S){
		re_json(json,i,function(key,last){
			if(key == map){
				mark = last;
				return true;
			}
		})
	}else if(char === CODE_A_S){
		re_array(json,i,function(key,last){
			if(key == map){
				mark = last;
				return true;
			}
		})
	}
	return mark || -1;
}

function re_any(json,n){
	var type_mark;
	for(n; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(!isk(char)){
			type_mark = char;
			break;
		}
	}
	if(type_mark === CODE_S){
		n = re_string(json,n);
	}else if(type_mark === CODE_A_S){
		n = re_array(json,n)
	}else if(type_mark === CODE_O_S){
		n = re_json(json,n)
	}else if(isn(type_mark)){
		n = re_number(json,n)
	}else{
		n = re_other(json,n)
	}
	return n;
}

function value_any(json,n){
	return eval('('+json.substring(n,re_any(json,n)+1)+')')
}

function re_string(json,n,sp){
	sp = sp || CODE_S;
	for(var i = n+1; i<json.length; i++){
		var char = json.charCodeAt(i);
		if(char === CODE_XG){
			i++;
		}else if(char === sp){
			return i;
		}
	}
}

function re_other(json,n){
	var v,k;
	if((v = json.substr(n,4)) === "true" || v === "null") return n+3;
	if((k = json.substr(n,5)) === "false") return n+4;
	// DEBUG && console.log(json.substr(n));
	//console.log(v,k);
	throw new Error('json string wrong format! at ',n.toString());
}

function re_number(json,n){
	var mark_f,mark_s,mark_d;
	for(var i = n+1; i<json.length; i++){
		var char = json.charCodeAt(i);
		if(!isn(char)) return i-1;
	}
}

function re_json(json,n,cb){
	cb = typeof(cb) == "function" ? cb : null;
	var isKey = 0;
	var key;
	for(n++; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(isk(char)) continue;
		if(isKey === 0 || isKey === 3){
			if(char === CODE_O_E) return n; //对像结束;
		}
		if(isKey === 0 || isKey === 4){
			if(char !== CODE_S) throw new Error("JSON 格式错误,"+n+"字符期望`\"`结果为:",String.fromCharCode(char));
			var on = n;
			n = re_string(json,n);
			key = json.substring(on+1,n);
			isKey = 1;
		}else if(isKey === 1){
			if(char !== CODE_M) throw new Error("JSON 格式错误,"+n+"字符期望`:`结果为:",String.fromCharCode(char));
			isKey = 2;
		}else if(isKey === 2){
			if(cb && cb(key,n)){
				return n;
			}
			n = re_any(json,n);
			isKey = 3;
		}else if(isKey === 3){
			if(char !== CODE_SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",String.fromCharCode(char));
			isKey = 4;
		}
	}
}
function re_array(json,n,cb){
	var i = 0,mark=0;
	cb = typeof(cb) == "function" ? cb : null;
	for(n++; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(isk(char)) continue;
		if(mark === 0 || mark === 1){
			if(char === CODE_A_E)return n; //数组结束;
		}
		if(mark === 0 || mark === 2){
			if(cb && cb(i,n)){
				return n;
			}
			n = re_any(json,n);
			mark = 1;
		}else if(mark === 1){
			if(char !== CODE_SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",char);
			mark = 2;
			i++;
		}
	}
}
module.exports = jsonGet;
