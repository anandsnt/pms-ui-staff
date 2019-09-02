sntRover.controller('RVJournalBalanceController', 
    ['$scope', 
    '$rootScope', 
    'RVJournalSrv', 
    '$timeout', 
    function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

    $scope.addListener('REFRESH_BALANCE_CONTENT', function() {
        initSummaryData();
    });

    console.log("reached--::")

}]);