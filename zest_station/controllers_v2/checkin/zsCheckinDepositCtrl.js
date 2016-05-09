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

		/**********************************************************************************************
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
				'id': $stateParams.reservation_id,
				'room_no': $stateParams.room_no,
				'room_status': $stateParams.room_status,
				'guest_email': $stateParams.guest_email,
				'guest_email_blacklisted': $stateParams.guest_email_blacklisted
			}
			$state.go('zest_station.checkInCardSwipe', stateParams);
		};



		var init = function() {
			$scope.currencySymbol = $scope.zestStationData.currencySymbol;
			$scope.depositAmount = $stateParams.deposit_amount;
			$scope.showSwipeNav = true;
		}();

		/**
		 * [initializeMe description]
		 */

		var initializeMe = function() {
			BaseCtrl.call(this, $scope);
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

		}();

	}
]);