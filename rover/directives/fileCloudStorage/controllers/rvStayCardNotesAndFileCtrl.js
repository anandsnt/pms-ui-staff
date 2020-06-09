sntRover.controller('rvStayCardNotesAndFileCtrl', ['$scope', 'rvFileCloudStorageSrv', '$controller',
	function($scope, rvFileCloudStorageSrv, $controller) {

		$scope.screenModeChanged = function(selectedType) {
			$scope.$broadcast('FETCH_' + selectedType);
		};

		(function() {
			var cardType = 'stay_card';
			var cardId =  $scope.reservationData.reservation_card.reservation_id;

			rvFileCloudStorageSrv.setCardType(cardType);
			$scope.cardId = cardId;
			$scope.cardType = cardType;
			$scope.cardData = {
				notesViewOn: true
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