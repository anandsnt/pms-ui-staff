sntRover.controller('RVHouseKeepingAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvAnalyticsSrv, $controller) {

		BaseCtrl.call(this, $scope);
		$scope.screenData = {};

		$controller('rvHKOverviewAnalticsCtrl', {
			$scope: $scope
		});
		$controller('rvHkWokrPriorityCtrl', {
			$scope: $scope
		});

		var onBarChartClick = function (e) {
			console.log(JSON.stringify(e));
		};

		var renderHkOverview = function(date) {
            // Calling HK Overview Build Graph
			rvAnalyticsSrv.hkOverview(date).then(function(data) {
				console.log(data);
				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick
				};

				$scope.drawHkOverviewChart(chartDetails);
			});
        };

		var renderHkWorkPriority = function(date) {
			// Calling HK Overview Build Graph
			rvAnalyticsSrv.hkWorkPriority(date).then(function(data) {
				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick
				};
				$scope.drawHkWorkPriorityChart(chartDetails);
			});

		};


		(function() {

			var options = {
				params: $rootScope.businessDate,
				successCallBack: function() {
					renderHkWorkPriority($rootScope.businessDate)
                    //renderHkOverview($rootScope.businessDate);
				}
			};

			$scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);

		})();
	}
]);
