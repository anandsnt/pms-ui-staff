sntZestStation.controller('zsEmailBillCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsUtilitySrv',
	'zsCheckoutSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsUtilitySrv, zsCheckoutSrv) {

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.email = $stateParams.email;
			$scope.printOpted = $stateParams.printopted;
			$scope.mode = !!$scope.email ? "email-guest-options" : "email-edit-mode";

		}();
		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.checkoutReservationBill');
		});

		$scope.editEmailAddress = function() {
			$scope.mode = "email-edit-mode";
		};

		$scope.navToHome = function() {
			$state.go('zest_station.home');
		};

		/**
		 *  general failure actions
		 **/
		var failureCallBack = function() {
			//if key card was inserted we need to eject that
			if ($scope.zestStationData.keyCardInserted) {
				$scope.socketOperator.EjectKeyCard();
			};
			$state.go('zest_station.speakToStaff');
		};
		/**
		 *  Checkout the Guest
		 */
		var checkOutGuest = function() {
			var params = {
				"reservation_id": $scope.reservation_id,
				"is_kiosk": true
			};
			var checkOutSuccess = function() {
				$scope.mode = 'email-sent-to-guest';
			};
			var options = {
				params: params,
				successCallBack: checkOutSuccess,
				failureCallBack: failureCallBack
			};
			$scope.callAPI(zsCheckoutSrv.checkoutGuest, options);
		};


		$scope.goToNextScreen = function() {
			checkOutGuest();
		};

		$scope.sendEmail = function() {

			var sendBillSuccess = function(response) {
				$scope.emailSent = true;
				checkOutGuest();
			};
			var sendBillFailure = function(response) {
				$scope.emailSendingFailed = true;
				checkOutGuest();
			};

			var params = {
				reservation_id: $stateParams.reservation_id,
				bill_number: "1"
			};
			var options = {
				params: params,
				successCallBack: sendBillSuccess,
				failureCallBack: sendBillFailure
			};
			$scope.callAPI(zsCheckoutSrv.sendBill, options);
		};

		var callSaveEmail = function() {
			var params = {
				"guest_detail_id": $stateParams.guest_detail_id,
				"email": $scope.email
			};
			var emailSaveSuccess = function() {
				$scope.mode = "email-guest-options";
			};
			var options = {
				params: params,
				successCallBack: emailSaveSuccess,
				failureCallBack: failureCallBack
			};
			$scope.callAPI(zsCheckoutSrv.saveEmail, options);
		};

		/**
		 * [saveEmail to save the email to the reservation]
		 * @return {[type]} [description]
		 */
		$scope.saveEmail = function() {
			if ($scope.email.length === 0) {
				return;
			} else {
				// check if email is valid
				zsUtilitySrv.isValidEmail($scope.email) ? callSaveEmail() : $scope.emailError = true;
			}
		};

		$scope.reTypeEmail = function() {
			$scope.mode = "email-edit-mode";
			$scope.emailError = false;
		};

	}
]);