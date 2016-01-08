module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [						
					controllerRoot + 'workManagement/**/*.js',
					servicesRoot + 'workManagement/**/*.js',
					'rover/filters/rangeFilter.js'
				]
			};
		return assetsForScreen;
	}
};