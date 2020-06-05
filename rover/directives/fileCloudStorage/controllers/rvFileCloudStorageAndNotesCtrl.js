sntRover.controller('rvFileCloudStorageAndNotesCtrl', ['$scope', 'rvFileCloudStorageSrv', '$controller',
	function($scope, rvFileCloudStorageSrv, $controller) {

		$scope.screenModeChanged = function(selectedType) {
			$scope.$broadcast('FETCH_' + selectedType);
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
			$scope.$broadcast('FETCH_NOTES');
		})();
	}
]);