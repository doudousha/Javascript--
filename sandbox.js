
Sandbox.moudles = {};
function Sandbox(){

	var args = Array.prototype.slice.call(arguments),
	 	callBack = args.pop(),
	 	moudles = (args[0] && typeof args[0]==="string") ? args : args[0],
	 	i;

	 	/**
	 	  *确保该函数作为构造函数调用
	 	  */
	 	if(!(this instanceof Sandbox)){
	 		return new Sandbox(moudles,callBack);
	 	}	
	 	/**
	 	  *现在向该核心'this'对象添加模块,不指定模块名称或指定"*"都表示"使用所有模块"
	 	  *
	 	  */

	 	if(!(moudles || moudles =="*")){
	 		moudles = [];
	 		for(i in Sandbox.moudles){
	 			if(Sandbox.moudles.hasOwnProperty(i)){
	 				moudles.push(i);
	 			}
	 		}
	 	}

	 	/**
	 	  *初始化所需的模块,把所有模块作为属性添加到this
	 	  */
	 	for(i=0;i<moudles.length;i+=1){
	 		Sandbox.moudles[moudles[i]](this);
	 	}

	 	callBack(this);
}

Sandbox.prototype = {
	name:"My Application",
	version:"1.0",
	getName:function(){
		return this.name;
	}
};

/**
  *array的扩展方法
  *	 void remove(arr,a): 删除数组中某一个元素
  *				参数1:数组
  *				参数2:要删除的元素
  *
  *	 bool isArray(a): 判断接收的值是否是数组
  *				参数1:值
  *
  *  int indexOf(haystack,needle):返回某个指定的元素值在数组中首次出现的位置。
  *				参数1:数组
  *				参数2：需检索的值
  *  string toString(seperator):重写数组toString方法,将数组中元素转换为字符串形式,元素跟元素之间用seperator分割
  *
  *  void clear(arr) 用于清空数组
  *
  *  void contain(arr,ele)判断数据项是否在该数组中
  *
  *  void removeAt(arr,ele)移除数据项的数据
  *
  *
  *
  */
Sandbox.moudles["Array"] = function(box){
	var arrStr = "[object Array]",
			toString = Object.prototype.toString;
	box.remove = function(arr,a){
		var max = arr.length,
			i = 0 ;
		for(;i<max;i+=1){
			if(arr[i]==a){
				arr[i]=arr[max-1];
				arr.pop();
				return;
			} 
		}	
	};

	box.isArray = function(a){
		return toString.call(a) == arrStr;
	};
;//判断是否原始浏览器是否存在indexOf方法

	box.indexOf = function(haystack,needle){
		var max =  haystack.length,
			 i = 0;
		for(;i<max;i+=1){
			if(haystack[i] == needle){
				return i;
			}
		}
		return -1;
	};
	box.toString = function(arr,seperator){
		 return arr.join(seperator || ',');
	};

	box.clear = function(arr){
		arr.length = 0;
	}

	box.contain = function(arr,ele){
		 return arr.indexOf(ele) !== -1;
	};

	box.removeAt = function(arr,ele){
		  var index = this.indexOf(obj); 
	     if(index >= 0){
	     	 arr.splice(index,index+1);
	     }
  		delete array[2];  

	};
};

/**
  *string的扩展方法
  *  string format():参数化字符串
  *		参数1:模板字符串,例如"{0}{1}"
  *	    使用方法
  *          format("{0},{1}","a","b")返回"a,b"
  *          format("{0},{1}",["a","b"])返回"a,b"
  *	
  *  string trim()字符串-去掉前后空白字符
  *
  *  string ltrim() 去掉前空白字符
  *
  *  int lenASCII() 获取以ASCII编码字节数 英文占1字节 中文占2字节
  *
  *  int lenUNICODE() 获取以UNICODE编码字节数 一个字符均占2个字节
  *
  *
  *
  *
  */
Sandbox.moudles["String"] = function(box){
	box.format = function(){
		var args = Array.prototype.slice.call(arguments),
			format = args.shift(),
			partten = /\{(\d+)\}/g,
			arraryMoudle ;
		Sandbox("Array",function(box){
			arraryMoudle = box;
		});
		args = arraryMoudle.isArray(args[0]) ? args[0] :args;
		return format.replace(partten,function(m,i){//参数=匹配子串+第几次匹配+匹配字串位置+源字符串
			return args[i];
		});
	};

	box.trim = function(str){
		return str.replace(/(^\s*)|(\s*$)/g, "");
	};

	box.ltrim = function(str){
		return str.replace(/(^\s*)/g, "");
	}

	box.lenASCII = function(str){
		return str.replace(/[^\x00-\xff]/g,'xx').length;
	};

	box.lenUNICODE = function(str){
		 return str.length*2;
	};
	
};





















