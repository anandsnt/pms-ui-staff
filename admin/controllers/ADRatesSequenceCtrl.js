admin.controller('ADRatesSequenceCtrl', ['$scope', 'ADRateSequenceSrv', '$anchorScroll', '$timeout', '$location',
	function($scope, ADRateSequenceSrv, $anchorScroll, $timeout, $location) {

		$scope.sequenceState = {
			availableOptions: {
				room_rate: [],
				rate_manager: [],
				dashboard: []
			},
			selectedOptions: {
				room_rates: {},
				rate_manager: {},
				dashboard: {}
			}
		};

		var isCustomRateSelected = function( dashboard ) {
			return dashboard.value === 'CUSTOM_RATE'
		};

		var fetchSelections = function() {
			var onFetchSelectionsSuccess = function(data) {
				$scope.sequenceState.selectedOptions = data;
				$scope.showSearch = isCustomRateSelected( data.dashboard );
				$scope.$emit('hideLoader');
			};

			$scope.invokeApi(ADRateSequenceSrv.fetchSelections, {}, onFetchSelectionsSuccess);
		};

		var initializeView = function() {
			var onFetchPrefereneOptions = function(data) {
				$scope.sequenceState.availableOptions = data;
				fetchSelections();
			};

			$scope.invokeApi(ADRateSequenceSrv.fetchOptions, {}, onFetchPrefereneOptions);
		};


		// --------------------------------------------------------------------------- //


		$scope.changePreference = function(type, option) {
			$scope.sequenceState.selectedOptions[type] = angular.copy(option);
			$scope.showSearch = isCustomRateSelected( option );
		};

		$scope.saveRateSortPreferences = function() {
			var onSaveSuccess = function(data) {
				$scope.$emit('hideLoader');
			};

			$scope.invokeApi(ADRateSequenceSrv.save, {
				"room_rates": $scope.sequenceState.selectedOptions['room_rates'].id,
				"rate_manager": $scope.sequenceState.selectedOptions['rate_manager'].id,
				"dashboard": $scope.sequenceState.selectedOptions['dashboard'].id,
				"dashboard_rate_id": $scope.sequenceState.selectedOptions['dashboard_rate'].id
			}, onSaveSuccess);
		};

		initializeView();
	}
]);
