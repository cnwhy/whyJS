;(function(self,dom){
	var iframes = [];
	self.downfiles = function(){
		var files = [].slice.call(arguments,0);
		addIframe(files.length - iframes.length);
		files.forEach(function(v,i){
			iframes[i].src="";
			iframes[i].src=v;
		})
	}
	function addIframe(n){
		n = +n;
		if(n>0){
			var oFrag=document.createDocumentFragment();
			for(;n--;){
				//iframes.push($('<iframe style="display:none;">').appendTo('body'))
				var iframe = dom.createElement("iframe")

				iframe.style.display="none";
				iframes.push(iframe);
				oFrag.appendChild(iframe);
			}
			document.body.appendChild(oFrag);
		}
	}
})(window,document);