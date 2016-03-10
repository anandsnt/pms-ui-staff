module.exports = {	
	getList : function() {
		var jsLibRoot 	= 'shared/lib/js/',
			jsAssets 	= {
				minifiedFiles: [
					jsLibRoot + "highcharts.min.js"
				],
				nonMinifiedFiles: [	
					jsLibRoot + "angular-highcharts.js"
				]
		};
		return jsAssets;
	}
};