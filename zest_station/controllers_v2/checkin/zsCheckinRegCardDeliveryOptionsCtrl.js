sntZestStation.controller('zsCheckinRegCardDeliveryOptionsCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	'zsCheckinSrv',
	'zsUtilitySrv',
	'zsGeneralSrv',
	'$filter',
	'$timeout',
	'$window',
	function($scope, $state, zsEventConstants, $stateParams, zsCheckinSrv, zsUtilitySrv, zsGeneralSrv, $filter, $timeout, $window) {

		/**********************************************************************************************
		 **		Expected state params -----> reservation_id, room_no,  first_name, guest_id, key_success
		 *       and email			  
		 **		Exit function ->nextPageActions								
		 **																		 
		 ***********************************************************************************************/

		BaseCtrl.call(this, $scope);

		/**
		 * MODES IN THE SCREEN
		 * 1.EMAIL_ENTRY_MODE
		 * 2.EMAIL_INVLAID_MODE
		 * 3.DELIVERY_OPTIONS_MODE
		 * 4.EMAIL_SEND_MODE
		 */

		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			//back button action from email send mode page will
			//take to 2 options page
			$scope.mode = "DELIVERY_OPTIONS_MODE"; //hide back buttons in 2 options page
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
		});

		var generalError = function(response) {
			$scope.$emit('GENERAL_ERROR');
		};
		var nextPageActions = function(printopted, emailopted, actionStatus) {
			var stateParams = {
				key_success: $stateParams.key_success
			};
			if (printopted) {
				stateParams.print_opted = 'true';
				stateParams.print_status = actionStatus
			} else {
				stateParams.email_opted = 'true';
				stateParams.email_status = actionStatus
			}
			$state.go('zest_station.zsCheckinFinal', stateParams);
		};

		/**
		 * [clickedPrint description]
		 * @return {[type]} [description]
		 */
		$scope.clickedPrint = function() {
			var getTermsPrintable = function(terms) {
				sntZestStation.filter('unsafe', function($sce) {
					return function(terms) {
						return $sce.trustAsHtml(terms);
					};
				});
			};

			var printFailedActions = function() {
				if ($stateParams.key_success === "true") {
					$scope.zestStationData.workstationOooReason = $filter('translate')('CHECKIN_PRINT_FAIL');
				} else {
					$scope.zestStationData.workstationOooReason = $filter('translate')('CHECKIN_KEY_FAIL_PRINT_FAIL');
				};
				$scope.zestStationData.workstationStatus = 'out-of-order';
				var printopted = true;
				var emailopted = false;
				var actionStatus = 'failed';
				nextPageActions(printopted, emailopted, actionStatus);
			};
			var printSuccessActions = function() {
				var printopted = true;
				var emailopted = false;
				var actionStatus = 'success';
				nextPageActions(printopted, emailopted, actionStatus);
			}
			var handleBillPrint = function() {
				// add the orientation
				addPrintOrientation();
				setBeforePrintSetup();
				try {
					// this will show the popup with full bill
					$timeout(function() {
						/*
						 * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
						 */

						if (sntapp.cordovaLoaded) {
							var printer = (sntZestStation.selectedPrinter);
							cordova.exec(function(success) {
								printSuccessActions();
							}, function(error) {
								printFailedActions();
							}, 'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
						} else {
							$window.print();
							setTimeout(function() {
								printSuccessActions();
							}, 100);
						};
						// provide a delay for preview to appear 

					}, 100);
				} catch (e) {
					console.info("something went wrong while attempting to print--->" + e);
					printFailedActions();
				};
				setTimeout(function() {
					// CICO-9569 to solve the hotel logo issue
					$("header .logo").removeClass('logo-hide');
					$("header .h2").addClass('text-hide');

					// remove the orientation after similar delay
					removePrintOrientation();
				}, 100);
			};

			var fetchPrintViewCompleted = function(data) {
				var d = new Date();
				$scope.currentDateTime = d.getTime();
				$scope.$emit('hideLoader');
				// print section - if its from device call cordova.
				$scope.printRegCardData = data;
				$scope.departDate = $scope.printRegCardData.dep_date;
				$scope.departDate = $scope.returnDateObjBasedOnDateFormat($scope.printRegCardData.dep_date);
				$scope.printRegCardData.terms_conditions_html = getTermsPrintable($scope.printRegCardData.terms_conditions);
				handleBillPrint();
			};

			var options = {
				params: {
					'id': $stateParams.reservation_id,
					'application': 'ZEST_STATION'
				},
				successCallBack: fetchPrintViewCompleted,
				failureCallBack: printFailedActions
			}
			$scope.callAPI(zsCheckinSrv.fetchRegistrationCardPrintData, options);
		};
		/**
		 * [selectEmailDelivery description]
		 * @return {[type]} [description]
		 */
		$scope.selectEmailDelivery = function() {
			$scope.mode = "EMAIL_SEND_MODE";
			//show back buttons in email send mode page
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
		};
		/**
		 * [sendEmail description]
		 * @return {[type]} [description]
		 */
		$scope.sendEmail = function() {
			var registrationCardSendingFailed = function() {
				var printopted = false;
				var emailopted = true;
				var actionStatus = 'failed';
				nextPageActions(printopted, emailopted, actionStatus);
			};
			var registrationCardSent = function(response) {
				var printopted = false;
				var emailopted = true;
				var actionStatus = 'success';
				nextPageActions(printopted, emailopted, actionStatus);
			};

			var data = {
				'id': $stateParams.reservation_id,
				'application': 'ZEST_STATION'
			};

			var options = {
				params: {
					'id': $stateParams.reservation_id,
					'application': 'ZEST_STATION'
				},
				successCallBack: registrationCardSent,
				failureCallBack: registrationCardSendingFailed
			}
			$scope.callAPI(zsCheckinSrv.sendRegistrationByEmail, options);
		};

		/**
		 * [reEnterText description]
		 * @return {[type]} [description]
		 */
		$scope.editEmailAddress = function() {
			$scope.mode = "EMAIL_ENTRY_MODE";
		};
		/**
		 * [updateGuestEmail description]
		 * @return {[type]} [description]
		 */
		var updateGuestEmail = function() {
			var updateComplete = function(response) {
				$scope.mode = "EMAIL_SEND_MODE";
				$scope.callBlurEventForIpad();
				$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			};
			/**
			 * [updateGuestEmailFailed description]
			 * @return {[type]} [description]
			 */
			var updateGuestEmailFailed = function() {
				var stateParams = {};
				if ($scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2 !== '') {
					stateParams.message = $scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2;
				} else {
					//do nothing
				};
				$state.go('zest_station.speakToStaff', stateParams);
			}

			var options = {
				params: {
					'guest_id': $stateParams.guest_id,
					'email': $scope.email
				},
				successCallBack: updateComplete,
				failureCallBack: updateGuestEmailFailed
			}
			$scope.callAPI(zsGeneralSrv.updateGuestEmail, options);
		};
		/**
		 * [goToNext description]
		 *  save email
		 */
		$scope.goToNext = function() {
			var isValidEmail = $scope.email.length > 0 ? zsUtilitySrv.isValidEmail($scope.email) : false;
			if (isValidEmail) {
				updateGuestEmail();
			} else {
				$scope.mode = "EMAIL_INVLAID_MODE";
				$scope.callBlurEventForIpad();
			};
		};

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//show back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON); //hide back buttons in 2 options page
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			if ($stateParams.email) {
				$scope.email = $stateParams.email.length > 0 ? $stateParams.email : "";
			} else {
				$scope.email = "";
			}

			$scope.from = $stateParams.from;
			if ($scope.zestStationData.registration_card.auto_print) {
				$scope.clickedPrint();
			} else {
				
				$scope.mode = "DELIVERY_OPTIONS_MODE";
			}


		}();

	}
]);