admin.controller('ADResyncRatesCtrl', [
	'$scope',
	'ADReservationToolsSrv',
	function($scope, ADReservationToolsSrv) {
		BaseCtrl.call(this, $scope);

		$scope.errorMessage = "";
		$scope.isActiveRateDropDown = false;
		$scope.selectedRateObj = { id: null, name: ''};
		$scope.textInQueryBox = null;
		$scope.rateListResult = [];

		/*	
		 *	Handle Sync button click.
		 */
		$scope.clickedSyncButton = () => {
			let successCallback = (data) => {
				console.log(data);
			},
			failureCallback = (errorMessage) => {
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
		 *	Handle Toggling of Rate Dropdown
		 */
		$scope.toggleRateDropDown = () => {
			$scope.isActiveRateDropDown = !$scope.isActiveRateDropDown;
		};

		/*
		 *	Handle search query.
		 */
		$scope.searchQuery = () => {
			let successCallback = (data) => {
				$scope.rateListResult = [];
				$scope.rateListResult = data.results;
				console.log(data);
			},
			failureCallback = (errorMessage) => {
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
		$scope.clearSearch = () => {
			$scope.textInQueryBox = null;
			$scope.rateListResult = [];
		};

		/*
		 *	Handle Clear Search.
		 */
		$scope.clickedEachRate = (index) => {
			$scope.selectedRateObj = $scope.rateListResult[index];
			$scope.rateListResult[index].active = true;
		};

	}
]);