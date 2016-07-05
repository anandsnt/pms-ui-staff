sntRover.controller('RVEndOfDayProcessController', ['$scope','ngDialog','$rootScope','$filter','RVEndOfDayModalSrv','$state', function($scope,ngDialog,$rootScope,$filter,RVEndOfDayModalSrv,$state){

    BaseCtrl.call(this, $scope);
    var init =function(){
        $scope.eodLogDetails = {};
        $scope.businessDate = $filter('date')($rootScope.businessDate, $rootScope.dateFormat);
        $scope.selectedDate = $scope.businessDate;
        $scope.nextBusinessDate = tzIndependentDate($rootScope.businessDate);
        $scope.nextBusinessDate.setDate($scope.nextBusinessDate.getDate()+1);
        $scope.nextBusinessDate = $filter('date')($scope.nextBusinessDate, $rootScope.dateFormat);
        fetchEodLogOfSelectedDate();
    };
    $scope.clickedDate = function(){
        console.log("Clicked Date Button");
    };
    $scope.setSelectedDateToBussinessDate = function(){
        $scope.selectedDate = $scope.businessDate;
    };
    $scope.showSetToTodayButton = function(){
        return ($scope.selectedDate === $scope.businessDate)?true:false;
    };
    var fetchEodLogOfSelectedDate = function(){
        var data = {
            date:$scope.selectedDate
        };
        var fetchEodLogSuccess = function(data){
            $rootScope.$broadcast('hideLoader');
            console.log(data);
        };
        var fetchEodLogFailure = function(){
            $rootScope.$broadcast('hideLoader');
            console.log(data);
        };
        $scope.invokeApi(RVEndOfDayModalSrv.fetchLog,data,fetchEodLogSuccess,fetchEodLogFailure);
    };
    init();
}]);