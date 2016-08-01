sntZestStation.controller('zsTermsConditionsCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce', '$timeout',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce, $timeout) {

		BaseCtrl.call(this, $scope);
		sntZestStation.filter('unsafe', function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		});
		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.reservation_details');
			//$state.go ('zest_station.home');//go back to reservation search results
		});

		$scope.navToPrev = function() {
			$scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
		};

		var goToNextPage =  function(showDeposit,byPassCC){
			$scope.hideKeyboardIfUp();
			if (showDeposit) {
				$state.go('zest_station.deposit_agree');//pay Deposit
			}
			else if(byPassCC)
			{
				$state.go('zest_station.card_sign');//skip CC
			}
			else {
				$state.go('zest_station.card_swipe');//swipe CC
			}
		};

		var checkIfNeedToSkipCC = function(showDeposit){

			var checkIfCCToBeBypassed = function(response){
				//1. If Routing is setup, bypass the credit card collection screen.
				//2. If guest has $0 balance on Window 1 AND there are no other Bill Windows present, 
				//bypass the credit card collection screen
				//3. If guest payment type is PP - Pre Payment or DB - Direct Bill, 
				//bypass the credit card collection screen
				//4. if No Routing and balance > 0, credit card prompt like normal.
				return response.routing_setup_present 
					||
					(parseInt(response.balance_in_window1) === 0 && response.no_of_bill_windows === 1)
					|| 
					(response.paymenet_type === "PP" ||  response.paymenet_type === "DB");
			};
			var onSuccess = function(response){
				$scope.zestStationData.byPassCC = false;
				if(checkIfCCToBeBypassed(response))
				{
					$scope.zestStationData.byPassCC =  true;
				}
				else{
					$scope.zestStationData.byPassCC =  false;
				}
				goToNextPage(showDeposit,$scope.zestStationData.byPassCC);
			};
			var selectedReservation = $state.selectedReservation; //this was set somewhere else.this needs to be changed
			//states are not to store varaiable, use service
			var options = {
                params:         {"reservation_id":selectedReservation.id},
                successCallBack: 	onSuccess
            };
            $scope.callAPI(zsTabletSrv.fetchReservationBalanceDetails, options);
		};

		$scope.agreeTerms = function() {
			var depositAmt, depositRemaining = 0,
				enforceDeposit = $scope.hotel_settings.enforce_deposit;
			if ($state.selectedReservation && $state.selectedReservation.reservation_details) {
				depositAmt = $state.selectedReservation.reservation_details.data.reservation_card.deposit_amount;
			}
			depositRemaining = parseInt(depositAmt);

			var showDeposit = false;
			if (depositRemaining > 0 && enforceDeposit) {
				showDeposit = true;
			}
			// need to change this $state and in  all other screens in zest station
			// this is not right way, but cant do much now as removing this may break 
			// something elsewhere. Need to find some way to fix this all asap
			$state.showDeposit = showDeposit;

			if($scope.zestStationData.bypass_cc_for_prepaid_reservation){
				checkIfNeedToSkipCC(showDeposit);
			}
			else{
				goToNextPage(showDeposit,false);
			};
		};
		$scope.setScroller('terms');

		var setTermsConditionsHeight = function() {
			if ($('#textual').length) {
				var $contentHeight = ($('#content').outerHeight()),
					$h1Height = $('#content h1').length ? $('#content h1').outerHeight(true) : 0,
					$h2Height = $('#content h2').length ? $('#content h2').outerHeight(true) : 0,
					$h3Height = $('#content h3').length ? $('#content h3').outerHeight(true) : 0,
					$headingsHeight = parseFloat($h1Height + $h2Height + $h3Height),
					$textualHeight = parseFloat($contentHeight - $headingsHeight);
				$('#textual').css('max-height', $textualHeight + 'px');
			}
		};
		var refreshScroller = function() {
			$scope.refreshScroller('terms');
		};

		$scope.init = function() {
			$scope.hotel_settings = $scope.zestStationData;
			if($scope.zestStationData.kiosk_display_terms_and_condition){
				$scope.at = 'terms-conditions';
				
				$scope.hotel_terms_and_conditions = $scope.zestStationData.hotel_terms_and_conditions;
				//fetch the idle timer settings
				$scope.currencySymbol = $scope.zestStationData.currencySymbol;

				setTermsConditionsHeight();
				$timeout(function() {
					refreshScroller();
				}, 600);
			}
			else{
				//byepass terms and conditions
				//this is implemented inside terms & conditions 
				//so as to avoid duplicate check for deposit collection,
				//CC bypass etc
				$scope.agreeTerms();
			};
			
		};

		/**
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

			$scope.init();
		}();



	}
]);