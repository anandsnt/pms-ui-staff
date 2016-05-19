module.exports = {
	getList : function() {
        var controllerRoot 	= 'rover/controllers/',
            servicesRoot 	= 'rover/services/',
            assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
                    controllerRoot + 'actionsManager/**/*.js',
					servicesRoot + 'actionTasks/**/*.js'
				]
			};
		return assetsForScreen;
	}
};