sntRover.controller('rvReservationAdditionalController', ['$rootScope', '$scope', 'RVReservationSummarySrv', 'rvPermissionSrv',
	function($rootScope, $scope, RVReservationSummarySrv, rvPermissionSrv) {
		BaseCtrl.call(this, $scope);
		$scope.additionalDetails = {
			segmentAvailable: !!$scope.reservationParentData.demographics.segment,
			hideDetails: true
		};
		$scope.hasPermissionForCommissionUpdate = function(){
			return rvPermissionSrv.getPermissionValue('UPDATE_COMMISSION');
		};

		$scope.isSegmentAutoComputed = function() {
			var currentSegment = $scope.reservationParentData.demographics.segment,
				aptSegment = "";
			if (!!currentSegment) {
				angular.forEach($scope.otherData.segments, function(segment) {
					if ($scope.reservationData.reservation_card.total_nights < segment.los) {
						if (!aptSegment) {
							aptSegment = segment.value;
						}
					}
				});
				return !!aptSegment && aptSegment === currentSegment;
			} else {
				return false;
			}
		};
		var eventTimestamp = "";
		$scope.clickedAdditionalDetails = function($event){

			$event.preventDefault();
		    $event.stopImmediatePropagation();
  			$event.stopPropagation();
  			var toggleAction = function(){
				$scope.additionalDetails.hideDetails = !$scope.additionalDetails.hideDetails;
				$scope.refreshReservationDetailsScroller(300);
				eventTimestamp = $event.timeStamp;
  			};
			if (parseInt(eventTimestamp)) {
				if (($event.timeStamp - eventTimestamp) < 500) {
					return;
				}
				else{
					toggleAction();
				}
			}
			else{
				toggleAction();
			};

		};

		$scope.updateAdditionalDetails = function() {
			var updateSuccess = function(data) {
				// Set the Reservation Type in the sntCode/app/assets/rover/partials/reservationCard/rvReservationCardPayment.html partial

				var selectedReservationGuaranteeType = _.where($scope.otherData.reservationTypes, {
					value: parseInt($scope.reservationParentData.demographics.reservationType)
				});
				if (selectedReservationGuaranteeType.length > 0) {
					$scope.reservationData.reservation_card.guarentee_type = selectedReservationGuaranteeType[0].name;
				} else {
					$scope.reservationData.reservation_card.guarentee_type = "";
				}
				$scope.$emit('hideLoader');
			};
			var updateFailure = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			};

			$scope.errorMessage = [];

			$scope.invokeApi(RVReservationSummarySrv.updateReservation, {
				'reservationId': $scope.reservationParentData.reservationId,
				'reservation_type_id': parseInt($scope.reservationParentData.demographics.reservationType),
				'source_id': parseInt($scope.reservationParentData.demographics.source),
				'market_segment_id': parseInt($scope.reservationParentData.demographics.market),
				'booking_origin_id': parseInt($scope.reservationParentData.demographics.origin),
				'segment_id': parseInt($scope.reservationParentData.demographics.segment),
				'commission_data':$scope.reservationData.reservation_card.commission_details
			}, updateSuccess, updateFailure);
		};

		$rootScope.$on('UPDATERESERVATIONTYPE', function(e, data) {
            $scope.reservationParentData.demographics.reservationType = data;

            var selectedReservationGuaranteeType = _.where($scope.otherData.reservationTypes, {
				value: parseInt($scope.reservationParentData.demographics.reservationType)
			});
			if (selectedReservationGuaranteeType.length > 0) {
				$scope.reservationData.reservation_card.guarentee_type = selectedReservationGuaranteeType[0].name;
			} else {
				$scope.reservationData.reservation_card.guarentee_type = "";
			}
        });

	}
]);