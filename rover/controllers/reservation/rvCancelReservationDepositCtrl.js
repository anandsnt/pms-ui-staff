sntRover.controller('RVCancelReservationDepositController', ['$rootScope', '$scope','ngDialog','$stateParams','$state','RVReservationCardSrv','RVPaymentSrv','$timeout','$filter',
	function($rootScope, $scope,ngDialog,$stateParams,$state,RVReservationCardSrv,RVPaymentSrv,$timeout,$filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = "";	
	
		$scope.cancellationData = {
			selectedCard: -1,
			reason: "",
			viewCardsList: false,
			existingCard: false,
			cardId: ""
		}

		// CICO-9457 : Data for fees details.
		$scope.setupFeeData = function(){
			$scope.feeData = {};
			var feesInfo = $scope.depositBalanceData.data.selected_payment_fees_details;
			var zeroAmount = parseFloat("0.00").toFixed(2);
			var defaultAmount = $scope.ngDialogData.penalty ?
			 	$scope.ngDialogData.penalty : zeroAmount;
			console.log("feesInfo :");console.log(feesInfo);
			if(typeof feesInfo != 'undefined' && feesInfo!= null){
				
				var amountSymbol = feesInfo.amount_symbol;
				var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount).toFixed(2) : zeroAmount;
				$scope.feeData.actualFees = feesAmount;
				
				if(amountSymbol == "%") $scope.calculateFee();
				else{
					$scope.feeData.calculatedFee = feesAmount;
					$scope.feeData.totalOfValueAndFee = parseFloat(parseFloat(feesAmount) + parseFloat(defaultAmount)).toFixed(2);
				}
			}
			else{
				$scope.feeData.actualFees = zeroAmount;
				$scope.feeData.calculatedFee = zeroAmount;
				$scope.feeData.totalOfValueAndFee = zeroAmount;
			}
		}
		// CICO-9457 : Data for fees details - standalone only.	
		if($scope.isStandAlone)	$scope.setupFeeData();

		var cancelReservation = function(cancellationParameters) {
			var onCancelSuccess = function(data) {
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $stateParams.id,
					"confirmationId": $stateParams.confirmationId,
					"isrefresh": false
				});
				$scope.closeDialog();
				$scope.$emit('hideLoader');
			}
			$scope.invokeApi(RVReservationCardSrv.cancelReservation, cancellationParameters, onCancelSuccess);
		}

		//scroller options
		$scope.setScroller('cardsList');

		var refreshCardsList = function() {
			$timeout(function() {
				$scope.refreshScroller('cardsList');
			}, 300)
		}

		var onFetchPaymentsSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.cardsInPaymentMethods = _.where(data.existing_payments, {
				is_credit_card: true
			});
			if ($scope.cardsInPaymentMethods.length > 0) {
				$scope.ngDialogData.cards = true;
				$scope.cancellationData.viewCardsList = true;
				refreshCardsList();
				$scope.ngDialogData.state = 'REFUND';
			}
			else{
				is_credit_card: false;
				$scope.ngDialogData.state = 'CONFIRM';
				$scope.errorMessage = [$filter('translate')('CREDIT_CARD_LIST_EMPTY_ERROR')];
			}
		}

		$scope.applyRefund = function(){

			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				id: $scope.reservationData.reservation_card.reservation_id,
				payment_method_id: parseInt($scope.cancellationData.selectedCard) == -1 ? null : parseInt($scope.cancellationData.selectedCard),
				with_deposit_refund:true
			};

			$scope.errorMessage = [];
			if ($scope.cancellationData.viewCardsList) {
				cancelReservation(cancellationParameters);
			}
		};

		$scope.proceedWithDepositRefund = function(){
		
			var reservationId = $stateParams.id;
			$scope.invokeApi(RVPaymentSrv.getPaymentList, reservationId, onFetchPaymentsSuccess);
		};

		$scope.proceedWithOutDepositRefund = function(){
			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				id: $scope.reservationData.reservation_card.reservation_id,
				with_deposit_refund:false
			};
			cancelReservation(cancellationParameters);
		};

		$scope.closeDialog = function(){
			ngDialog.close();
		};

}]);