sntRover.controller('rvFileCloudStorageCtrl', ['$scope', 'rvFileCloudStorageSrv',
	function($scope, rvFileCloudStorageSrv) {

		$scope.screenMode = 'FILES';
		$scope.fileList = [];

		console.log($scope.cardType);


		$scope.changeScreenMode = function (selectedMode) {
			$scope.screenMode = selectedMode;
		};
		var fetchFileAttachments = function() {
			rvFileCloudStorageSrv.fetchFileAttachments().then(function(response) {
				$scope.fileList = response;
				console.log(response)
			},
			function(errorMessage) {

			});
		};

		(function(){
			fetchFileAttachments();
		})();
	}
]);