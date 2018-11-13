module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		allotmentJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				roverRoot + "controllers/allotments/**/*.js",
				roverRoot + "controllers/groups/activity/rvActivityCtrl.js",
				roverRoot + "services/accounts/rvAccountsConfigurationSrv.js",
				roverRoot + "services/accounts/rvAccountsTransactionSrv.js",
				roverRoot + "services/reservation/rvReservationSummarySrv.js",
				roverRoot + "services/group/rvGroupRoomingListSrv.js",
				roverRoot + "services/reservation/RVReservationAddonsSrv.js",
				roverRoot + "services/allotments/**/*.js",
				roverRoot + "services/rvReservationSrv.js",
				roverRoot + "services/reservation/rvReservationBaseSearchSrv.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return allotmentJsAssets;
	}
};
