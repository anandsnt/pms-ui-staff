sntZestStation.directive('zsEmailCollection', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		scope: {
			mode: '=mode',
			guestId: '=guestId'
		},
		templateUrl: '/assets/directives/zsEmailCollection/zsEmailCollectionDir.html',
		controller: 'zsEmailCollectionDirCtrl'
	};
});