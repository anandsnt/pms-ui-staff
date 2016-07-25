sntRover.controller('rvReservationPendingDepositController', ['$rootScope', '$scope', '$stateParams', '$timeout',
	'RVReservationCardSrv', '$state', '$filter', 'ngDialog', 'rvPermissionSrv',
	function($rootScope, $scope, $stateParams, $timeout,
		RVReservationCardSrv, $state, $filter, ngDialog, rvPermissionSrv) {

		BaseCtrl.call(this, $scope);

		var init = function(){
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
			$scope.billNumber = "1";//set bill no as 1
			$scope.firstName = (typeof $scope.passData.details.firstName ==="undefined")?"":$scope.passData.details.firstName;
			$scope.lastName = (typeof $scope.passData.details.lastName ==="undefined")?"":$scope.passData.details.lastName;

		
			$scope.isReservationRateSuppressed = $scope.reservationData.reservation_card.is_rate_suppressed_present_in_stay_dates;
			$scope.paymentType = ($scope.reservationData.reservation_card.payment_method_used) ? $scope.reservationData.reservation_card.payment_method_used : "";
			$scope.isDepositEditable = ($scope.depositDetails.deposit_policy.allow_deposit_edit !== null && $scope.depositDetails.deposit_policy.allow_deposit_edit) ? true : false;
			$scope.depositPolicyName = $scope.depositDetails.deposit_policy.description;
			$scope.depositAmount = parseFloat($scope.depositDetails.deposit_amount).toFixed(2);
		}();
		


		var closeDepositPopup = function() {
			$scope.$emit("UPDATE_STAY_CARD_DEPOSIT_FLAG", false);
			//to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
			$timeout(function() {
				ngDialog.close();
			}, 250);

		};
		
		$scope.hasPermissionToMakePayment = function() {
			return rvPermissionSrv.getPermissionValue('MAKE_PAYMENT');
		};

		$scope.proceedCheckin = function() {
			$scope.$emit("PROCEED_CHECKIN");
			$scope.closeDialog();	
		};

		$scope.tryAgain = function() {
			$scope.errorOccured = false;
			$scope.errorMessage = "";
			$scope.errorOccured = false;
		};
		/***************** Events From Payment Module ************************/

		$scope.$on("ERROR_OCCURED",function(event,data){
			//TODO: fix issue with error msg not been shown
			
			$timeout(function() {
				//provide some delay to deal with clearErrorMessage function
				$scope.errorMessage = data;
				$scope.runDigestCycle();
			}, 500);
			console.log($scope.errorMessage);
		});

		$scope.$on('CLOSE_DIALOG',function(){
			closeDepositPopup();
		});
		//user selected pay later option
		$scope.$on('PAY_LATER',function(){
			if($scope.depositDetails.isFromCheckin){
				$scope.$emit("PROCEED_CHECKIN");
			}
			else{
				//do nothing
			};
			closeDepositPopup();
		});

		//payment success
		$scope.$on('PAYMENT_SUCCESS',function(event,data){
			$scope.depositPaidSuccesFully = true;
			$scope.depositAmount =  data.amountPaid;
			$scope.feePaid = data.feePaid;
			$scope.authorizationCode = data.authorizationCode;
			
			//update amounts in STAYCARD
		    $scope.$parent.reservationData.reservation_card.deposit_attributes.outstanding_stay_total = data.reservation_balance;
			
			$scope.$parent.reservationData.reservation_card.balance_amount = data.reservation_balance;
			
			//if the existing payment method is not CC or Direct BIll and the selected payment method is CC
			//The submit payment will update the payment type for the bill #1(staycard too)
			if($scope.$parent.reservationData.reservation_card.payment_method_used !== 'CC'
			   && $scope.$parent.reservationData.reservation_card.payment_method_used !== 'DB'
			   && typeof data.cc_details !=="undefined"){
				$scope.$parent.reservationData.reservation_card.payment_method_used = 'CC';
				$scope.$parent.reservationData.reservation_card.payment_details.card_number = data.cc_details.ending_with;
				$scope.$parent.reservationData.reservation_card.payment_details.card_expiry = data.cc_details.expiry_date;
				$scope.$parent.reservationData.reservation_card.payment_details.card_type_image = 'images/'+data.cc_details.card_code+'.png';
			};
			//TO DO: Add to guestcard
		});

		//payment failed
		$scope.$on('PAYMENT_FAILED',function(event,errorMessageArray){
			$scope.errorOccured = true;
			$scope.paymentErrorMessage = errorMessageArray[0];
		});
	}
]);