module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
		groupJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				controllerRoot + 'socialLobby/rvSocialLobbyCtrl.js',
				servicesRoot + "socialLobby/rvSocialLobbySrv.js"
			]
		};
		return groupJsAssets;
	}
};