$(function () {
	var bBox = top.bBox = $(".sz_box")
	var box = top.box = $('.sz_box_xy')
	var boxX = top.boxX = $('.sz_box_x')
	var boxY = top.boxY = $('.sz_box_y')
	var boxLog = $('.log')
	var option_n = 0.5;
	var auto = 0;
	//console.log(box.css('transform')); 
	var arrLog = [];

	var type = 1; //左键旋转 实现模式 0 合并旋转；1 添加辅助轴

	var transformChage = top.transformChage = function (dom, transform, left) {
		var oldt = dom.css('transform');
		//oldt = oldt == "none" ? "" : oldt;
		var t_arr = oldt == "none" ? [transform] : left ? [transform, oldt] : [oldt, transform];
		dom.css('transform', t_arr.join(" "))
	}

	function setLog(x,y){
		arrLog.push([x, y]);
		boxLog.prepend("<p>" + [x, y] + "</p>");
	}
	function resetLast(){
		return [arrLog.pop(),boxLog.find(">p:eq(0)")]
	}


	//绑定鼠标事件(旋转骰子，旋转视角)
	bBox.on('mousedown', function (e) {
		if (e.button === 0) {
			if (e.ctrlKey) {
				mouse_gunlun(e);
			} else{
				if (type === 0) {
					mouse_left_js(e);
				} else if (type === 1) {
					mouse_left_fc(e);
				}
			}
		} else if (e.button === 1) {
			mouse_gunlun(e);
		}
		return false;
	})

	function mouse_left_js(e, dom) { //即时生效模式, 滚动方向永远和鼠标一致, 暂时不能回退
		var x, y, upmark = 0;
		var zb_b = [e.pageX, e.pageY];
		var oldt = box.css('transform');
		box.removeClass('gd'); //去掉过渡效果CSS
		$(document).on('mousemove.dh', function (e) {
			var zb_e = [e.pageX, e.pageY];
			y = ((zb_e[0] - zb_b[0]) * option_n);
			x = (-(zb_e[1] - zb_b[1]) * option_n);
			var chage = 'rotateY(' + y + 'deg) rotateX(' + x + 'deg)';
			transformChage(box, chage, 1);
			zb_b = [e.pageX, e.pageY];
		}).on('mouseup.dh', function (e) {
			$(document).off('mousemove.dh');
			$(document).off('mouseup.dh');
		})
	}

	function mouse_left_qt(e) { //每次旋转，加一层嵌套, （已废弃）
		var x, y;
		var zb_b = [e.pageX, e.pageY];
		var upmark = 0;
		$(document).on('mousemove.dh', function (e) {
			var zb_e = [e.pageX, e.pageY];
			y = ((zb_e[0] - zb_b[0]) * option_n);
			x = (-(zb_e[1] - zb_b[1]) * option_n);
			boxX.css('transform', 'rotateX(' + x + 'deg)')
			boxY.css('transform', 'rotateY(' + y + 'deg)')
			upmark++;
		}).on('mouseup.dh', function (e) {
			$(document).off('mousemove.dh');
			$(document).off('mouseup.dh');
			if (!upmark) return;
			boxY.wrap('<div class="sz_box_y"><div class="sz_box_x"></div></div>')
			boxX = boxY.closest(".sz_box_x");
			boxY = boxX.closest(".sz_box_y");
			boxLog.prepend("<p>" + [x, y] + "</p>");
		})
	}

	function mouse_left_fc(e) { //分次模式, 滚动方向和开始滚动时的视角一致
		var x, y;
		var zb_b = [e.pageX, e.pageY];
		var upmark = 0;
		box.removeClass('gd'); //去掉过渡效果CSS
		$(document).on('mousemove.dh', function (e) {
			var zb_e = [e.pageX, e.pageY];
			y = ((zb_e[0] - zb_b[0]) * option_n);
			x = (-(zb_e[1] - zb_b[1]) * option_n);
			boxX.css('transform', 'rotateX(' + x + 'deg)')
			boxY.css('transform', 'rotateY(' + y + 'deg)')
			upmark++;
		}).on('mouseup.dh', function (e) {
			$(document).off('mousemove.dh');
			$(document).off('mouseup.dh');
			if (!upmark) return;
			boxX.css('transform', '')
			boxY.css('transform', '')
			var nt = ['rotateY(' + y + 'deg)', 'rotateX(' + x + 'deg)']
			transformChage(box, nt.join(' '), 1)
			setLog(x,y);
		})
	}

	function mouse_gunlun(e) {
		var x, y, upmark = 0;
		var zb_b = [e.pageX, e.pageY];
		var oldt = bBox.css('transform');
		bBox.removeClass('gd'); //去掉过渡效果CSS
		$(document).on('mousemove.dh', function (e) {
			var zb_e = [e.pageX, e.pageY];
			y = ((zb_e[0] - zb_b[0]) * option_n);
			x = (-(zb_e[1] - zb_b[1]) * option_n);
			var chage = 'rotateY(' + y + 'deg) rotateX(' + x + 'deg)';
			transformChage(bBox, chage, 1);
			zb_b = [e.pageX, e.pageY];
		}).on('mouseup.dh', function (e) {
			$(document).off('mousemove.dh');
			$(document).off('mouseup.dh');
		})
	}
	
	other();

	function other(){
		//放大缩小
		$(document).on('mousewheel', function (e) {
			//利用 font-size 放大缩小；
			var event = e.originalEvent;
			var k = event.wheelDelta > 0 ? 1 : -1;
			$('#box').css({
				"fontSize": function (i, v) {
					return parseFloat(v) + k;
				}
			})
		}).keydown(function (e) {
			//回退快捷键
			if (e.ctrlKey) {
				if (e.which === 90) {
					if (type === 1) {
						var log = resetLast();
						var arr = log[0];
						if (arr) {
							transformChage(box, 'rotateX(' + (-arr[0]) + 'deg)' + ' rotateY(' + (-arr[1]) + 'deg)',1);
							log[1].remove();
						}
					}/* else if (type === 1) {
						boxX.find(">.sz_box_y>.sz_box_x").children().unwrap().unwrap();
					} else if (type === 2) {
						var arr = arrLog.pop();
						if (arr) {
							transformChage(box, 'rotateX(' + (-arr[0]) + 'deg)' + ' rotateY(' + (-arr[1]) + 'deg)', 1);
						}
					}*/
				}
			}
		});

		function transition(dom){
			return $(dom).addClass('gd').one('transitionend',function(){
				$(dom).removeClass('gd');
			})
		}

		//重置
		$('.comm_reset').on('click', function () {
			transition(bBox).css('transform', "");
			transition(box).css('transform', "");
			arrLog = [];
			boxLog.html('');
			// if (type === 1) {
			// 	box.detach();
			// 	boxX.html('').append(box);
			// }
		})
		//重置视角
		$('.comm_reset_sj').on('click', function () {
			transition(bBox).css('transform', "");
		})
		//重置骰子
		$('.comm_reset_sz').on('click', function () {
			transition(box).css('transform', "");
			//$('.range').val(0).trigger('input');
		})
		//透视图
		$('.comm_debug').on('click', function () {
			$('body').toggleClass("debug");
		})
		//网格
		$('.comm_wg').on('click', function () {
			bBox.find('.m_box').toggleClass("wg");
			box.toggleClass("wg");
		})
		//模式切换
		$('.comm_type').on('change', function () {
			$('.comm_reset').trigger('click');
			type = $(this).val() - 0;
		}).val(type);
	}
})


