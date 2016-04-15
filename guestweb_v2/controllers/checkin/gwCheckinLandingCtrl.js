/**
 *	This is used when users invokes guestweb from the mail received.
 **/
sntGuestWeb.controller('gwCheckinLandingCtrlController', ['$scope', '$state', '$controller', 'GwCheckinSrv', 'GwWebSrv', '$filter', '$rootScope', '$modal',
	function($scope, $state, $controller, GwCheckinSrv, GwWebSrv, $filter, $rootScope, $modal) {

		$controller('BaseController', {
			$scope: $scope
		});

		var init = function() {
			var screenIdentifier = "CHECKIN_LANDING";
			$scope.isPrecheckinOnly = GwWebSrv.zestwebData.isPrecheckinOnly;
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.isAutoCheckinOn = GwWebSrv.zestwebData.isAutoCheckinOn;
			$scope.isCCOnFile = GwWebSrv.zestwebData.isCCOnFile;
			$scope.cardDigits = "";
			$scope.departureDate = "";
			$scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
		}();

		// Calendar toggle actions and date select action
		$scope.showCalender = function() {
			loseFocus(); // focusout the input fields , so as to fix cursor being shown above the calendar
			$scope.calendarView = true;
		};
		$scope.closeCalender = function() {
			$scope.calendarView = false;
		};
		$scope.dateChoosen = function() {
			$scope.departureDate = ($filter('date')($scope.date, GwWebSrv.zestwebData.dateFormat));
			dateToSend = dclone($scope.date, []);
			dateToSend = ($filter('date')(dateToSend,'MM-dd-yyyy'));
			$scope.closeCalender();
		};

		$scope.nextButtonClicked = function() {
			var verificationSuccess = function(response){
				GwCheckinSrv.setcheckinData(response);
				GwWebSrv.zestwebData.roomUpgraded  = false;
				$state.go('checkinReservationDetails');
			};
			var verificationFailed = function(response){
				var popupOptions = angular.copy($scope.errorOpts);
				popupOptions.resolve = {
					message: function() {
						return "<b>We could not find your reservation</b>. Please check for typos, or call <hotelPhone>."
					}
				};
				$modal.open(popupOptions);
			};
			var params = {
				'departure_date': dateToSend,
				'credit_card': $scope.cardDigits,
				'reservation_id': GwWebSrv.zestwebData.reservationID
			};
			var options = {
				params: params,
				successCallBack: verificationSuccess,
				failureCallBack: verificationFailed
			};
			$scope.callAPI(GwCheckinSrv.verifyCheckinUser, options);
		};

	}
]);