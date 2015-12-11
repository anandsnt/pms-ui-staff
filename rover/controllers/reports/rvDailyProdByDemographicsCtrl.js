angular.module('sntRover').controller('rvDailyProdByDemographicsCtrl', 
	['$scope', 'RVReportParserFac', function($scope, reportParser){
	

	var renderReport = function() {
		var props = {
			data: $scope.results
		};

		React.renderComponent(
			DailyProductionByDemographics(props),
			document.getElementById('daily-prod-demographics')
		);
	};

	var initializeMe = function() {
		renderReport();
	}();
}]);