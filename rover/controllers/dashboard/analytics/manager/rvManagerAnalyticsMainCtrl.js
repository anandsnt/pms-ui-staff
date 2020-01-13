sntRover.controller('RVManagerAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvAnalyticsSrv',
	function($scope, $rootScope, $state, $timeout, rvAnalyticsSrv) {

	BaseCtrl.call(this, $scope);

	rvAnalyticsSrv.setHotelCiCoTime($rootScope.hotelDetails);
	var initialBaseHrefValue = $('base').attr('href');
	var perfomanceData;
	var combinedPerfomanceData = {};

	$controller('rvManagerSpiderChartCtrl', {
		$scope: $scope
	});

	$controller('rvManagerDistributionAnalyticsCtrl', {
		$scope: $scope
	});

	$controller('rvMangerPaceChart', {
		$scope: $scope
	});

	var addChartHeading = function() {
		rvAnalyticsHelperSrv.addChartHeading($scope.screenData.mainHeading, $scope.screenData.analyticsDataUpdatedTime);
	};

	var renderPerfomanceChart = function() {
		$('base').attr('href', initialBaseHrefValue);
		var options = {
			params: {
				date: $scope.dashboardFilter.datePicked
			},
			successCallBack: function(data) {
				$('base').attr('href', '#');
				perfomanceData = data;
				$scope.screenData.analyticsDataUpdatedTime = moment().format("MM ddd, YYYY hh:mm:ss a");
				$scope.$emit('CLEAR_ALL_CHART_ELEMENTS');
				$scope.drawPerfomceChart(data);
				addChartHeading();
			}
		};

		$scope.callAPI(rvManagersAnalyticsSrv.roomPerformanceKPR, options);
	};

	$scope.$on('GET_MANAGER_PERFOMANCE', );
	$scope.$on('GET_MANAGER_DISTRIBUTION', );
	$scope.$on('GET_MANAGER_PACE', )

	(function() {
	})();
}]);