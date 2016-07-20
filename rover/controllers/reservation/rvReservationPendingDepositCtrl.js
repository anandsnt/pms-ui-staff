sntRover.controller('rvReservationPendingDepositController', ['$rootScope', '$scope', '$stateParams', '$timeout',
	'RVReservationCardSrv', '$state', '$filter', 'ngDialog', 'rvPermissionSrv',
	function($rootScope, $scope, $stateParams, $timeout,
		RVReservationCardSrv, $state, $filter, ngDialog, rvPermissionSrv) {

		BaseCtrl.call(this, $scope);

		//adding a flag to be set after some timeout to remove flickering action in iPad
		$scope.pageloadingOver = false;
		$timeout(function() {
			$scope.pageloadingOver = true;
		}, 3000);

		
		$scope.reservationId = $stateParams.id;
		$scope.errorMessage = "";
		$scope.depositPaidSuccesFully = false;
		$scope.successMessage = "";
		$scope.authorizedCode = "";

	
		$scope.isReservationRateSuppressed = $scope.reservationData.reservation_card.is_rate_suppressed_present_in_stay_dates;
		$scope.paymentType = ($scope.reservationData.reservation_card.payment_method_used) ? $scope.reservationData.reservation_card.payment_method_used : "";
		$scope.isDepositEditable = ($scope.depositDetails.deposit_policy.allow_deposit_edit !== null && $scope.depositDetails.deposit_policy.allow_deposit_edit) ? true : false;
		$scope.depositPolicyName = $scope.depositDetails.deposit_policy.description;
		$scope.depositAmount = parseFloat($scope.depositDetails.deposit_amount).toFixed(2);


		var closeDepositPopup = function() {
			$scope.$emit("UPDATE_STAY_CARD_DEPOSIT_FLAG", false);
			//to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
			$timeout(function() {
				ngDialog.close();
			}, 250);

		};

		$scope.$on('PAY_LATER',function(){
			if($scope.depositDetails.isFromCheckin){
				$scope.$emit("PROCEED_CHECKIN");
			}
			else{
				//do nothing
			};
			closeDepositPopup();
		});
		
		$scope.hasPermissionToMakePayment = function() {
			return rvPermissionSrv.getPermissionValue('MAKE_PAYMENT');
		};

		$scope.proceedCheckin = function() {
			$scope.$emit("PROCEED_CHECKIN");
			$scope.closeDialog();	
		};

		$scope.tryAgain = function() {
			$scope.depositInProcess = false;
			$scope.errorMessage = "";
			$scope.errorOccured = false;
		};
	}
]);