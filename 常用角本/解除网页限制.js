(function(){
	var attrs = ['contextmenu','selectstart','contextmenu','selectstart','copy']
	try{
		$(document).off(attrs.join(' '));
		$('body').off(attrs.join(' '));
	}catch(e){}
	try{
		var doms = [document,document.documentElement,document.body];
		var a = document.detachEvent,b = document.removeEventListener;
		for(var i in doms){
			var o = doms[i];
			for(var k=0;k<attrs.length;k++){
				var e = attrs[k];
				o['on'+e] = null;
				a && doms[i].detachEvent('on'+e);
				b && doms[i].removeEventListener(e);
			}
		}
	}catch(e){}
})();