sntRover.controller('RVJournalBalanceController', 
    ['$scope', 
    '$rootScope', 
    'RVJournalSrv', 
    '$timeout',
    '$state',
    function($scope, $rootScope, RVJournalSrv, $timeout, $state) {
	BaseCtrl.call(this, $scope);

    var initBalanceData = function() {
        var successCallBackFetchBalanceData = function(data) {
            $scope.balanceData = data.data;
        };

        var postData = {
            "date": $scope.data.fromDate
        };

        $scope.invokeApi(RVJournalSrv.fetchBalanceDetails, postData, successCallBackFetchBalanceData);
    };

    $scope.clickedNavigationToSearch = function(clickedType) {
        var stateParams = {'type': clickedType, 'from_page': 'JOURNAL'};

        $state.go('rover.search', stateParams);
    };

    initBalanceData();

}]);