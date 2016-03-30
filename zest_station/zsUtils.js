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
	applyStarTacStyles();
	var starTacStyles = '.page-print{margin-left:10px;}#registration-card .logo{width:120px !important} #registration-card .content{text-align:left;position:fixed;top:80px;width:330px;padding-left:0;padding-right:0;}.page-print > div.content{position:fixed;top:30px;text-align:left !important;padding-left:2%;padding-right:2%}.page-print > div.content > strong.footer{text-align:center !important}.page-print > div.content > strong.large_txt,.page-print > div.content span.large_txt{font-size:2em}.page-print > div.content span > strong.large_txt{font-size:2em}.page-print > div.content span{font-size:1.2em}.page-print > div.content span.reg_text{margin-top:-60px;white-space:pre-wrap}';
	createStyleNodeWithString(starTacStyles);
	 
};
//for non startTac
var applyPrintMargin = function(){
	var starTacStyles = '@page { margin: 1cm 3cm; }';
	createStyleNodeWithString(starTacStyles);
};