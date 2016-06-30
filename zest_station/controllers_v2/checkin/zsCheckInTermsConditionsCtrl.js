sntZestStation.controller('zsCheckInTermsConditionsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'zsEventConstants',
	'zsCheckinSrv',
	'$stateParams',
	'$timeout',
	'$sce',
	function($scope, $rootScope, $state, $stateParams, zsEventConstants, zsCheckinSrv, $stateParams, $timeout, $sce) {

		/**********************************************************************************************
		 **		Please note that, not all the stateparams passed to this state will not be used in this state, 
		 **      however we will have to pass this so as to pass again to future states which will use these.
		 **
		 **      Expected state params -----> reservation_id,  first_name, guest_id ,payment_type_id
		 **       ,deposit_amount , guest_email_blacklisted, room_no, room_status and email           
		 **      Exit function -> updateComplete                             
		 **                                                                       
		 ***********************************************************************************************/

		BaseCtrl.call(this, $scope);

		var init = function() {
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				$state.go('zest_station.checkInReservationDetails', $stateParams);
			});
			//starting mode
			$scope.mode = "TERMS_CONDITIONS";

		};


		var goToDepositScreen = function() {
			console.warn('to deposit screen: ', $stateParams.first_name);
			$state.go('zest_station.checkInDeposit', {
				'guest_email': $stateParams.guest_email,
				'guest_email_blacklisted': $stateParams.guest_email_blacklisted,
				'payment_type_id': $stateParams.payment_type_id,
				'deposit_amount': $stateParams.deposit_amount,
				'first_name': $stateParams.first_name,
				'room_no': $stateParams.room_no,
				'room_status': $stateParams.room_status,
				'reservation_id': $stateParams.reservation_id,
				'guest_id': $stateParams.guest_id,
				'mode': 'DEPOSIT',
				'balance_amount': $stateParams.balance_amount,
				'confirmation_number': $stateParams.confirmation_number,
				'pre_auth_amount_at_checkin': $stateParams.pre_auth_amount_at_checkin,
				'authorize_cc_at_checkin': $stateParams.authorize_cc_at_checkin
			});
		};
		var goToSignaturePage = function() {
			console.warn('current state params: @ ', $state.current.name, $stateParams);
			var stateParams = {
				'email': $stateParams.guest_email,
				'reservation_id': $stateParams.reservation_id,
				'room_no': $stateParams.room_no,
				'guest_id': $stateParams.guest_id,
				'first_name': $stateParams.first_name,
				'guest_email_blacklisted': $stateParams.guest_email_blacklisted
			};
			$state.go('zest_station.checkInSignature', stateParams);
		};
		var depositAmount = function() {
			if ($stateParams.deposit_amount) {
				return Math.ceil(parseFloat($stateParams.deposit_amount));
			} else {
				return 0;
			}
		};
		var depositRequired = function() {
			console.log('$scope.zestStationData.enforce_deposit: ', $scope.zestStationData.enforce_deposit)
			console.log('depositAmount: ', depositAmount())
			return ($scope.zestStationData.enforce_deposit && depositAmount() > 0);
		};
		var goToCreditCardAuthScreen = function() {
			var stateParams = {
				'reservation_id': $stateParams.reservation_id,
				'guest_email': $stateParams.guest_email,
				'guest_email_blacklisted': $stateParams.guest_email_blacklisted,
				'payment_type_id': $stateParams.payment_type_id,
				'deposit_amount': $stateParams.deposit_amount,
				'room_no': $stateParams.room_no,
				'room_status': $stateParams.room_status,
				'id': $stateParams.reservation_id,
				'confirmation_number': $stateParams.confirmation_number,
				'guest_id': $stateParams.guest_id,
				'first_name': $stateParams.first_name,
				'mode': 'CREDIT_CARD_AUTH',
				'balance_amount': $stateParams.balance_amount,
				'pre_auth_amount_at_checkin': $stateParams.pre_auth_amount_at_checkin,
				'authorize_cc_at_checkin': $stateParams.authorize_cc_at_checkin
			};
			$state.go('zest_station.checkInCardSwipe', stateParams);
		};

		var nextPageActions = function(byPassCC) {
			var deposit = depositRequired();
			var needToAddCC = true; //to be done
			if (deposit) {
				goToDepositScreen();
			} else if (!byPassCC) {
				goToCreditCardAuthScreen();
			} else {
				goToSignaturePage();
			}
		};

		var checkIfNeedToSkipCC = function(showDeposit) {

			var checkIfCCToBeBypassed = function(response) {
				//1. If Routing is setup, bypass the credit card collection screen.
				//2. If guest has $0 balance  AND there are no other Bill Windows present, 
				//bypass the credit card collection screen
				//3. If guest payment type is PP - Pre Payment or DB - Direct Bill, 
				//bypass the credit card collection screen
				//4. if No Routing and balance > 0, credit card prompt like normal.
				return response.routing_setup_present ||
					(parseInt($stateParams.balance_amount) === 0 && response.no_of_bill_windows === 1) ||
					(response.paymenet_type === "PP" || response.paymenet_type === "DB");
			};
			var onSuccess = function(response) {
				var byPassCC = (checkIfCCToBeBypassed(response)) ? true : false;
				nextPageActions(byPassCC);
			};
			//states are not to store varaiable, use service
			var options = {
				params: {
					"reservation_id": $stateParams.reservation_id
				},
				successCallBack: onSuccess
			};
			if ($scope.zestStationData.bypass_cc_for_prepaid_reservation) {
				$scope.callAPI(zsCheckinSrv.fetchReservationBalanceDetails, options);
			} else {
				var byPassCC = false;
				nextPageActions(byPassCC);
			};

		};
		/**
		 * [agreeTerms description]
		 *  on clicking agree, we will check if CC need to be skipped
		 */
		$scope.agreeTerms = function() {
			checkIfNeedToSkipCC();
		};
		/**
		 * [initiateTermsAndConditions description]
		 * @return {[type]} [description]
		 */
		var initiateTermsAndConditions = function() {
			$scope.setScroller('terms');
			setDisplayContentHeight(); //utils function
			var refreshScroller = function() {
				$scope.refreshScroller('terms');
			};
			$timeout(function() {
				refreshScroller();
			}, 600);
		};

		//Based Upon Admin Setting need to skip displaying
		//terms and conditions
		if (!$scope.zestStationData.kiosk_display_terms_and_condition) {
			$scope.agreeTerms();
		} else {
			init();
			initiateTermsAndConditions();
		}
	}
]);