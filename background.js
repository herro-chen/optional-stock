var isSwitch = localStorage.isSwitch ? localStorage.isSwitch : 0;
var stocks = localStorage.stocks ? JSON.parse(localStorage.stocks) : {};

setInterval(function(){
	if(isSwitch > 0) sendIntantList();
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

window.addEventListener('storage', onStorageChange, false);

function onStorageChange() {
	updateSwitch();
	updateStock();
}

function updateSwitch(){
	return isSwitch = localStorage.isSwitch ? localStorage.isSwitch : 0;
}

function updateStock(){
	return stocks = localStorage.stocks ? JSON.parse(localStorage.stocks) : {};
}

function handleIntantList(datas){
	var body = '';
	for(symbol in datas){
		
		if(datas[symbol].close != stocks[symbol].close){
			if(datas[symbol].close > stocks[symbol].max){
				body += datas[symbol].name + '('+ symbol +')';
				body += '最新价格 '+ datas[symbol].close +' 已经超过设置提醒的最大价格 ' + stocks[symbol].max + '\n';
			}else if(datas[symbol].close < stocks[symbol].min){
				body += datas[symbol].name + '('+ symbol +')';
				body += '最新价格 '+ datas[symbol].close +' 已经低于设置提醒的最小价格 ' + stocks[symbol].min + '\n';
			}
		}
		stocks[symbol].close = datas[symbol].close;
	}
	
	if(body){
		var notification = new Notification('自选股价格提醒',{icon:"http://yunvs.b0.upaiyun.com/statics/images/nficon.png", body:body});
		document.getElementById('soundMedia').play();			
	}
	
}






