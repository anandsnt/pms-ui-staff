sntRover.controller('RVEndOfDayProcessController', ['$scope','ngDialog','$rootScope','$filter','RVEndOfDayModalSrv','$state','$timeout', function($scope,ngDialog,$rootScope,$filter,RVEndOfDayModalSrv, $state, $timeout){

    BaseCtrl.call(this, $scope);
    var init =function(){
        $scope.eodLogDetails = {};
        $scope.dateFormat = $rootScope.dateFormat;
        $scope.businessDate = $rootScope.businessDate;
        $scope.selectedDate = $scope.businessDate;
        $scope.nextBusinessDate = tzIndependentDate($rootScope.businessDate);
        $scope.nextBusinessDate.setDate($scope.nextBusinessDate.getDate()+1);
        $scope.nextBusinessDate = $filter('date')($scope.nextBusinessDate, $rootScope.dateFormat);        
        $scope.setScroller('eod_scroll');
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

    $scope.getClass = function(processLog){
        if(processLog.status =="SUCCESS"){
            return "has-success";
        }else if(processLog.status =='NOT_ACTIVE'){
            return "pending";
        }else if(processLog.status =='PENDING'){
            return "";
        }else if(processLog.status =="FAILED" && processLog.isOpened){
            return " error has-arrow toggle active";
        }else{
            return " error has-arrow toggle ";
        };
    };

    var setUpDatepData = function(){
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            dateFormat: 'dd-mm-yy',
            maxDate: $filter('date')($scope.businessDate,'dd-MM-yyyy'),
            yearRange: "-100:+0",
            onSelect: function(date, inst) {
                $scope.selectedDate = date;
                if($scope.selectedDate !==$scope.businessDate){
                   fetchEodLogOfSelectedDate(); 
               };                
                ngDialog.close();
            }
        };
    };
    var refreshScroller = function() {
        $scope.refreshScroller ('eod_scroll');
    };

    $scope.showError = function(index){
        $scope.eodLogDetails[index].isOpened = !$scope.eodLogDetails[index].isOpened;
    }
    var popupCalendar = function(clickedOn) {
        ngDialog.open({
            template: '/assets/partials/endOfDay/rvEodDatepicker.html',
            className: 'single-date-picker',
            scope: $scope
        });
    };


    $scope.openEndOfDayPopup = function() {
        ngDialog.open({
            template: '/assets/partials/endOfDay/rvEndOfDayModal.html',
            controller: 'RVEndOfDayModalController',
            className: 'end-of-day-popup ngdialog-theme-plain'
        });
    };

    var fetchEodLogOfSelectedDate = function(){
        var data = {
            date: $scope.selectedDate
        };
        var fetchEodLogSuccess = function(data){
            $scope.eodLogDetails = data.eod_processes;
            $timeout(function() {
                refreshScroller();           
            },500);           
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