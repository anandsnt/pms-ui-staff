sntRover.controller('RVEditRatesCtrl', ['$scope', '$rootScope', 
	'$stateParams', '$timeout', 'ngDialog',
	'RVReservationCardSrv',
	function($scope, $rootScope, $stateParams, $timeout, ngDialog, RVReservationCardSrv) {
		
		//As per CICO-14354, we are setting adjustment reason as the last one we entered
		$scope.adjustment_reason = $scope.ngDialogData.lastReason;

		$scope.setScroller('rateDetails');
		$scope.refreshRateDetails = function() {
            $timeout(function() {
    			$scope.refreshScroller('rateDetails');
     		}, 2000);
        }
        $scope.refreshRateDetails();

		/**
		* utility function to get reservation ID
		* @return {String} - reservationID
		*/
		var getReservationID = function() {
			return ($scope.reservationData.reservationId || $scope.reservationParentData.reservationId);			
		};
		
		/**
		* utility function to get confirmation Number
		* @return {String} - confirmation Number
		*/
		var getConfirmationNumber = function() {
			return ($scope.reservationData.confirmNum || $scope.reservationParentData.confirmNum);			
		};

		/**
		* function to save comment against rate change
		* will save comment if something entered
		*/
		$scope.saveCommentAgainstRateChange = function() {
			// proceed only if something entered
			if($scope.adjustment_reason.trim() === "") 
				return;

			//forming the API params
			var params 				= {};
            params.reservation_id 	= getReservationID();
            params.text 			= $scope.adjustment_reason;
            params.is_from_rate_adjustment = true;
            params.note_topic 		= 1;

			var options 			= {
	    		params: params    		
		    };
		    $scope.callAPI(RVReservationCardSrv.saveReservationNote, options);			
		};

		$scope.save = function(room, index) {
			_.each(room.stayDates, function(stayDate) {
				stayDate.rateDetails.modified_amount = parseFloat(stayDate.rateDetails.modified_amount).toFixed(2);
				if (isNaN(stayDate.rateDetails.modified_amount)) {
					stayDate.rateDetails.modified_amount = parseFloat(stayDate.rateDetails.actual_amount).toFixed(2);
				}
			});

			$scope.reservationData.rooms[index] = room;

			//comment box will appear in every box
			$scope.saveCommentAgainstRateChange ();


			if ($scope.reservationData.isHourly && !$stateParams.id) {
				$scope.computeHourlyTotalandTaxes();
			} else {
				$scope.computeTotalStayCost();
			}

			if ($stateParams.id) { // IN STAY CARD .. Reload staycard
				$scope.saveReservation('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": getReservationID(),
					"confirmationId": getConfirmationNumber(),
					"isrefresh": false
				});
			} else {
				$scope.saveReservation('', '', index);
			}
			$scope.closeDialog();
		};

		$scope.pastDay = function(date) {
			return tzIndependentDate($rootScope.businessDate) > new tzIndependentDate(date);
		};

	}
]);