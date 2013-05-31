var dialog = (function() {
	var get = {
		byId: function(id) {
			return document.getElementById(id);
		},
		byClass: function(className, parent) {
			var temp = [],
				partten = RegExp("(^|)" + className + "(|$)"),
				ele = this.byTagName("*", parent);
			for (var i = 0, length = ele.length; i < length; i += 1) {
				partten.test(ele[i].className) && temp.push(ele[i]);
			}
			return temp;
		},
		byTagName: function(ele, parent) {
			return (ele || parent).getElementByTagName(ele);
		}
	};
	/**
	 *在IE中,事件处理函数的contextual(上下文)对象,this都是指向window,与对象和事件无关
	 *
	 */
	var eventUtil = {
		addHandler: function(ele, eventName, eventHandler) {
			if (ele.addEventListener) {
				ele.addEventListener(eventName, eventHandler, false);
			} else {
				ele["_" + eventName + eventHandler] = eventHandler;
				ele[eventName + eventHandler] = function() {
					ele["_" + eventName + eventHandler]();
				};
				ele.attachEvent("on" + eventName, ele[eventName + eventHandler]);
			}
			//ele.addEventListener ? ele.addEventListener(eventName, eventHandler, false) : ele.attachEvent("on" + eventName, function(){eventHandler.call(ele)});
		},
		removeHandler: function(ele, eventName, eventHandler) {
			ele.removeEventListener ? ele.removeEventListener(eventName, eventHandler, false) : ele.detachEvent("on" + eventName, ele[eventName + eventHandler]);
		},
		getEvent: function(event) {
			return event ? Event : window.event;
		},
		getTarget: function(event) {
			return event.target || event.srcElement;
		},
		preventDefault: function(event) {
			event.preventDefault ? event.preventDefault() : (event.returnValue = false);
		},
		stopPropagation: function(event) {
			event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
		}
	};
	var css = function(obj, attr, value) {
		switch (arguments.length) {
			case 2:
				if (typeof arguments[1] == "object") {
					for (var i in attr) i == "opacity" ? (obj.style["filter"] = "alpha(opacity=" + attr[i] + ")", obj.style[i] = attr[i] / 100) : obj.style[i] = attr[i];
				} else {
					return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
				}
				break;
			case 3:
				attr == "opacity" ? (obj.style["filter"] = "alpha(opacity=" + value + ")", obj.style[attr] = value / 100) : obj.style[attr] = value;
				break;
		}
	};
	var  getScroll = function(){
		var scroll = {};
		if (document.documentElement && document.documentElement.scrollTop) {
			scroll.top = document.documentElement.scrollTop;
			scroll.left = document.documentElement.scrollLeft;
			scroll.width = document.documentElement.scrollWidth;
			scroll.height = document.documentElement.scrollHeight;
		} else if (document.body) {
			scroll.top = document.body.scrollTop;
			scroll.left = document.body.scrollLeft;
			scroll.width = document.body.scrollWidth;
			scroll.height = document.body.scrollHeight;
		}
		return scroll;
	}
	/**
	 *将字符串转为dom对象,返回的对象不支持appendChild方法
	 */
	var parseDemo = function(str) {
		var temp = document.createElement("div"),
			element;
		temp.innerHTML = str;
		temp = temp.childNodes[0];
		temp.appendchild = document.appendchild;
		return temp;
	};
	/*

	//str只局限于传入<div></div>不能传入嵌套的，类似于<div><h2></h2></div>	
	parseDemo  = function(str){
		var partten = /([^\s+]+)=('|")(.*?)('|")/g,
			tagPartten =/(\w+)/,
		     tag = document.createElement(str.match(tagPartten)[0]),
		     attributes = str.match(partten),
		     length = attributes.length,
		      i=0,
		     temp;
		for(;i<length;i+=1){
			temp = attributes[i].split('=');
			tag.setAttribute(temp[0],temp[1].replace(/("|')/g,""));
		}
		return tag;
	};
	*/
	/**
	 *createDialog:参数说明
	 * dialog: 对话层Id
	 * dialog_head: dialog的标题 Id
	 * dialog_headTxt: 标题
	 * dialog_close: 关闭按钮id
	 * dialog_btnYes: 确定按钮
	 * diallog_btnNo: 取消按钮
	 */

	
	return {
		events: {
			dialogHead: {
				"mousedown": null
			},
			'document': {
				"mousemove": null,
				"mousemove": null
			},
			closBtn: {}
		},
		initState: false,
		init: function(args, callBack) {
			args = args || {};
			this.dialogHead.innerHTML += args.headTxt || "提示";
			this.dialog.style.width = args.width || "400px";
			this.dialog.style.height = args.height || "120px";
			if(args.length>0){
				for(var i in args[0]){
					this.dialog.style[i] = args[0][i];
				}
			}
			this.dialog.style.top = ((document.documentElement.clientHeight + parseInt(getScroll().top) - parseInt(this.dialog.style.height)) / 2) + "px";
			this.dialog.style.left = ((document.documentElement.clientWidth + parseInt(getScroll().left) - parseInt(this.dialog.style.width)) / 2) + "px";
			callBack && typeof callBack=="function" &&  callBack();//回调方法
		},
		//args, callBack
		createDialog: function() {
			var args =Array.prototype.slice.call(arguments),
				callBack = args.pop();
			if (this.initState) {
				return this.init(args,callBack);
			} else {
				this.initState = true;
			}
			this.dialog = parseDemo("<div class='dialog' ></div>");
			this.dialogHead = this.dialog.appendChild(parseDemo("<div class='dialog-head'></div>"));
			this.dialogClosBtn = this.dialogHead.appendChild(parseDemo("<span id='icon-close' class='icon-close'></span>"));
			this.dialogBody = this.dialog.appendChild(parseDemo("<div class='dialog-body'></div>"));
			this.dialogFooter = this.dialog.appendChild(parseDemo("<div class='dialog-footer'></div>"));
			//this.dialogBtnYes = this.dialogFooter.appendChild(parseDemo("<span class='button-common button-outer dialog-yes' title='确定'>" + "<input type='button' value='确定' class='button-common key-button' /></span>"));
			//this.dialogBtnNo = this.dialogFooter.appendChild(parseDemo("<span class='button-common button-outer dialog-no'  title='取消'>" + "<input type='button' value='取消' class='button-common key-button' /></span>"));

			this.init(args,callBack);


			document.body.appendChild(this.dialog);

			//窗口改变大笑道饿时候触发
			window.onresize = function() {
				self.dialog.style.top = ((document.documentElement.clientHeight + parseInt(getScroll().top) - parseInt(self.dialog.style.height)) / 2) + "px";
				self.dialog.style.left = ((document.documentElement.clientWidth + parseInt(getScroll().left) - parseInt(self.dialog.style.width)) / 2) + "px";
			};
			/**
			 *鼠标按下,激活拖拽
			 *
			 */
			var move = false,
				screenX = 0,
				screenY = 0,
				self = this,
				clientWidth = document.documentElement.clientWidth,
				clientHeight = document.documentElement.clientHeight;


			this.events.dialogHead.mousedown = function(eve) {
				eve = eve || window.event;
				move = true;
				screenX = eve.clientX - self.dialog.offsetLeft;
				screenY = eve.clientY - self.dialog.offsetTop;


				return false;
			};
			this.events["document"].mousemove = function(eve) {
				if (!move) return;
				eve = eve || window.event;
				var left = eve.clientX - screenX,
					top = eve.clientY - screenY,
					maxLeft = clientWidth - self.dialog.offsetWidth,
					maxTop = clientHeight - self.dialog.offsetHeight,
					style;

				left = left < 0 ? 0 : left;
				left = left > maxLeft ? maxLeft : left;

				top = top < 0 ? 0 : top;
				top = top > maxTop ? maxTop : top;
				style = self.dialog.style;

				style.left = left + "px";
				style.top = top + "px";

				return false;
			};
			//当对象失去鼠标捕捉时触发。
			this.events["document"].mouseup = function() {
				move = false;
			};
			this.events["closBtn"].click = function() {
				self.distory();
			};
			//this.dialogClosBtn事件绑定不了，只能重新获取节点
			this.dialogClosBtn = document.getElementById("icon-close");

			eventUtil.addHandler(this.dialogHead, "mousedown", this.events.dialogHead.mousedown);
			eventUtil.addHandler(document, "mousemove", this.events["document"].mousemove);
			eventUtil.addHandler(document, "mouseup", this.events["document"].mouseup);
			eventUtil.addHandler(window, "blur", this.events["document"].mouseup);
			eventUtil.addHandler(this.dialogHead, "losecapture", this.events["document"].mouseup);
			eventUtil.addHandler(this.dialogClosBtn, "click", this.events["closBtn"].click);
		},
		distory: function() {
			/*
			eventUtil.removeHandler(this.dialogHead, "mousedown", this.events.dialogHead.mousedown);
			eventUtil.removeHandler(document, "mousemove", this.events["document"].mousemove);
			eventUtil.removeHandler(document, "mouseup", this.events["document"].mouseup);
			eventUtil.removeHandler(window, "blur", this.events["document"].mouseup);
			eventUtil.removeHandler(this.dialogHead, "losecapture", this.events["document"].mouseup);
			eventUtil.removeHandler(this.dialogClosBtn, "click", this.events["closBtn"].click);
			*/
			this.dialog.style.display = "none";
		}

	};
})();


/*

(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
 //pull the access token out of the query string
  var ql = [];
  if (window.location.hash) {
    // split up the query string and store in an associative array
    var params = window.location.hash.slice(1).split("#");
    var tmp = params[0].split("&");
    for (var i = 0; i < tmp.length; i++) {
      var vals = tmp[i].split("=");
      ql[vals[0]] = unescape(vals[1]);
    }
  }

  */