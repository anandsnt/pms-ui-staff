module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			sharedJs 		= 'shared/lib/js/',
			assetsForView 	= {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					sharedJs + 'fullcalender/**/*.js',					
					controllerRoot + "changeStayDates/**/*.js",
					servicesRoot + "changeStayDates/**/*.js"
				]
		};
		return assetsForView;
	}
};