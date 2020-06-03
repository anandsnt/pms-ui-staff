sntRover.controller('rvFileCloudStorageAndNotesCtrl', ['$scope', 'rvFileCloudStorageSrv', '$controller',
	function($scope, rvFileCloudStorageSrv, $controller) {

		$scope.setScreenMode = function(selectedMode) {
			$scope.screenMode = selectedMode;
			$scope.$broadcast('FETCH_' + selectedMode);
		};

		(function() {
			rvFileCloudStorageSrv.setCardType($scope.cardType);
			$scope.cardData = {
				notesViewOn: true
			};
			$controller('rvCardNotesCtrl', {
				$scope: $scope
			});
			$controller('rvFileCloudStorageCtrl', {
				$scope: $scope
			});
			$scope.setScreenMode('NOTES');
		})();
	}
]);