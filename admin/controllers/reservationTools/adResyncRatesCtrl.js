admin.controller('ADResyncRatesCtrl', [
	'$scope',
	'ADReservationToolsSrv',
	function($scope, ADReservationToolsSrv) {
		BaseCtrl.call(this, $scope);

		var init = function() {
			$scope.errorMessage = '';
			$scope.isActiveRateDropDown = false;
			$scope.selectedRateObj = { id: null, name: '' };
			$scope.textInQueryBox = null;
			$scope.rateListResult = [];
		};

		/*	
		 *	Handle Sync button click.
		 */
		$scope.clickedSyncButton = function() {
			var successCallback = function(data) {
				$scope.selectedRateObj.last_sync_status = data.last_sync_status;
				$scope.selectedRateObj.last_sync_at = data.last_sync_at;
			},
			failureCallback = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			},
			data = {
				id: $scope.selectedRateObj.id
			},
			options = {
				params: data,
				successCallBack: successCallback,
				failureCallBack: failureCallback
			};

			$scope.callAPI(ADReservationToolsSrv.reSyncRates, options);
		};

		/*
		 *	Handle Toggling of Rate Dropdown.
		 */
		$scope.toggleRateDropDown = function() {
			$scope.isActiveRateDropDown = !$scope.isActiveRateDropDown;
		};

		/*
		 *	Handle search query.
		 */
		$scope.searchQuery = function() {
			var successCallback = function(data) {
				$scope.rateListResult = [];
				$scope.rateListResult = data.results;
			},
			failureCallback = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			},
			data = {
				query: $scope.textInQueryBox,
				is_active: true
			},
			options = {
				params: data,
				successCallBack: successCallback,
				failureCallBack: failureCallback
			};

			if ($scope.textInQueryBox.length > 2) {
				$scope.callAPI(ADReservationToolsSrv.searchRates, options);
			}
		};

		/*
		 *	Handle Clear Search.
		 */
		$scope.clearSearch = function() {
			$scope.textInQueryBox = null;
			$scope.rateListResult = [];
		};

		/*
		 *	Handle click on each rate.
		 *	@param {Number} [index value of the rate selected]
		 */
		$scope.clickedEachRate = function(index) {
			$scope.selectedRateObj = $scope.rateListResult[index];
		};

		init();
	}
]);
