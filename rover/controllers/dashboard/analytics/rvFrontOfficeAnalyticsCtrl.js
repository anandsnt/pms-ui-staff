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

		$controller('rvHKOverviewAnalticsCtrl', {
			$scope: $scope
		});
		$controller('rvFrontOfficeManagementAnalyticsCtrl', {
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

		var renderManagementChart = function(data) {

			rvFrontOfficeAnalyticsSrv.fdArrivalsManagement($rootScope.businessDate).then(function(data) {
				console.log("I am inside  fdArrivalsManagement");
				console.log(data);
				try{

					var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick
				};
					$scope.drawArrivalManagementChart(chartDetails);
				} catch(e) {
					console.log(e)
				}
				
				(data);
			});

		};


		(function() {

			// var options = {
			// 	params: $rootScope.businessDate,
			// 	successCallBack: function() {
			// 		renderHkWorkPriority($rootScope.businessDate)
   //                  //renderHkOverview($rootScope.businessDate);
			// 	}
			// };

			// $scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);

			var options = {
				params: $rootScope.businessDate,
				successCallBack: function() {
					
					renderManagementChart();

					// rvFrontOfficeAnalyticsSrv.fdWorkload($rootScope.businessDate).then(function(data) {
					// 	console.log("I am inside  fdWorkload");
					// 	console.log(data);
					// });
				}
			};

			$scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);

		})();
	}
]);
