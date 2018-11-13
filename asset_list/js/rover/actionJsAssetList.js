module.exports = {
	getList : function() {
        var controllerRoot 	= 'rover/controllers/',
            servicesRoot 	= 'rover/services/',
            roverRoot       = 'rover/',
            assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
                    controllerRoot + 'actionsManager/**/*.js',
					servicesRoot + 'actionTasks/**/*.js',
                    servicesRoot + "reports/**/*.js",
                    roverRoot + "factories/reports/**/*.js",
                    roverRoot + "constants/reports/**/*.js",
                    // Eliminate all spec files
                    '!**/*.spec.js'
				]
			};
		return assetsForScreen;
	}
};
