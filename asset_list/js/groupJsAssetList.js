module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		groupJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				roverRoot + "controllers/groups/**/*.js",
				roverRoot + "services/group/**/*.js",
				roverRoot + "services/accounts/**/*.js"
			]
		};
		return groupJsAssets;
	}
};