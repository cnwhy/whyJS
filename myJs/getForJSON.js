function jsonGet(json,path){
	var REG_SPL = /\.|(?=\[)/,
		REG_I = /^\[(\d+)\]$/,
		REG_KEY = /^\[(['"])(([^\\]|\\.)*?)\1\]$/

	var maps = path ? path.split(REG_SPL) : [];
	//console.log(maps);
	var n = 0;
	for(var i = 0; i<maps.length; i++){
		var key = maps[i];
		var exec;
		if(exec = REG_I.exec(key)){
			n = search.call(json,n,+exec[1]);
		}else if(exec = REG_KEY.exec(key)){
			n = search.call(json,n,exec[2]);
		}else{
			n = search.call(json,n,key);
		}
		if(n == -1) break;
	}
	if(n !== -1){
		var type_mark;
		for(;n<json.length;n++){
			var char = json.charAt(n);
			if(!/\s/.test(char)){
				type_mark = char;
				break;
			}
		}
		if(char == '"'){
			return json.substring(n,re_string.call(json,n)+1)
		}else if(char === '['){
			return json.substring(n,re_array.call(json,n)+1)
		}else if(char === '{'){
			return json.substring(n,re_json.call(json,n)+1)
		}else if(/[0-9]/.test(char)){
			return json.substring(n,re_number.call(json,n)+1)
		}else{
			return json.substring(n,re_other.call(json,n)+1)
		}
	}
	return undefined;
	//return eval("('"+json+"')");
}

function search(start,map){
	var mark;
	var type_mark;
	for(var i=start; i<this.length; i++){
		var char = this.charAt(i);
		if(!/\s/.test(char)){
			type_mark = char;
			break;
		}
	}
	if(char === '{'){
		re_json.call(this,i,function(key,last){
			if(key == map){
				mark = last;
				return true;
			}
		})
	}else if(char === '['){
		re_array.call(this,i,function(key,last){
			if(key == map){
				mark = last;
				return true;
			}
		})
	}
	return mark || -1;
}


function re_any(n){
	var type_mark;
	for(n; n<this.length; n++){
		var char = this.charAt(n);
		if(!/\s/.test(char)){
			type_mark = char;
			break;
		}
	}
	if(type_mark === '"'){
		n = re_string.call(this,n);
	}else if(type_mark === '['){
		n = re_array.call(this,n)
	}else if(type_mark === '{'){
		n = re_json.call(this,n)
	}else if(/[0-9]/.test(type_mark)){
		n = re_number.call(this,n)
	}else{
		n = re_other.call(this,n)
	}
	return n;
}

function re_string(n){
	for(var i = n+1; i<this.length; i++){
		var char = this.charAt(i);
		if(char === "\\"){
			i++;
		}else if(char == '"'){
			return i;
		}
	}
}

function re_other(n){
	var v;
	if(v = this.substr(n,4) === "true"||v === "null") return n+4;
	if(this.substr(n,5) === "false") return n+5;
	console.log(this.substr(n));
	throw new Error('json string wrong format!');
}

function re_number(n){
	for(var i = n+1; i<this.length; i++){
		var char = this.charAt(i);
		if(!/[0-9\.]/.test(char)){
			return i-1;
		}
	}
}

function re_json(n,cb){
	cb = typeof(cb) == "function" ? cb : null;
	var isKey = 0;
	var key;
	for(n++; n<this.length; n++){
		var char = this.charAt(n);
		if(/\s/.test(char)) continue;
		if(isKey === 0 || isKey === 3){
			if(char === '}') return n; //对像结束;
		}
		if(isKey === 0 || isKey === 4){
			if(char !== '"') throw new Error("JSON 格式错误,"+n+"字符期望`\"`结果为:",char);
			var on = n;
			n = re_string.call(this,n);
			key = this.substring(on+1,n);
			isKey = 1;
		}else if(isKey === 1){
			if(char !== ':') throw new Error("JSON 格式错误,"+n+"字符期望`:`结果为:",char);
			isKey = 2;
		}else if(isKey === 2){
			if(cb && cb(key,n)){
				return n;
			}
			n = re_any.call(this,n);
			isKey = 3;
		}else if(isKey ===3){
			if(char !== ',') throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",char);
			isKey = 4;
		}
	}
}
function re_array(n,cb){
	var i = 0,mark=0;
	cb = typeof(cb) == "function" ? cb : null;
	for(n++; n<this.length; n++){
		var char = this.charAt(n);
		if(/\s/.test(char)) continue;
		if(mark === 0 || mark === 1){
			if(char === ']')return n; //数组结束;
		}

		if(mark === 0 || mark === 2){
			//if(char === ',') throw new Error("JSON 格式错误,"+n+"字符不应为`,`");
			if(cb && cb(i,n)){
				return n;
			}
			n = re_any.call(this,n);
			mark = 1;
		}else if(mark === 1){
			if(char !== ',') throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",char);
			mark = 2;
			i++;
		}


		// if(/[\s\,]/.test(char)){
		// 	continue;
		// }
		// if(cb && cb(i,n)){
		// 	return n;
		// }
		// if(char === '"'){
		// 	n = re_string.call(this,n);
		// }else if(char === '['){
		// 	n = re_array.call(this,n)
		// }else if(char === '{'){
		// 	n = re_json.call(this,n)
		// }else if(/[0-9]/.test(char)){
		// 	n = re_number.call(this,n)
		// }else{
		// 	n = re_other.call(this,n)
		// }
		// n = re_any.call(this,n);
		// i++;
		
	}
}

var fs = require('fs');
var str1 = fs.readFileSync('./package.json').toString();
//console.log(str1.toString());
//console.log(jsonGet('{"a":{}}',"a"));
var max = 100000;
var t1 = Date.now();
for(var i=0; i<max; i++){
	jsonGet(str1,"");
}
console.log('jsonGet',Date.now()-t1)
var t2 = Date.now();
for(var k=0; k<max; k++){
	JSON.parse(str1);
	// jsonGet(str1,"devDependencies");
}
console.log("JSON",Date.now()-t2)


// console.log(jsonGet(str1));
// var str = jsonGet(str1,"scripts.test");
// console.log(str);
