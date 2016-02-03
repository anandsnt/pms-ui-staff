module.exports = {
	getList : function() {
		var sharedRoot 	= 'shared/',
			jsLibRoot 		= sharedRoot + 'lib/js/',
			controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
					jsLibRoot + 'angular-multi-select.js'
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