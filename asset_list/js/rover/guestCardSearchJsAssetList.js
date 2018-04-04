module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		guestcardsearchJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [				
				roverRoot + "controllers/guests/**/*.js",				
				roverRoot + "services/guestcard/rvGuestCardSrv.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return guestcardsearchJsAssets;
	}
};
