module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			sharedRoot = 'shared/',
			servicesRoot 	= 'rover/services/',
		groupJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				controllerRoot + 'socialLobby/rvSocialLobbyCtrl.js',
				controllerRoot + 'socialLobby/rvSocialLobbyCommentsCtrl.js',
				servicesRoot + "socialLobby/rvSocialLobbySrv.js",
				sharedRoot + 'directives/iScrollFixes/iscrollStopPropagation.js'
			]
		};
		return groupJsAssets;
	}
};