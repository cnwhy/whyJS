"use strict";
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

function jsonGet(json,paths){
	var n = 0;
	var maps = [];
	if(Array.isArray(paths)){
		paths.forEach(function(v){
			maps.push({
				map:getMap(v),
				val:undefined
			});
		})
	}else{
		maps.push({
			map:getMap(paths),
			val:undefined
		});
	}
	re_any(json,n,maps.slice(0));
	var reval = [];
	if(Array.isArray(paths)){
		maps.forEach(function(v){
			reval.push(v.val)
		})
		return reval;
	}else{
		return maps[0].val;
	}
}

function fn_filterKey(maps){
	if(!maps || maps.length <=0) return function(){return {maps:null,mark:0};}
	var M = [],mark = 0;
	function sM(key){
		for(var i=M.length; i--;){
			var m = M[i];
			if(m.key == key) return m;
		}
	}
	maps.forEach(function(map){
		var key = map.map[0];
		var vM = sM(key);
		if(vM){
			vM.val.push(map);
		}else{
			mark++;
			M.push({key:key,val:[map]})
			// M[key] = [map]
		}
	})
	return function(key){
		var obj = sM(key);
		if(obj){
			obj.val.forEach(function(v){
				v.map.shift();
			})
			mark--;
			return {maps:obj.val,mark:mark};
		}else{
			return {maps:null,mark:mark};
		}
	}
}

function re_any(json,n,maps,p){
	//maps = maps ? maps.slice(0) : maps;
	var maps_nonext;
	if(maps && maps.length >0){
		maps_nonext = [];
		for(var i=0; i<maps.length;){
			var map = maps[i];
			if(map.map.length === 0){
				maps_nonext.push(map)
				maps.splice(i,1);
			}else{
				i++;
			}
		}
	}
	var ismap = maps && maps.length >0;
	var isnomext = maps_nonext && maps_nonext.length > 0;

	if(maps && !ismap && !isnomext){
		return -1;
	}

	var type_mark;
	for(n; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(!isk(char)){
			type_mark = char;
			break;
		}
	}

	var nonext = (function(on){
		if(!isnomext) return function(){};
		return function(n){
			var str = json.substring(on,n+1);
			var val = eval('('+str+')');
			// var val = JSON.parse(str);
			maps_nonext.forEach(function(v){
				v.val = val;
			})
		}
	})(n)
	var on = n;
	if(type_mark === CODE_S){
		n = re_string(json,n);
	}else if(type_mark === CODE_A_S){
		n = re_array(json,n,maps,p || isnomext)
		// n = re_array(json,n,maps)
	}else if(type_mark === CODE_O_S){
		n = re_json(json,n,maps,p || isnomext)
		// n = re_json(json,n,maps)
	}else if(isn(type_mark)){
		n = re_number(json,n)
	}else{
		n = re_other(json,n)
	}
	nonext(n);
	// global.MK += 1;
	return n;
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

function re_json(json,n,maps,p){
	var mark = 0,key;
	var isMap = maps && maps.length > 0;
	var filterKey = fn_filterKey(maps);
	for(n++; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(isk(char)) continue;
		if(mark === 0 || mark === 3){
			if(char === CODE_O_E) return n; //对像结束;
		}
		if(mark === 0 || mark === 4){
			if(char !== CODE_S) throw new Error("JSON 格式错误,"+n+"字符期望`\"`结果为:",String.fromCharCode(char));
			var on = n;
			n = re_string(json,n);
			key = json.substring(on+1,n);
			mark = 1;
		}else if(mark === 1){
			if(char !== CODE_M) throw new Error("JSON 格式错误,"+n+"字符期望`:`结果为:",String.fromCharCode(char));
			mark = 2;
		}else if(mark === 2){
			// var _maps = filterKey(key);
			var _obj = filterKey(key);
			n = re_any(json,n,_obj.maps,p || _obj.mark);
			if(!_obj.mark && !p) return;
			mark = 3;
		}else if(mark === 3){
			if(char !== CODE_SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",String.fromCharCode(char));
			mark = 4;
		}
	}
}

function re_array(json,n,maps,p){
	var i = 0,mark=0;
	var filterKey = fn_filterKey(maps);
	for(n++; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(isk(char)) continue;
		if(mark === 0 || mark === 1){
			if(char === CODE_A_E) return n; //数组结束;
		}
		if(mark === 0 || mark === 2){
			var _obj = filterKey(i);
			n = re_any(json,n,_obj.maps,p || _obj.mark);
			if(!_obj.mark && !p) return;
			mark = 1;
		}else if(mark === 1){
			if(char !== CODE_SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",char);
			mark = 2;
			i++;
		}
	}
}
module.exports = jsonGet;
