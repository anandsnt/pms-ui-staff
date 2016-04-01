sntZestStation.controller('zsOwsMsgListingCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams', 'zsTabletSrv', '$rootScope', '$window',
	function($scope, $state, zsEventConstants, $stateParams, zsTabletSrv, $rootScope, $window) {

		BaseCtrl.call(this, $scope);

		var printActions = function() {
			$rootScope.currentOwsMessage = $scope.currentOwsMessage;
			
			setBeforePrintSetup();
			// add the orientation
			addPrintOrientation();

			/*
			 *	======[ READY TO PRINT ]======
			 */
			setTimeout(function() {
				if (sntapp.cordovaLoaded) {
					var printer = (sntZestStation.selectedPrinter);
					cordova.exec(
						$scope.onPrintSuccess(), //print complete, should go to final screen
						$scope.onPrintError(), //if print error, inform guest there was an error
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
			}, 100);
		};

		var init = function() {
			//need to change to corresponding ctrler later
			var onOwsMsgFetchSuccess = function() {
				$scope.owsMessages = [{
					"id": "1",
					"message": "111going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum,  comes from a line in section 1.10.32."
				}, {
					"id": "2",
					"message": "22going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, comes from a line in section 1.10.32."
				}, {
					"id": "3",
					"message": "333going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, comes from a line in section 1.10.32."
				}];
				$scope.currentOwsMessage = $scope.owsMessages[0].message;
				var selectedOwsMessageIndex = 0;
				$scope.isLastOwsMsg = $scope.owsMessages.length === 1 ? true : false;
				$scope.owsMsgOpenPoup = $scope.owsMessages.length > 0 ? true : false; //popup in zeststation was implemented in other way, not using ngdialog
				var setPageNumber = function() {
					$scope.currentMessageNumber = selectedOwsMessageIndex + 1 + " of " + $scope.owsMessages.length; //text to diplay the current msg number
				};
				setPageNumber();
				var checkifItsLastOwsMsg = function() {
					$scope.isLastOwsMsg = (selectedOwsMessageIndex + 1 === $scope.owsMessages.length) ? true : false;
				};

				$scope.loadNextOwsMsg = function() {
					selectedOwsMessageIndex++;
					setPageNumber();
					$scope.currentOwsMessage = $scope.owsMessages[selectedOwsMessageIndex].message;
					checkifItsLastOwsMsg();
				};


				$scope.printOwsMsg = function() {
					printActions();
				};
				$scope.emailOwsMsg = function() {

				};

				$scope.closePopup = function() {
					$scope.owsMsgOpenPoup = false;

				};
			}

			var fetchOwsMessages = function() {
				onOwsMsgFetchSuccess();
			}();

		}();

	}
]);