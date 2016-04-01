var  createStyleNodeWithString = function(str) {
	var node = document.createElement('style');
	node.innerHTML = str;
	document.head.appendChild(node);
};

// startac specific print styles
var applyStarTacStyles = function() {
	var starTacStyles = '@page { margin: 1cm 0.05cm; }#registration-card .logo{width:150px !important} .invoice-logo .logo{width:50% !important}.page-print{margin-left:20px;width:330px;>div.logo>div{ position:fixed;top:-80px}>div.content{position:fixed;top:30px;text-align:left !important;padding-left:2%;padding-right:2%;>strong.footer{ text-align:center !important}>strong.large_txt,span.large_txt{font-size:2em}span>strong.large_txt{font-size:2em}span{font-size:1.2em}span.reg_text{margin-top:-60px;white-space:pre-wrap}';
    createStyleNodeWithString(starTacStyles);
    console.info("applied startac styles");
};

var applyStylesForYotelStarTac = function(){
	var starTacStyles = '.page-print{width:340px;}#registration-card{padding-top:1cm !important;padding-bottom:1cm !important;}.page-print{margin-left:4px;}#registration-card .logo{width:120px !important} #registration-card .content{text-align:left;position:fixed;top:1cm;bottom:2cm;width:340px;padding-left:0;padding-right:0;}.page-print > div.content{position:fixed;top:30px;text-align:left !important;padding-left:2%;padding-right:2%}.page-print > div.content > strong.footer{text-align:center !important}.page-print > div.content > strong.large_txt,.page-print > div.content span.large_txt{font-size:2em}.page-print > div.content span > strong.large_txt{font-size:2em}.page-print > div.content span{font-size:1.2em}.page-print > div.content span.reg_text{margin-top:-60px;white-space:pre-wrap}';
	createStyleNodeWithString(starTacStyles);
	 
};
//for non startTac
var applyPrintMargin = function(){
	var starTacStyles = '@page { margin: 1cm 3cm; }';
	createStyleNodeWithString(starTacStyles);
};

var applyStylesForYotelReceipt = function(){
	var starTacStyles = '.page-print{width:240px;}#registration-card{padding-top:1cm !important;padding-bottom:1cm !important;}.page-print{margin-left:6px;}#registration-card .logo{width:100px !important;top: 0.25cm;} #registration-card .content{text-align:left;position:fixed;top:1cm;bottom:2cm;width:240px;padding-left:1px;padding-right:1px;}.page-print > div.content{position:fixed;top:30px;text-align:left !important;padding-left:2%;padding-right:2%}.page-print > div.content > strong.footer{text-align:center !important}.page-print > div.content > strong.large_txt,.page-print > div.content span.large_txt{font-size:1.6em}.page-print > div.content span > strong.large_txt{font-size:1.5em}.page-print > div.content span{font-size:1.2em}.page-print > div.content span.reg_text{margin-top:-60px;white-space:pre-wrap}';
	createStyleNodeWithString(starTacStyles);
	 
};