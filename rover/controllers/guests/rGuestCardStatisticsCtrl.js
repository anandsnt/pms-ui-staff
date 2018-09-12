angular.module('sntRover').controller("RVGuestCardStatisticsController", [
	'$scope',
	'RVGuestCardsSrv',
	function ($scope, RVGuestCardsSrv) {
		BaseCtrl.call(this, $scope);

		var loadStatisticsSummary = function() {
			var onStatisticsFetchSuccess = function(data) {
					$scope.statistics.summary = data;
					$scope.activeView = 'summary';
				},
				onStatistcsFetchFailure = function(error) {
					$scope.statistics.summary = {};
				};

			var requestConfig = {
				params: {},
				onSuccess : onStatisticsFetchSuccess,
				onFailure: onStatistcsFetchFailure
			};

			$scope.callAPI(RVGuestCardsSrv.fetchGuestCardStatisticsSummary, requestConfig);
		};

		var loadStatisticsDetails = function() {
			var onStatisticsDetailsFetchSuccess = function(data) {
					$scope.statistics.details = data;
					$scope.activeView = 'details';
				},
				onStatistcsDetailsFetchFailure = function(error) {
					$scope.statistics.details = [];
				};

			var requestConfig = {
				params: {},
				onSuccess : onStatisticsDetailsFetchSuccess,
				onFailure: onStatistcsDetailsFetchFailure
			};

			$scope.callAPI(RVGuestCardsSrv.fetchGuestCardStatisticsDetails, requestConfig);

		};

		var statisticsTabActivateListener = $scope.$on('LOAD_GUEST_STATISTICS', function() {
												loadStatisticsSummary();
											});

		// Get icon class based on the variance value
		$scope.getStatusIconClass = function( value ) {
			var iconClass = 'neutral';

			if ( value < 0 ) {
				iconClass = 'icons time check-out rotate-right';
			} else if ( value > 0 ) {
				iconClass = 'icons time check-in rotate-right';
			}

			return iconClass;
		};

		// Get style class based on the variance value
		$scope.getStatusClass = function( value ) {
			var styleClass = '';

			if ( value > 0 ) {
				styleClass = 'green';
			} else if ( value < 0 ) {
				styleClass = 'red';
			}

			return styleClass;
		};

		$scope.setActiveView = function( view ) {
			if ( view === 'details') {
				loadStatisticsDetails();
			} else {
				loadStatisticsSummary();
			}
		};

		$scope.getMarginBottom = function( monthlyData) {
			return monthlyData.reservations.length * 70 + 30;
		};

		$scope.showMonthlyReservations = function( monthlyData ) {
			monthlyData.isOpen = !monthlyData.isOpen;
		};

		$scope.getStyleForExpandedView = function( monthlyData ) {
			var styleClass = {};					

			if (monthlyData.isOpen) {
				var margin = monthlyData.reservations.length * 70 + 30;

				styleClass['margin-bottom'] = margin + 'px';
			}

			return styleClass;
		};

		var init = function() {
			$scope.activeView = "summary";
			$scope.statistics = {
				summary: {},
				details: []
			};

		};

	}]);