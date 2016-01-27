module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		allotmentJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				roverRoot + "controllers/allotments/**/*.js",
				'rover/directives/setTextboxValue/*.js',
				'rover/directives/delayTextbox/*.js',
				'rover/directives/clearTextbox/*.js',
				'rover/directives/Outside Click handler/*.js',
				roverRoot + "controllers/groups/activity/rvActivityCtrl.js",
				roverRoot + "services/accounts/rvAccountsConfigurationSrv.js",
				roverRoot + "services/accounts/rvAccountsTransactionSrv.js",
				roverRoot + "services/reservation/rvReservationSummarySrv.js",
				roverRoot + "services/group/rvGroupRoomingListSrv.js",
				roverRoot + "services/reservation/RVReservationAddonsSrv.js",
				roverRoot + "services/allotments/**/*.js",
				roverRoot + "services/rvReservationSrv.js"
			]
		};
		return allotmentJsAssets;
	}
};