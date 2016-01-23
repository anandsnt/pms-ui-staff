module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [						
					controllerRoot + 'accounts/**/*.js',
					servicesRoot + 'accounts/**/*.js'
				]
			};
		return assetsForScreen;
	}
};