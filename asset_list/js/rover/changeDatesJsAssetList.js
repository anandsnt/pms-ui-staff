module.exports = {
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			sharedJs 		= 'shared/lib/js/',
			assetsForView 	= {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					controllerRoot + "changeStayDates/**/*.js",
					servicesRoot + "changeStayDates/**/*.js",
					servicesRoot + "nightlyDiary/**/*.js"
				]
		};
		return assetsForView;
	}
};