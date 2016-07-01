(function() {
	var selectNoOfkeysController = function($scope, $state, checkinKeysService, $rootScope) {


		var init = function() {
			$scope.isLoading = true;
			var params = {
				'reservation_id': $rootScope.reservationID
			};
			checkinKeysService.fetchNoOfKeysData(params).then(function(keyData) {

				$scope.isLoading = false;
				var screenCMSDetails = {};
				screenCMSDetails.title = keyData.key_prompt_title.length > 0 ? keyData.key_prompt_title : "No of keys?";
				screenCMSDetails.description = keyData.key_prompt_text.length > 0 ? keyData.key_prompt_text : "How many keys would you like? At Great Wolf, your key is a band that your wear on your wrist or ankle.";
				screenCMSDetails.errorMessage = keyData.key_prompt_save_error.length > 0 ? keyData.key_prompt_save_error : "Something went wrong. Sorry for the Inconvenience, Please click on skip to continue.";
				$scope.screenDetails = screenCMSDetails;

				$scope.noOfKeys = 1;
				$scope.keysArray = [];

				for (i = 1; i <= keyData.max_no_of_keys; i++) {
					$scope.keysArray.push(i);
				};
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		}();

		$scope.goToNextPage = function() {
			$rootScope.KeyCountAttemptedToSave =  true;
			$state.go('preCheckinStatus');
		};

		$scope.saveNoOfKeys = function() {
			$scope.isLoading = true;
			var params = {
				'no_of_keys': $scope.noOfKeys,
				'reservation_id': $rootScope.reservationID
			};
			checkinKeysService.saveNoKeys(params).then(function(keyData) {
				$scope.isLoading = false;
				$scope.goToNextPage();
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		};

	};

	var dependencies = [
		'$scope', '$state', 'checkinKeysService', '$rootScope',
		selectNoOfkeysController
	];

	sntGuestWeb.controller('selectNoOfkeysController', dependencies);
})();