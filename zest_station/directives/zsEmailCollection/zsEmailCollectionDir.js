sntZestStation.directive('zsEmailCollection', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		scope: {
			mode: '=mode',
			guestId: '=guestId',
			icon: '=icon',
			email:"=email",
			isSkipable:"=isSkipable",
			showKeyboard:'&'
		},
		templateUrl: '/assets/directives/zsEmailCollection/zsEmailCollectionDir.html',
		controller: 'zsEmailCollectionDirCtrl'
	};
});