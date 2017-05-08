(function (name, factory) {
	if (typeof define === 'function' && (define.amd || define.cmd)) {
		define([], factory);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		global[name] = factory();
	} else {
		throw new Error("加载 " + name + " 模块失败！，请检查您的环境！")
	}
}('pageNav', function () {
	var lang = {
            Prev: '&lt;',
            Next: '&gt;',
			first: '&lt;&lt;',
			last: '&gt;&gt;',
            more: '...',
            gopage: 'go'
        }
	/*
	%totalItem% 数据总数
	%page%		当前页
	%maxPage%	总页数
	%pageSize%	每页数据条数
	%jumpPageHTML% 跳转html
	%pageHTML%  页码HTML
	*/
	var definedFomat = '共<em>%totalItem%</em>条数据 当前 <em>%page%</em>/%maxPage% 页 每页 %size% 条 %pageHTML% %jumpPageHTML%'

	definedConfig = {
		type: 'normal',  // all , min
		extendPage: 5,
		moreMark: true,
		autohide: true,
		sizeSelect: [10,20,50],
		minPageOne: false,
		//翻页
		onChangePage : null,
		//修改每页记录数
		onChangeSize : null,
		urlFomat: "?page=%page%"
	}

	function pageNav(box,data,config){
		if(typeof(box) == 'string') this.box = document.getElementById(box)
		else this.box = box;
		this._odata = data;
		this.init(data);
		this._con = {}
		for(var k in definedConfig){
			this._con[k] = config[k] == undefined ?  definedConfig[k] : config[k];
		}
	}

	pageNav.prototype={
		init : function(data){
			this.minPage = this.config.minPageOne ? 1 : 0;
			this.page = data.page == null ? this.minPage : data.page;
			this.size = data.size;
			this.maxPage = data.maxPage;
			this.totalItem = data.totalItem;
			if(this.maxPage == null){
				if(this.size == null || this.size == 0 || this.totalItem == null){
					throw new Error("parameter error : The maxPage can not be calculated")
				}else{
					this.maxPage = Math.ceil(this.totalItem/this.size)
				}
			}
		},
		reset: function(data){

		},
		getHTML: function(){
			var map = {
				'%totalItem%':this.totalItem,
				'%page%':this.page,
				'%maxPage%':this.maxPage,
				'%pageSize%':this.size,
				'%jumpPageHTML%':this.getHTML_jump(),
				'%pageHTML%':this.getHTML_page()
			};
			var html = 
			for(var arg in map){
				
			}
		},
		getHTML_page: function(){
			
		},
		getHTML_jump: function(){
		
		}
	}

	return pageNav;
})

/*
	<div>
		<span class="pagenav_text">
		<span>
		<ul class="pagenav_ul">
		</ul>
		<form class="pagenav_goform">
			<input type="number" class="pagenav-goinput" name="page" value="' + q.page + '" />
			<button type="submit" class="pagenav-gobtn ' + (q.classNames.gobtn || '') + '">' + q.lang.gotxt + '</button>
		</form>
	</div>
 */