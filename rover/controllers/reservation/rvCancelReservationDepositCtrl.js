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