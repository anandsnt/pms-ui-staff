module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
		overBookingJsAssetList = {
			minifiedFiles: [],
			nonMinifiedFiles: [				
				roverRoot + "overBooking/**/*.js",
				servicesRoot + "overBooking/**/*.js"
			]
		};

		return overBookingJsAssetList;
	}
};