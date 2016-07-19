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

		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};

		$scope.errorMessage = "";
		$scope.depositPaidSuccesFully = false;
		$scope.successMessage = "";
		$scope.authorizedCode = "";

		$scope.depositData = {};
		$scope.isReservationRateSuppressed = $scope.reservationData.reservation_card.is_rate_suppressed_present_in_stay_dates;
		$scope.depositData.paymentType = ($scope.reservationData.reservation_card.payment_method_used) ? $scope.reservationData.reservation_card.payment_method_used : "";
		$scope.isDepositEditable = ($scope.depositDetails.deposit_policy.allow_deposit_edit !== null && $scope.depositDetails.deposit_policy.allow_deposit_edit) ? true : false;
		$scope.depositPolicyName = $scope.depositDetails.deposit_policy.description;

		$scope.reservationData = {};
		$scope.reservationData.referanceText = "";
		$scope.reservationData.depositAmount = parseFloat($scope.depositDetails.deposit_amount).toFixed(2);

		$scope.closeDepositPopup = function() {
			$scope.$emit("UPDATE_STAY_CARD_DEPOSIT_FLAG", false);
			//to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
			$timeout(function() {
				ngDialog.close();
			}, 250);

		};
		/**
		 * function to check whether the user has permission
		 * to make payment
		 * @return {Boolean}
		 */
		$scope.hasPermissionToMakePayment = function() {
			return rvPermissionSrv.getPermissionValue('MAKE_PAYMENT');
		};

		$scope.proceedCheckin = function() {
			if($scope.depositDetails.$parent.isFromCheckin){
				$scope.$emit("PROCEED_CHECKIN");
			}
			else{
				//do nothing
			};
			$scope.closeDialog();	
		};

		$scope.tryAgain = function() {
			$scope.depositInProcess = false;
			$scope.errorMessage = "";
			$scope.errorOccured = false;
		};
	}
]);