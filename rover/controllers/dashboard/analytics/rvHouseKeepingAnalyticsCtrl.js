sntRover.controller('RVHouseKeepingAnalyticsCtrlController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvFrontOfficeAnalyticsSrv',
	'rvAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvFrontOfficeAnalyticsSrv, rvAnalyticsSrv, $controller) {

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



		var arrivalsColorScheme = d3.scaleOrdinal()
			.range(["#B5D398", "#557B2F", "#B7D599"])
			.domain(["perfomed", "remaining"]);

		var stayoversColorScheme = d3.scaleOrdinal()
			.range(["#DC3535", "#EC9319", "#B7D599"])
			.domain(["perfomed", "remaining"]);

		var departuresColorScheme = d3.scaleOrdinal()
			.range(["#DAA0A1", "#DE3635", "#AE2828", "#B7D599"])
			.domain(["perfomed", "remaining"]);
		var roomsColorScheme = d3.scaleOrdinal()
			.range(["#DAA0A1", "#DE3635", "#AE2828", "#B7D599", "#DC3535"])
			.domain(["dirty", "clean","pickup","inspected"]);

		var chartColorScheme = {
			arrivalsColorScheme: arrivalsColorScheme,
			vacantColorScheme: vacantColorScheme,
			departuresColorScheme: departuresColorScheme,
			roomsColorScheme: roomsColorScheme,
			stayoversColorScheme: stayoversColorScheme
		};

		var onBarChartClick = function (e) {
			console.log(JSON.stringify(e));
		};

		var renderHkOverview = function(date) {
            // Calling HK Overview Build Graph
            rvAnalyticsSrv.hkOverview(date).then(function(data) {
                var chartDetails = {
                    chartData: data.data,
                    chartColorScheme: chartColorScheme,
                    onBarChartClick: onBarChartClick
                };

                $scope.drawBidirectionalChart(chartDetails);
            });
        };

		(function() {

			var options = {
				params: $rootScope.businessDate,
				successCallBack: function() {
                    renderHkOverview($rootScope.businessDate);
				}
			};

			$scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);

		})();
	}
]);
