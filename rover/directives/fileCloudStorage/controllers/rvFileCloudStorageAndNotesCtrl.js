sntRover.controller('rvFileCloudStorageAndNotesCtrl', ['$scope', 'rvFileCloudStorageSrv', 'RVHotelDetailsSrv', '$controller',
	function($scope, rvFileCloudStorageSrv, RVHotelDetailsSrv, $controller) {

		$scope.screenModeChanged = function(selectedType) {
			$scope.$broadcast('FETCH_' + selectedType);
		};

		(function() {
			rvFileCloudStorageSrv.setCardType($scope.cardType);
			$scope.cardData = {
				notesViewOn: true,
				cloudType: RVHotelDetailsSrv.hotelDetails.cloud_storage_config.cloud_storage_type
			};
			$controller('rvCardNotesCtrl', {
				$scope: $scope
			});
			$controller('rvFileCloudStorageCtrl', {
				$scope: $scope
			});
			$scope.$broadcast('FETCH_NOTES');
			$scope.errorMessage = '';
			var scrollOptions = {
				preventDefaultException: {
					tagName: /^(INPUT|LI)$/
				},
				preventDefault: false
			};
			
			$scope.setScroller('card_file_list_scroller', scrollOptions);
		})();
	}
]);