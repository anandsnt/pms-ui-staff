sntRover.controller('rvFileCloudStorageCtrl', ['$scope', 'rvFileCloudStorageSrv', '$controller',
	function($scope, rvFileCloudStorageSrv, $controller) {

		$scope.screenMode = 'FILES';
		$scope.fileList = [];
		rvFileCloudStorageSrv.cardType = $scope.cardType;

		console.log($scope.cardType);


		$scope.changeScreenMode = function (selectedMode) {
			$scope.screenMode = selectedMode;
		};
		var fetchFileAttachments = function() {
			rvFileCloudStorageSrv.fetchFileAttachments({}).then(function(response) {
				$scope.fileList = response;
				console.log(response)
			},
			function(errorMessage) {

			});
		};

		(function(){
			fetchFileAttachments();

			$scope.cardData = {
				fileList: [],
				noteText: ""
			};
			$controller('rvCardNotesCtrl', {
                  $scope: $scope
             });
			
		})();
	}
]);