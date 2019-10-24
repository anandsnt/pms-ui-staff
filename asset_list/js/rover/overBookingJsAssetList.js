module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		overBookingJsAssetList = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				roverRoot + "controllers/overBooking/*.js",
				roverRoot + "services/overBooking/*.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return overBookingJsAssetList;
	}
};
