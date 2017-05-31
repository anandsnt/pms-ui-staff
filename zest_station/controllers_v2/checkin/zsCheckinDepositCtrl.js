sntZestStation.controller('zsCheckinDepositCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$controller',
	'$timeout',
	'zsCheckinSrv',
	'zsModeConstants',
	'zsGeneralSrv',
	function($scope, $stateParams, $state, zsEventConstants, $controller, $timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv) {
		BaseCtrl.call(this, $scope);

		/** ********************************************************************************************
		 **      Please note that, not all the stateparams passed to this state will not be used in this state, 
		 **      however we will have to pass this so as to pass again to future states which will use these.
		 **       
		 **      Expected state params -----> mode, id, guest_id, swipe, guest_email, guest_email_blacklisted, 
		 **      room_no and room_status           
		 **      Exit function -> goToCardSign                              
		 **                                                                       
		 ***********************************************************************************************/


		$scope.proceedToDeposit = function() {
			var stateParams = {
				'mode': 'DEPOSIT',
				'swipe': 'true',
				'reservation_id': $stateParams.reservation_id,
				'room_no': $stateParams.room_no,
				'first_name': $stateParams.first_name,
				'room_status': $stateParams.room_status,
				'guest_id': $stateParams.guest_id,
				'guest_email': $stateParams.guest_email,
				'guest_email_blacklisted': $stateParams.guest_email_blacklisted,
				'balance_amount': $stateParams.balance_amount,
				'pre_auth_amount_for_zest_station': $stateParams.pre_auth_amount_for_zest_station,
				'authorize_cc_at_checkin': $stateParams.authorize_cc_at_checkin,
				'deposit_amount': $stateParams.deposit_amount,
				'confirmation_number': $stateParams.confirmation_number
			};
			// check if this page was invoked through pickupkey flow

			if (!!$stateParams.pickup_key_mode) {
				stateParams.pickup_key_mode = 'manual';
			}
			console.info('to card swipe ctrl params: ', stateParams);
			$state.go('zest_station.checkInCardSwipe', stateParams);
		};


		var init = (function() {
			$scope.currencySymbol = $scope.zestStationData.currencySymbol;
			$scope.depositAmount = $stateParams.deposit_amount;
			$scope.showSwipeNav = true;
			$scope.setScreenIcon('card');
		}());

		/**
		 * [initializeMe description]
		 */

		var initializeMe = (function() {
			BaseCtrl.call(this, $scope);
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			// back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				$state.go('zest_station.checkInReservationDetails', $stateParams);
			});

		}());

	}
]);