// localStorage 超限问题处理
// 拦截特殊规则 

let __localStorageMap__ = new Map();

function isImgB64(key){
  if(key.indexOf("data:image/") === 0 && key.length > 15){
    console.warn('为防止localStorage超限，已禁止key为data:image/开头的图像存入。')
    return true
  }
  return false
}

let ols = window.localStorage;
ols.setItem = new Proxy(ols.setItem, {
  apply: function(target, thisArg, argumentsList) {
    let [key, val] = argumentsList;
    console.log("[loSet]", key);
    if (isImgB64(key)) {
      // __localStorageMap__.set(key, val.toString());
      return;
    }
    if (key.indexOf("_AMap_") === 0) {
      __localStorageMap__.set(key, val.toString());
      return;
    }
    try {
      Reflect.apply(target, ols, argumentsList);
      return;
    } catch (err) {
      if (err.message.indexOf("exceeded the quota") != -1) {
        console.log("[loSetQuota]", "超过配额 ", key);
        __localStorageMap__.set(key, val.toString());
      }
    }
  }
});
ols.getItem = new Proxy(ols.getItem, {
  apply: function(target, thisArg, argumentsList) {
    let [key] = argumentsList;
    // console.log("[loGet]", key);
    // if(key.indexOf('_AMap_') === 0) {
    //   return Reflect.apply(target, thisArg, argumentsList) || __localStorageMap__.get(key);
    // }

    return (
      Reflect.apply(target, ols, argumentsList) || __localStorageMap__.get(key) || null
    );
  }
});
ols.removeItem = new Proxy(ols.removeItem, {
  apply: function(target, thisArg, argumentsList) {
    let [key] = argumentsList;
    __localStorageMap__.delete(key);
    return Reflect.apply(target, ols, argumentsList);
  }
});
ols.clear = new Proxy(ols.clear, {
  apply: function(target, thisArg, argumentsList) {
    __localStorageMap__.clear();
    return Reflect.apply(target, ols, argumentsList);
  }
});
let ls = new Proxy(window.localStorage, {
  set: function(target, key, val) {
    console.log("[loAttr]", key);
    if (isImgB64(key)) {
      return __localStorageMap__.set(key, val.toString());
    }
    return Reflect.set(target, key, val);
  },
  get: function(target, key){
    if (isImgB64(key)) {
      return __localStorageMap__.get(key);
    }
    return Reflect.get(target, key);
  }
});
Object.defineProperties(window,{
  'localStorage': {
    writable: false,
    value: ls
  }
})
