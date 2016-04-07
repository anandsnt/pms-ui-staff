sntZestStation.controller('zsOwsMsgListingCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams', 'zsTabletSrv', '$rootScope', '$window',
	function($scope, $state, zsEventConstants, $stateParams, zsTabletSrv, $rootScope, $window) {

		BaseCtrl.call(this, $scope);

		var printActions = function() {
			//emit this to paretnt ctrl to show in print
			$rootScope.currentOwsMessage = $scope.currentOwsMessage;

			setBeforePrintSetup();
			// add the orientation
			addPrintOrientation();

			var onPrintSuccess = function(){
				//do nothing for now
			};
			var onPrintError = function(){
				//do nothing for now
			};

			/*
			 *	======[ READY TO PRINT ]======
			 */
			setTimeout(function() {
				if (sntapp.cordovaLoaded) {
					var printer = (sntZestStation.selectedPrinter);
					cordova.exec(
						onPrintSuccess(), //print complete, should go to final screen
						onPrintError(), //if print error, inform guest there was an error
						'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
				} else {
					$window.print();
				}
			}, 100);

			/*
			 *	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
			 */
			setTimeout(function() {
				removePrintOrientation();
				$scope.runDigestCycle();
			}, 100);
		};

		var init = function() {

			var showEmailButton = function() {
				//check if reservation had email id
				$scope.showEmailButton = ($scope.selectedReservation.guest_details[0].email !== 'zak@stayntouch.com') ? true : false;
			};

			var onOwsMsgFetchSuccess = function(response) {
				$scope.owsMessages = response.messages;
				if ($scope.owsMessages.length > 0) {
					//popup in zeststation was implemented in other way, not using ngdialog
					//open popup only if there are any OWS messages
					$scope.owsMsgOpenPoup =  true;
					//select first message
					$scope.currentOwsMessage = $scope.owsMessages[0].message;
					var selectedOwsMessageIndex = 0;
					//on reaching last message, we need to show exit button
					$scope.isLastOwsMsg = $scope.owsMessages.length === 1 ? true : false;
					//set page number
					var setPageNumber = function() {
						$scope.currentpageNumber = selectedOwsMessageIndex + 1;
					};
					var checkifItsLastOwsMsg = function() {
						$scope.isLastOwsMsg = (selectedOwsMessageIndex + 1 === $scope.owsMessages.length) ? true : false;
					};

					setPageNumber();
					showEmailButton();

					//load next ows message
					$scope.loadNextOwsMsg = function() {
						selectedOwsMessageIndex++;
						setPageNumber();
						$scope.currentOwsMessage = $scope.owsMessages[selectedOwsMessageIndex].message;
						checkifItsLastOwsMsg();
					};
					//print action
					$scope.printOwsMsg = function() {
						printActions();
					};
					//email the message to the guest
					$scope.emailOwsMsg = function() {
						var options = {
						params: {
							"message_id" : $scope.owsMessages[selectedOwsMessageIndex].id,
							"reservation_id": $state.selectedReservation.id // again a $state !...can't help it
						}
					};
					$scope.callAPI(zsTabletSrv.sendOWSMsgAsMail, options);
					};

					$scope.closePopup = function() {
						$scope.owsMsgOpenPoup = false;

					};
				} else {
					return;
				};

			};

			var fetchOwsMessages = function() {
				$scope.owsMsgOpenPoup =  false;
				var options = {
					params: {
						"reservation_id": $state.selectedReservation.id // again a $state !...can't help it
					},
					successCallBack: onOwsMsgFetchSuccess
				};
				$scope.callAPI(zsTabletSrv.fetchOwsMessage, options);

			}();

		}();

	}
]);