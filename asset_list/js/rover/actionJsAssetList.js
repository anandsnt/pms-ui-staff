module.exports = {
	getList : function() {
        var controllerRoot 	= 'rover/controllers/';

		var assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
                    controllerRoot + 'actionsManager/**/*.js',
					'rover/services/rvReservationSrv.js',
					'rover/services/actionTasks/**/*.js'
				]
			};
		return assetsForScreen;
	}
};