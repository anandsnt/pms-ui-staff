sntRover.controller('RVJournalSummaryController', ['$scope','$rootScope', 'RVJournalSrv','$timeout',function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

	var initSummaryData = function(){

		var successCallBackFetchSummaryData = function(responce){
			$scope.data.summaryData = {};
			$scope.data.summaryData = responce.data;
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
		};

        var params = {
            "date": $scope.data.summaryDate
        };
		$scope.invokeApi(RVJournalSrv.fetchSummaryData, params, successCallBackFetchSummaryData);
    };

	initSummaryData();

}]);