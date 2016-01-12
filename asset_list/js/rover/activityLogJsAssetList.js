module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					servicesRoot + 'activityLog/**/*.js',					
					controllerRoot + 'activityLog/**/*.js'
				]
			};
		return assetsForScreen;
	}
};