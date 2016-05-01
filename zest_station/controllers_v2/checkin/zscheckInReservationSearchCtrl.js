sntZestStation.controller('zscheckInReservationSearchCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	'zsCheckinSrv',
	'$stateParams',
	function($scope, $rootScope, $state, zsEventConstants, zsCheckinSrv,$stateParams) {


		//This controller is used for searching reservation using last name
		//and other optional params

		/** MODES in the screen
		*   1.LAST_NAME_ENTRY_MODE --> enter last name
		*   2.CHOOSE_OPTIONS --> choose from no of nights, email and confirm no.
		*   3.NO_OF_NIGHTS_MODE --> enter no of nights
		*   4.CONFIRM_NO_MODE --> enter confirmation no.
		*   6.EMAIL_ENTRY_MODE --> email entry mode
		*   7.FIND_BY_DATE --> find by date 
		*   5.NO_MATCH --> No match
		**/

		BaseCtrl.call(this, $scope);

		var init = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				$state.go('zest_station.home');
			});
			//starting mode
			$scope.mode = "LAST_NAME_ENTRY";
			$scope.reservationParams = {
				'due_in':true,
				'last_name':'',
				'no_of_nights':'',
				'alt_confirmation_number':'',
				'email':''
			};
		};
		init();


		$scope.findByDate = function(){
			//to do
			// $scope.mode = 'FIND_BY_DATE';
		};
		$scope.findByNoOfNights = function(){
			$scope.mode = 'NO_OF_NIGHTS_MODE';
		};
		$scope.findByEmail = function(){
			$scope.mode = "EMAIL_ENTRY_MODE";
		};
		$scope.findByConfirmation = function(){
			$scope.mode = 'CONFIRM_NO_MODE';
		};

		var searchReservation = function(params) {
			var checkinVerificationSuccess = function(data) {
				console.log(data);
				var stateParams = {
				};
				//$state.go('zest_station.checkoutReservationBill', stateParams);
			};
			var checkinVerificationCallBack = function() {
				$scope.mode = 'NO_MATCH';
			};
			var options = {
				params: params,
				successCallBack: checkinVerificationSuccess,
				failureCallBack: checkinVerificationCallBack
			};
			$scope.callAPI(zsCheckinSrv.fetchReservations, options);
		};

		$scope.lastNameEntered = function() {
			//if room is already entered, no need to enter again
			if ($scope.reservationParams.no_of_nights.length > 0 ||
			    $scope.reservationParams.alt_confirmation_number.length >0  ||
			    $scope.reservationParams.email.length >0) {
				searchReservation();
			} else {
				$scope.mode = $scope.reservationParams.last_name.length >0 ? "CHOOSE_OPTIONS" :$scope.mode;
			};
		};

		$scope.noOfNightsEntered = function() {
			var params = angular.copy($scope.reservationParams);
			delete params.alt_confirmation_number;
			delete params.email;
			searchReservation(params);
		};

		$scope.confNumberEntered = function() {
			var params = angular.copy($scope.reservationParams);
			delete params.no_of_nights;
			delete params.email;
			searchReservation(params);
		};

		$scope.emailEntered = function() {
			var params = angular.copy($scope.reservationParams);
			delete params.no_of_nights;
			delete params.alt_confirmation_number;
			searchReservation(params);
		};

		$scope.dateEntered = function() {
			//to do
		};


		$scope.reEnterText = function(type) {
			if(type === 'name'){
				$scope.mode = "LAST_NAME_ENTRY";
			}
			else if ($scope.reservationParams.no_of_nights.length > 0){
				$scope.mode = 'NO_OF_NIGHTS_MODE';
			}
			else if($scope.reservationParams.alt_confirmation_number.length >0){
				$scope.mode = 'CONFIRM_NO_MODE';
			}
			else if($scope.reservationParams.email.length >0){
				$scope.mode = "EMAIL_ENTRY_MODE";
			}
			else{
				return;
			};
		};

		$scope.talkToStaff = function() {
			$state.go('zest_station.speakToStaff');
		};
	}
]);