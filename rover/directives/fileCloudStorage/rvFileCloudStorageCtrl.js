sntRover.controller('rvFileCloudStorageCtrl', ['$scope',
	function($scope) {

		$scope.screenMode = 'FILES';


		$scope.changeScreenMode = function (selectedMode) {
			$scope.screenMode = selectedMode;
		};


	}
]);