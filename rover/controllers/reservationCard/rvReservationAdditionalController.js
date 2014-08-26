sntRover.controller('rvReservationAdditionalController', ['$rootScope', '$scope', 'RVReservationSummarySrv',
	function($rootScope, $scope, RVReservationSummarySrv) {
		BaseCtrl.call(this, $scope);
		$scope.additionalDetails = {
			hideDetails: true // TODO : make this flag true before sending to CR
		}

		$scope.updateAdditionalDetails = function() {
			console.log('updateAdditionalDetails', $scope.reservationParentData.demographics);
			var updateSuccess = function(data) {
				$scope.$emit('hideLoader');
				console.log('Data', data);
			};
			var updateFailure = function(data) {
				$scope.$emit('hideLoader');
				console.log('Data', data);
				$scope.errorMessage = data;
			};

			$scope.errorMessage = [];

			$scope.invokeApi(RVReservationSummarySrv.updateReservation, {
				'reservationId': $scope.reservationParentData.reservationId,
				'reservation_type_id': parseInt($scope.reservationParentData.demographics.reservationType),
				'source_id': parseInt($scope.reservationParentData.demographics.source),
				'market_segment_id': parseInt($scope.reservationParentData.demographics.market),
				'booking_origin_id': parseInt($scope.reservationParentData.demographics.origin)
			}, updateSuccess, updateFailure);
		}
	}
]);