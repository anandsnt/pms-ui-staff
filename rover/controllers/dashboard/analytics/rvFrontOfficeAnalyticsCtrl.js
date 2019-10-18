sntRover.controller('rvFrontOfficeAnalyticsCtrlController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvFrontOfficeAnalyticsSrv',
	'rvAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvFrontOfficeAnalyticsSrv, rvAnalyticsSrv, $controller) {

		BaseCtrl.call(this, $scope);
		$scope.screenData = {};

		$controller('rvFrontOfficeWorkloadCtrl', {
			$scope: $scope
		});
		$controller('rvFrontOfficeManagementAnalyticsCtrl', {
			$scope: $scope
		});

		var onBarChartClick = function (e) {
			console.log(JSON.stringify(e));
		};

		var renderfdWorkloadChart = function(date) {
			rvFrontOfficeAnalyticsSrv.fdWorkload($rootScope.businessDate).then(function(data) {
					var chartDetails = {
						chartData: data,
						onBarChartClick: onBarChartClick
					};

					$scope.drawWorkLoadChart(chartDetails);
				};
		};
		var renderFrontOfficeManagementChart = function(data) {

			rvFrontOfficeAnalyticsSrv.fdArrivalsManagement($rootScope.businessDate).then(function(data) {

				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick
				};

				$scope.drawArrivalManagementChart(chartDetails);
			});
		};

		(function() {

			var options = {
				params: $rootScope.businessDate,
				successCallBack: function() {
					renderFrontOfficeManagementChart();
				}
			};

			$scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);

		})();
	}
]);
