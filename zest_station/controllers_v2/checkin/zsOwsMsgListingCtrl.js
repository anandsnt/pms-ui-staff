sntZestStation.controller('zsOwsMsgListingCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams', 'zsCheckinSrv', '$rootScope', '$window', 'zsUtilitySrv', 'zsReceiptPrintHelperSrv',
	function($scope, $state, zsEventConstants, $stateParams, zsCheckinSrv, $rootScope, $window, zsUtilitySrv, zsReceiptPrintHelperSrv) {

		/** ********************************************************************************************
		 **      Expected state params -----> guest_id    
		 **      Exit function -> closePopup                              
		 **                                                                       
		 ***********************************************************************************************/


		BaseCtrl.call(this, $scope);
		$scope.owsMessages = JSON.parse($stateParams.ows_msgs);
		$scope.mode = "VIEW_MSG_MODE";


		var checkIfEmailIsBlackListedOrValid = function() {
			return (!_.isNull($stateParams.email) && $stateParams.email.length > 0 && !($stateParams.guest_email_blacklisted === 'true') && zsUtilitySrv.isValidEmail($stateParams.email));
		};

		/**
		 * [afterGuestCheckinCallback description]
		 * @param  {[type]} response [description]
		 * @return {[type]}          [description]
		 */
		$scope.nextPageActions = function() {
			// if email is valid and is not blacklisted
			var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid(),
				collectNationalityEnabled = $scope.zestStationData.check_in_collect_nationality;

			var stateParams = $stateParams;

			// if collectiing nationality after email, but email is already valid
			if (collectNationalityEnabled && haveValidGuestEmail) {
				$state.go('zest_station.collectNationality', stateParams);

			} else if (haveValidGuestEmail) {
				stateParams.email = $stateParams.email;
				$state.go('zest_station.checkinKeyDispense', stateParams);
			} else {
				$state.go('zest_station.checkInEmailCollection', stateParams);
			}

		};

		var printActions = function() {
			// emit this to paretnt ctrl to show in print
			$rootScope.currentOwsMessage = $scope.currentOwsMessage;

			setBeforePrintSetup();
			// add the orientation
			addPrintOrientation();

			var onPrintSuccess = function() {
				// do nothing for now
			};
			var onPrintError = function() {
				// do nothing for now
			};

			/*
			 *	======[ READY TO PRINT ]======
			 */
			setTimeout(function() {
				if ($scope.isIpad && typeof cordova !== typeof undefined) { // CICO-40934 removed the sntapp load from zestJsAssetList, now just check for ipad/iphone
					var receiptPrinterParams = zsReceiptPrintHelperSrv.setUpOwsMessageForReceiptPrinter($scope.currentOwsMessage, $scope.zestStationData);

					if ($scope.zestStationData.zest_printer_option === 'RECEIPT') {
						cordova.exec(
							onPrintSuccess,
							function() {
								// To ensure the error message from receipt printer is not recorded,
                                //  we will show our generic print error message
								onPrintError();
							},
							'RVCardPlugin',
							'printReceipt',
							[ receiptPrinterParams ]);
					} else {
						cordova.exec(
							onPrintSuccess,
							onPrintError,
							'RVCardPlugin',
							'printWebView', ['filep', '1', $scope.zestStationData.defaultPrinter]);
					}

				} else {
					$window.print();
				}
			}, 100);

			/*
			 *	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
			 */
			setTimeout(function() {
				removePrintOrientation();
				$('.popup').show(); // show popup again
				$scope.runDigestCycle();
			}, 100);
		};

		$scope.viewMessages = function() {
			// open popup only if there are any OWS messages
			$scope.owsMsgOpenPoup = true;
			// select first message
			$scope.currentOwsMessage = $scope.owsMessages[0].message;
			var selectedOwsMessageIndex = 0;
			// on reaching last message, we need to show exit button

			$scope.isLastOwsMsg = $scope.owsMessages.length === 1;

			// set page number
			var setPageNumber = function() {
				$scope.currentpageNumber = selectedOwsMessageIndex + 1;
			};

			setPageNumber();

			$scope.currentpageNumber = selectedOwsMessageIndex + 1;

			var checkifItsLastOwsMsg = function() {
				$scope.isLastOwsMsg = (selectedOwsMessageIndex + 1 === $scope.owsMessages.length) ? true : false;
			};
			
			// check if reservation had email id
			$scope.showEmailButton = (!_.isNull($stateParams.email) && $stateParams.email.length > 0) ? true : false;

			// load next ows message
			$scope.loadNextOwsMsg = function() {
				selectedOwsMessageIndex++;
				setPageNumber();
				$scope.currentOwsMessage = $scope.owsMessages[selectedOwsMessageIndex].message;
				checkifItsLastOwsMsg();
			};
			// print action
			$scope.printOwsMsg = function() {
				printActions();
			};
			// email the message to the guest
			$scope.emailOwsMsg = function() {
				var options = {
					params: {
						"message_id": $scope.owsMessages[selectedOwsMessageIndex].id,
						"reservation_id": $stateParams.reservation_id
					}
				};

				$scope.callAPI(zsCheckinSrv.sendOWSMsgAsMail, options);
			};

			$scope.closePopup = function() {
				$scope.owsMsgOpenPoup = false;
				$scope.mode = "MSG_READ_MODE";
			};
		};


	}
]);