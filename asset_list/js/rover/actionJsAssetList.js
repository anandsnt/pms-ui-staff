module.exports = {	
	getList : function() {
		var assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					'rover/controllers/rvActionsManagerCtrl.js',
					'rover/services/rvReservationSrv.js',
					'rover/services/actionTasks/**/*.js'

				]
			};
		return assetsForScreen;
	}
};