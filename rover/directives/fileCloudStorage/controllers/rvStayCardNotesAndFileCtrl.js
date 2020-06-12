sntRover.controller('rvStayCardNotesAndFileCtrl', ['$scope', 'rvFileCloudStorageSrv', 'RVHotelDetailsSrv', '$controller',
	function($scope, rvFileCloudStorageSrv, RVHotelDetailsSrv, $controller) {

		$scope.screenModeChanged = function(selectedType) {
			$scope.$broadcast('FETCH_' + selectedType);
		};

		(function() {
			var cardType = 'stay_card';
			var cardId = $scope.reservationData.reservation_card.reservation_id;

			$scope.cardId = cardId;
			$scope.cardType = cardType;
			$scope.cardData = {
				notesViewOn: true,
				cloudType: RVHotelDetailsSrv.hotelDetails.cloud_storage_config.cloud_storage_type
			};
			$scope.showFiles = $scope.isCloudStorageEnabledForCardType(cardType);
			$controller('rvCardNotesCtrl', {
				$scope: $scope
			});
			$controller('rvFileCloudStorageCtrl', {
				$scope: $scope
			});
			$scope.$broadcast('FETCH_NOTES');
			$scope.errorMessage = '';
		})();
	}
]);