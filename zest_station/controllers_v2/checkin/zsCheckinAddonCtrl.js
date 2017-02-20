sntZestStation.controller('zsCheckinAddonCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsCheckinSrv',
	'zsEventConstants',
	function($scope, $stateParams, $state, zsCheckinSrv, zsEventConstants) {

		var generalError = function() {
			$scope.mode = 'ERROR_MODE';
		};

		var setPageNumberDetails = function() {

			if ($scope.addonsList.length <= 6) {
				// if 6 or less upgrades are available
				$scope.pageStartingIndex = 1;
				$scope.pageEndingIndex = $scope.addonsList.length;
				$scope.viewableAddons = angular.copy($scope.addonsList);
			} else {
				// if multiple pages (each containing 6 items) are present and user navigates
				// using next and previous buttons
				$scope.pageStartingIndex = 1 + 6 * ($scope.pageNumber - 1);
				// ending index can depend upon the no of items
				if ($scope.pageNumber * 6 < $scope.addonsList.length) {
					$scope.pageEndingIndex = $scope.pageNumber * 6;
				} else {
					$scope.pageEndingIndex = $scope.addonsList.length;
				}

				// set viewable room list - 6 items at a time
				$scope.viewableAddons = [];

				for (index = -1; index < 5; index++) {
					if (!_.isUndefined($scope.addonsList[$scope.pageStartingIndex + index])) {
						$scope.viewableAddons.push($scope.addonsList[$scope.pageStartingIndex + index]);
					}
				}
				// enable/disable next previous
				$scope.disableNextButton = ($scope.pageEndingIndex === $scope.addonsList.length);
				$scope.disablePreviousButton = $scope.pageStartingIndex === 1;
			}


			console.log($scope.viewableAddons);
		};

		$scope.viewNextPage = function() {
			$scope.pageNumber++;
			setPageNumberDetails();
		};

		$scope.viewPreviousPage = function() {
			$scope.pageNumber--;
			setPageNumberDetails();
		};


		$scope.addonSelected = function(addon) {
			$scope.selectedAddon = addon;
			$scope.showPopup = true;
		};

		$scope.closePopup = function (argument) {
			$scope.showPopup = false;
		};

		var fetchAddons = function() {

			var fetchAddonsSuccess = function(response) {
				$scope.addonsList = response.addons;

				_.each($scope.addonsList, function(addon) {
					addon.is_selected = false;
					addon.quantity = 0;
				});

				// set page number details
				$scope.pageNumber = 1;
				if ($scope.addonsList.length > 0) {
					setPageNumberDetails();
				} else {
					generalError();
				}
				$scope.showPageNumberDetails = true;

				if ($scope.addonsList.length === 1) {
					$scope.selectedRoom = $scope.addonsList[0];
					$scope.mode = 'ROOM_DETAILS';
				} else {
					$scope.mode = 'ROOM_UPSELL_LIST';
				}
			};
			$scope.callAPI(zsCheckinSrv.fetchAddons, {
				params: {
					//reservation_id: $scope.selectedReservation.reservation_details.reservation_id
				},
				'successCallBack': fetchAddonsSuccess,
				'failureCallBack': generalError
			});
		};
		$scope.addonsList = [];
		$scope.getAmountTotal = function () {
			var totalAmount = 0;
			_.each($scope.addonsList, function(addon) {
				if(addon.is_selected){
					totalAmount = totalAmount + addon.price
				}else if(addon.quantity>0){
					totalAmount = totalAmount + addon.price * addon.quantity
				}
			});
			return totalAmount;
		};
		/**
		 * [initializeMe description]
		 */
		var initializeMe = (function() {
			fetchAddons();
			
		}());
	}
]);