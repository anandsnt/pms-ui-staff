sntZestStation.controller('zsEmailBillCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsUtilitySrv',
	'zsCheckoutSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsUtilitySrv, zsCheckoutSrv) {

		/***********************************************************************************************
		**		Expected state params -----> printopted, reservation_id, email and guest_detail_id			  
		**		Exit functions -> checkOutSuccess							
		**																		 
		************************************************************************************************/


		/** MODES in the screen
		*   1.EMAIL_BILL_GUEST_OPTIONS --> two options - send email and edit email
		*   2.EMAIL_BILL_EDIT_MODE --> email entry mode
		*   3.GUEST_BILL_EMAIL_SENT --> checked out and mail has been sent/mail sending failed
		*   4.emailError --> invalid email
		**/

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			BaseCtrl.call(this, $scope);
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.email = $stateParams.email;
			//check if print was done
			$scope.printOpted = $stateParams.printopted;
			//if user already has email provide two options
			//else prompt for email entry
			$scope.mode = !!$scope.email ? "EMAIL_BILL_GUEST_OPTIONS" : "EMAIL_BILL_EDIT_MODE";

		}();

		$scope.editEmailAddress = function() {
			$scope.mode = "EMAIL_BILL_EDIT_MODE";
		};

		$scope.navToHome = function() {
			$state.go('zest_station.home');
		};

		/**
		 *  general failure actions
		 **/
		var failureCallBack = function() {
			//if key card was inserted we need to eject that
			$scope.$emit('EJECT_KEYCARD');
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
				$scope.mode = 'GUEST_BILL_EMAIL_SENT';
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
				$scope.mode = "EMAIL_BILL_GUEST_OPTIONS";
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
			$scope.mode = "EMAIL_BILL_EDIT_MODE";
			$scope.emailError = false;
		};

	}
]);