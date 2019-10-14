sntRover.controller('RVHouseKeepingAnalyticsCtrlController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvFrontOfficeAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvFrontOfficeAnalyticsSrv, $controller) {

		BaseCtrl.call(this, $scope);
		$controller('rvAnalyticsBaseCtrl', {
			$scope: $scope
		});

		var arrivalsColorScheme = d3.scaleOrdinal()
			.range(["#B5D398", "#557B2F", "#B7D599"])
			.domain(["perfomed", "early_checkin", "remaining"]);

		var vacantColorScheme = d3.scaleOrdinal()
			.range(["#DC3535", "#EC9319", "#B7D599"])
			.domain(["dirty", "pickup", "clean"]);

		var departuesColorScheme = d3.scaleOrdinal()
			.range(["#DAA0A1", "#DE3635", "#AE2828", "#B7D599"])
			.domain(["perfomed", "late_checkout", "remaining"]);

		var chartColorScheme = {
			arrivalsColorScheme: arrivalsColorScheme,
			vacantColorScheme: vacantColorScheme,
			departuesColorScheme: departuesColorScheme
		};

		var onBarChartClick = function (e) {
			console.log(JSON.stringify(e));
		};

		(function() {
			var options = {
				params: {},
				successCallBack: function(response) {
					$scope.drawBidirectionalChart(response.data, chartColorScheme, onBarChartClick);
				}
			};

			$scope.callAPI(rvFrontOfficeAnalyticsSrv.fetchFrontDeskAnalyticsData, options);
		})();
	}
]);