(function(d){function h(a,b,e){var c="rgb"+(d.support.rgba?"a":"")+"("+parseInt(a[0]+e*(b[0]-a[0]),10)+","+parseInt(a[1]+e*(b[1]-a[1]),10)+","+parseInt(a[2]+e*(b[2]-a[2]),10);d.support.rgba&&(c+=","+(a&&b?parseFloat(a[3]+e*(b[3]-a[3])):1));return c+")"}function f(a){var b;return(b=/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(a))?[parseInt(b[1],16),parseInt(b[2],16),parseInt(b[3],16),1]:(b=/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(a))?[17*parseInt(b[1],16),17*parseInt(b[2],
16),17*parseInt(b[3],16),1]:(b=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(a))?[parseInt(b[1]),parseInt(b[2]),parseInt(b[3]),1]:(b=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(a))?[parseInt(b[1],10),parseInt(b[2],10),parseInt(b[3],10),parseFloat(b[4])]:l[a]}d.extend(!0,d,{support:{rgba:function(){var a=d("script:first"),b=a.css("color"),e=!1;if(/^rgba/.test(b))e=!0;else try{e=b!=a.css("color","rgba(0, 0, 0, 0.5)").css("color"),
a.css("color",b)}catch(c){}return e}()}});var k="color backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor outlineColor".split(" ");d.each(k,function(a,b){d.Tween.propHooks[b]={get:function(a){return d(a.elem).css(b)},set:function(a){var c=a.elem.style,g=f(d(a.elem).css(b)),m=f(a.end);a.run=function(a){c[b]=h(g,m,a)}}}});d.Tween.propHooks.borderColor={set:function(a){var b=a.elem.style,e=[],c=k.slice(2,6);d.each(c,function(b,c){e[c]=f(d(a.elem).css(c))});var g=f(a.end);
a.run=function(a){d.each(c,function(d,c){b[c]=h(e[c],g,a)})}}};var l={aqua:[0,255,255,1],azure:[240,255,255,1],beige:[245,245,220,1],black:[0,0,0,1],blue:[0,0,255,1],brown:[165,42,42,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgrey:[169,169,169,1],darkgreen:[0,100,0,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkviolet:[148,0,211,1],fuchsia:[255,
0,255,1],gold:[255,215,0,1],green:[0,128,0,1],indigo:[75,0,130,1],khaki:[240,230,140,1],lightblue:[173,216,230,1],lightcyan:[224,255,255,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],magenta:[255,0,255,1],maroon:[128,0,0,1],navy:[0,0,128,1],olive:[128,128,0,1],orange:[255,165,0,1],pink:[255,192,203,1],purple:[128,0,128,1],violet:[128,0,128,1],red:[255,0,0,1],silver:[192,192,192,1],white:[255,255,255,1],yellow:[255,255,
0,1],transparent:[255,255,255,0]}})(jQuery);

$(function(){
	
	var isSwitch = localStorage.isSwitch ? localStorage.isSwitch : 0;
	if(isSwitch > 0){
		$('#open').addClass('active');
	}else{
		$('#close').addClass('active');
	}
	
	$('.switch').on('click', function(){
		$('.switch').removeClass('active');
		$(this).addClass('active');
		localStorage.isSwitch = $(this).attr('id') == 'open' ? 1 : 0;
	});
	
	$('#addStkBtn').on('click', function(){
		var message = $('#message');
		var symbol = $('#symbol').val();
		var reg = /\d{6}/g;
		if(reg.test(symbol)){
			if(stocks[symbol]){
				var dom = '<div style="text-align:center;background:red;color:#fff">该股票已存在</div>';
				message.html(dom);
				return false;
			}
			var market = 'sz';
			if(symbol.substring(0, 1) == '6') market = 'sh';
			var url = 'http://hq.sinajs.cn/?_=0.3473490597680211&list=' + market + symbol;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4){
					ret = xhr.responseText;
					var reg = 'var hq_str_'+ market + symbol + '=';
					var str = ret.replace(reg, '');
					str = str.replace(/[\n";]/g,'');
					var stock = str.split(',');
					console.log(stock);
					stocks[symbol] = {"name": stock[0], "min": stock[3], "max": stock[3]};
					localStorage.stocks = JSON.stringify(stocks);
					$('.stocks').append(addStkDom(symbol, stocks[symbol]));
				}
			}
			xhr.send();
		}else{
			var dom = '<div style="text-align:center;background:red;color:#fff">请输入正确的股票代码</div>';
			message.html(dom);
		}
		
	})
	
	var stocks = localStorage.stocks ? JSON.parse(localStorage.stocks) : {};
	var stkDoms = '';
	for(key in stocks){
		stkDoms += addStkDom(key, stocks[key]);
	}
	$('.stocks').append(stkDoms);
	
	function addStkDom(symbol , stock){
		var stkDom = '';
		stkDom += '<div class="stock instantList-'+ symbol +'" symbol="' + symbol + '">';
		stkDom += '	<a class="item">'+ stock.name +'('+ symbol +')</a>';
		stkDom += '	<a class="item"><span class="close">--</span></a>';		
		stkDom += '	<a class="item"><span class="zdf">--</span></a>';
		stkDom += '	<a class="item">';
		stkDom += '		<input class="min-input min-val" type="number" min="0" max="500" step="0.01" value="'+ stock.min +'" pattern="^\d+\.\d{2}$" />-'
		stkDom += '		<input class="min-input max-val" type="number" min="0" max="500" step="0.01" value="'+ stock.max +'" pattern="^\d+\.\d{2}$" />';
		stkDom += '	</a>';
		stkDom += '	<a class="item setting"></a>';
		stkDom += '</div>';		
		return stkDom;
	}
	
	$('.stocks').on('focusout', '.min-input', function(){
		var message = $('#message');
		var _this = $(this);
		var tipVal = _this.val();
		var reg = /^\d+\.\d{2}$/;
		if(tipVal == ''){
			return false;
		}
		
		if(!reg.test(tipVal)){
			var dom = '<div style="text-align:center;background:red;color:#fff">请输入正确的价格(包含小数点后两位)</div>';
			message.html(dom);
			_this.focus();
			return false;
		}
		
		var par = _this.parents('.stock');
		
		var max_val = tipVal;
		var min_val = tipVal;
		
		if(_this.hasClass('min-val')){//判断是否最小
			var max = par.find('.max-val');
			max_val = max.val();
			if(!max_val) max_val = (tipVal * 1.2).toFixed(2);
			else if(max_val < tipVal){
				_this.val(max_val);
				max_val = tipVal;
			}
			max.val(max_val);
		}else{
			var min = par.find('.min-val');
			min_val = min.val();
			if(!min_val) min_val = (tipVal * 0.8).toFixed(2);
			else if(min_val > tipVal){
				_this.val(min_val);
				min_val = tipVal;
			}
			min.val(min_val);
		}
		
		//更新股票
		var symbol = par.attr('symbol');
		stocks[symbol] = {"name": stocks[symbol].name, "min": min_val, "max": max_val};
		localStorage.stocks = JSON.stringify(stocks);
		
	})
	
	sendIntantList();
	setInterval(function(){
		sendIntantList();
	},10000);
	
	function sendIntantList(){
		
		var symbols = [];
		for(key in stocks){
			var market = 'sz';
			if(key.substring(0, 1) == '6') market = 'sh';
			symbols.push(market + key);
		}
		var lists = symbols.join(',');

		if(lists){
			var url = 'http://hq.sinajs.cn/?_=0.3473490597680211&list=' + lists;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4){
					ret = xhr.responseText;

					var strArr = ret.split(';');
					strArr.pop();
					var stocks_ = {};
					strArr.forEach(function(value, index){
						var symbol_ = symbols[index];
						var reg = 'var hq_str_'+ symbol_ +'=';
						var str = value.replace(reg, '');
						str = str.replace(/[\n"]/g,'');
						var stock = str.split(',');
						var symbol = symbol_.substring(2);
						var zdf = (((stock[3] / stock[2]) - 1) * 100).toFixed(2);
						if(zdf > 0) zdf = '+' + zdf;
						stocks_[symbol] = {"name": stock[0], "close": stock[3], "zdf": zdf};
					})

					handleIntantList(stocks_);
					
				}
			}
			xhr.send();		
		}
	}
	
	function handleIntantList(datas){
		$.each(datas, function(symbol, data){

			var _this = $('.instantList-' + symbol);
			var last_zdf = _this.find('.zdf').html();
			last_zdf = $.trim(last_zdf);
			
			var up_bg = {"background-color": "#f99"};
			var down_bg = {"background-color": "#7f7"};	
			
			if(data.zdf == 'undefined' || data.zdf != last_zdf){
				if(data.zdf.substring(0, 1) == '-'){
					_this.find('.close').addClass('down');
					_this.find('.zdf').addClass('down');
					_this.find('.close').css(down_bg);
					_this.find('.zdf').css(down_bg);
				}else{
					_this.find('.close').addClass('up');
					_this.find('.zdf').addClass('up');
					_this.find('.close').css(up_bg);
					_this.find('.zdf').css(up_bg);
				}
				
				var out_bg = {'backgroundColor' : 'rgba(255, 255, 255, 0)'};						
				_this.find('.close').animate(out_bg, 2000);
				_this.find('.zdf').animate(out_bg, 2000);
				
				_this.find('.close').html(data.close);
				_this.find('.zdf').html(data.zdf);	
			}
		})
	}
	
})