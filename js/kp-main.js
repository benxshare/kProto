// JavaScript Document
(function(e){
var __hasProp = {}.hasOwnProperty;
var g = {
	'maps': function(s){
		var m = {
			'$in': 'slideIn',
			'$out': 'slideOut',
			'o_o': 'sleep',
			'_pop': 'popup',
			'_': 'popdown',
			'slideIn': 'slideIn',
			'slideOut': 'slideOut',
			'sleep': 'sleep',
			'popdown': 'popdown',
			'popup': 'popup'
		};
		
		return  m[s];
	},
	'sliceActions': function(s){
		//action string
		//func: argument0,arguiment1;func2:2000,[func3:argument0,argument1]...
		if(typeof s != "string"){
			return;
		}
		var cmds = s.split(";"), cmd;
		var index = 0, rl = cmds.length;;
		var delay = 0;
		var timer = null;
		var loopExec = function(){
			if(index>=rl){
				window.clearInterval(timer);
			};
			cmd = cmds[index];
			if(typeof cmd == "string"){
				if(cmd.match(/o_o|sleep/g) != null){
					window.clearInterval(timer);
					delay =parseInt(cmds[index].split(":")[1], 10);
					
					var tc = window.setTimeout(function(){			
						index++;
						timer = window.setInterval(loopExec,0);						
					}, delay);
				}else{
					g.execCmd(cmds[index]);
					index++;
				}
			};
		};
		timer = window.setInterval(loopExec,0);
	},
	'execCmd': function(s){
		if(typeof s != "string" || s == ""){
			return;
		}
		s = s.replace(/\s+/g, "");
		var an = s.split(":");
		var func = g.maps(an[0]);
		var args = an[1].split(",");
		
		if(typeof g[func] == "function"){
			g[func](args);
		}
	},
	'slideIn': function(args){
		//args: [#selector, dir, duration]
		var o = args[0];
		var from = args[1] || "left";
		var duration = args[2];
		
		var ow = $(o).width(), ch = $(".kp-card").height(), oh = $(o).height();
		var startX, endX, startY, endY;
		
		switch(from){
			case "left":
				startX = -ow, endX = 0;
				startY = 0, endY = 0;
				duration = duration || 200;
			break;
			case "right":
				startX = ow, endX = 0;
				startY = 0, endY = 0;
				duration = duration || 200;		
			break;
			case "top":
				startX = 0, endX = 0;
				startY = -oh, endY = 0;
				duration = duration || 400;
				break;
			case "bottom":
				startX = 0, endX = 0;
				startY = ch, endY = ch - oh;
				duration = duration || 400;
				break;
			default:
			return;
		}
		
		if(typeof o == "string"){
			$(o).addClass("show");
			$(o).css({
				left: startX,
				top:startY,
				zIndex: 2
			});
			$(o).animate({
				left: endX,
				top: endY
			}, duration);
		}

	},
	'slideOut': function(args){
		var o = args[0];
		var dir = args[1];
		var duration = args[2] || 600;

		var ow = $(o).width(), oh = $(o).height(), 
			cw = $(".kp-card").width(),ch = $(".kp-card").height();
		switch(dir){
			case "left":
			endX = -cw, endY = 0;
			break;
			case "right":
			endX = cw, endY = 0;
			break;
			case "up":
			endX = 0, endY = -ch;
			break;
			case "down":
			endX = 0, endY = ch;
			break;
		}
			$(o).css({
				left: 0,
				top: 0,
				zIndex: 1
			});
			$(o).animate({
				left: endX,
				top: endY
			}, duration, null, function(){
				$(this).removeClass("show");
			});
	},
	'popup': function(args){
		var o = args[0];
		var duration = parseInt(args[1], 10) || 500;
		var ow = $(o).width(), oh = $(o).height(),
		cw = $(".kp-card").width(), ch=$(".kp-card").height();
		$(o).addClass("show");
		$(o).css({
			opacity: 0,
			width:0,
			height:0,
			top: ch * 0.5,
			left: cw * 0.5,
			zIndex: 9
		});
		$(o).animate({
			width: ow,
			height: oh,
			top:0,
			left:0,
			opacity: 1
		},duration);
	},

	'popdown': function(args){
		var o = args[0];
		var duration = parseInt(args[1], 10) || 500;
		var ow = $(o).width(), oh = $(o).height(),
		cw = $(".kp-card").width(), ch=$(".kp-card").height();
		$(o).css({
		opacity: 1,
		width:ow,
		height:oh,
		top: 0,
		left: 0
		});
		$(o).animate({
			width: 0,
			height: 0,
			top:ch*0.5,
			left:cw*0.5,
			opacity: 0
		},duration, null, function(){
			$(this).removeClass("show");
			$(this).css({
				width: ow,
				height: oh,
				opacity: 1,
				top: 0,
				left: 0
			});
		});
	}
};

e.kpApps = g;
 
})(window);

$(document).ready(function(e) {
	var $kp = window.kpApps;
	//绑定按钮事件；	
	$(".kp-lnk-agent, .kp-cell, .kp-btn").click(function(){
		
		$kp.sliceActions($(this).attr("action"));
	});
	
	try{
		window.top.$("#homeButton").click(function(){
			$kp.sliceActions("popdown:.show;");
			$kp.clearTimers();
		});
	}catch(e){
	}
});