sntZestStation.controller('zsEmailBillCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsUtilitySrv',
	'zsCheckoutSrv',
	'zsGeneralSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsUtilitySrv, zsCheckoutSrv, zsGeneralSrv) {

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
			$scope.printOpted = $stateParams.printopted === 'true';
			//if user already has email provide two options
			//else prompt for email entry
			$scope.mode = !!$scope.email ? "EMAIL_BILL_GUEST_OPTIONS" : "EMAIL_BILL_EDIT_MODE";
			if ($scope.mode === 'EMAIL_BILL_EDIT_MODE'){
				$scope.focusInputField("email_text");
			};

		}();

		$scope.editEmailAddress = function() {
			$scope.mode = "EMAIL_BILL_EDIT_MODE";
			$scope.focusInputField("email_text");
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


		$scope.goToNextScreen = function() {
			$scope.callBlurEventForIpad();
			$scope.emailSendingFailed = true;
			$scope.mode = 'GUEST_BILL_EMAIL_SENT';
		};

		$scope.sendEmail = function() {
			$scope.callBlurEventForIpad();
			//future story, add black-list check here

			var sendBillSuccess = function(response) {
				$scope.emailSent = true;
				$scope.mode = 'GUEST_BILL_EMAIL_SENT';
			};
			var sendBillFailure = function(response) {
				$scope.emailSendingFailed = true;
				$scope.mode = 'GUEST_BILL_EMAIL_SENT';
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


		var checkIfEmailIsBlacklisted = function(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure) {
			var blacklistCheckOptions = {
				params: {
					'email': $scope.email
				},
				successCallBack: function(data) {
					//onSuccess, 
					if (!data.black_listed_email) {
						afterBlackListValidation();

					} else {
						console.warn('email is black listed, request different email address');
						onBlackListedEmailFound();
					};
				},
				failureCallBack: onValidationAPIFailure
			};
			$scope.callAPI(zsGeneralSrv.emailIsBlackListed, blacklistCheckOptions);
		}

		var callSaveEmail = function() {
			$scope.callBlurEventForIpad();

			var afterBlackListValidation = function() {
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

			var onBlackListedEmailFound = function() {
				$scope.emailError = true;
				$scope.focusInputField("email_text");
			};
			var onValidationAPIFailure = function() {
				updateGuestEmailFailed();
			};
			//
			//future story, enable black-list check here
			//
			//checks if new email is blacklisted, if so, set invalid email mode
			//otherwise, continue updating guest email
			//checkIfEmailIsBlacklisted(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure);
			afterBlackListValidation();


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
				if (zsUtilitySrv.isValidEmail($scope.email)) {
					callSaveEmail();
				} else {
					$scope.emailError = true;
					$scope.callBlurEventForIpad();
				}
			}
		};

		$scope.reTypeEmail = function() {
			$scope.editEmailAddress();
			$scope.emailError = false;
		};

	}
]);