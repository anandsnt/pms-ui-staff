sntRover.controller('RVEndOfDayProcessController', ['$scope','ngDialog','$rootScope','$filter','RVEndOfDayModalSrv','$state', function($scope,ngDialog,$rootScope,$filter,RVEndOfDayModalSrv,$state){

    BaseCtrl.call(this, $scope);
    var init =function(){
        $scope.eodLogDetails = {};
        $scope.dateFormat = $rootScope.dateFormat;
        $scope.businessDate = $filter('date')($rootScope.businessDate, $rootScope.dateFormat);
        $scope.selectedDate = $scope.businessDate;
        $scope.nextBusinessDate = tzIndependentDate($rootScope.businessDate);
        $scope.nextBusinessDate.setDate($scope.nextBusinessDate.getDate()+1);
        $scope.nextBusinessDate = $filter('date')($scope.nextBusinessDate, $rootScope.dateFormat);
        setUpDatepData();
        fetchEodLogOfSelectedDate();
    };
    $scope.clickedDate = function(){
        popupCalendar();
    };
    $scope.setSelectedDateToBussinessDate = function(){
        $scope.selectedDate = $scope.businessDate;
    };
    $scope.showSetToTodayButton = function(){
        return ($scope.selectedDate === $scope.businessDate)?true:false;
    };
    var setUpDatepData = function(){
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            dateFormat: $rootScope.jqDateFormat,
            maxDate: tzIndependentDate($scope.businessDate),
            yearRange: "-100:+0",
            onSelect: function(date, inst) {
                $scope.selectedDate = date;
                fetchEodLogOfSelectedDate();
                ngDialog.close();
            }
        };
    };
    var popupCalendar = function(clickedOn) {
        ngDialog.open({
            template: '/assets/partials/endOfDay/rvEodDatepicker.html',
            className: 'single-date-picker',
            scope: $scope
        });
    };


    $scope.openEndOfDayPopup = function() {
        console.log("Start EOD");
        ngDialog.open({
            template: '/assets/partials/endOfDay/rvEndOfDayModal.html',
            controller: 'RVEndOfDayModalController',
            className: 'end-of-day-popup ngdialog-theme-plain'
        });
    };

    var fetchEodLogOfSelectedDate = function(){
        var data = {
            date:$scope.selectedDate
        };
        var fetchEodLogSuccess = function(data){
            $scope.eodLogDetails = data.eod_processes;
            $rootScope.$broadcast('hideLoader');
        };
        var fetchEodLogFailure = function(){
            $rootScope.$broadcast('hideLoader');
            console.log(data);
        };
        $scope.invokeApi(RVEndOfDayModalSrv.fetchLog,data,fetchEodLogSuccess,fetchEodLogFailure);
    };
    init();
}]);