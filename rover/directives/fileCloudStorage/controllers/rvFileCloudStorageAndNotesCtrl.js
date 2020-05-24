sntRover.controller('rvFileCloudStorageAndNotesCtrl', ['$scope', 'rvFileCloudStorageSrv', '$controller',
	function($scope, rvFileCloudStorageSrv, $controller) {

		$scope.setScreenMode = function (selectedMode) {
			$scope.screenMode = selectedMode;
			$scope.$broadcast('FETCH_'+ selectedMode);
		};

		(function(){
			rvFileCloudStorageSrv.cardType = $scope.cardType;
			$scope.cardData = {};
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