module.exports = {	
	getList : function() {
		var roverRoot 			= 'rover/',
		availabilityJsAssets 	= {
			minifiedFiles 	: [],
			nonMinifiedFiles: [		
				roverRoot + "controllers/availability/**/*.js",
				roverRoot + "services/availability/**/*.js",
				roverRoot + "services/group/rvGroupConfigurationSrv.js",
				roverRoot + "services/accounts/rvAccountsConfigurationSrv.js",
				roverRoot + "services/allotments/rvAllotmentConfigurationSrv.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return availabilityJsAssets;
	}
};
