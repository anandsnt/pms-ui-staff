sntRover.controller('RVEndOfDayProcessController', ['$scope','ngDialog','$rootScope','$filter','RVEndOfDayModalSrv','$state','$timeout', function($scope,ngDialog,$rootScope,$filter,RVEndOfDayModalSrv, $state, $timeout){

    BaseCtrl.call(this, $scope);
    var init =function(){
        $scope.eodLogDetails = {};
        $scope.dateFormat = $rootScope.dateFormat;
        $scope.businessDate =$rootScope.businessDate;       
        setDefaultNextBussinessDate();
        setDefaultSelectedDate();
        setDisplayDateValues();         
        $scope.setScroller('eod_scroll');
        fetchEodLogOfSelectedDate();
    };
    /*
    * Function to get day, month and Year from Date(Date format is kept yyyy/mm/dd);
    */
    var setDisplayDateValues = function(){        
        var values = $scope.selectedDate.split("-");
        $scope.year = values[0];
        $scope.month = getMonthName(parseInt(values[1]-1));
        $scope.day = values[2];
    };
    /*
    * Setting nextBussiness Date
    */
    var setDefaultNextBussinessDate = function(){
        $scope.nextBusinessDate = tzIndependentDate($rootScope.businessDate);
        $scope.nextBusinessDate.setDate($scope.nextBusinessDate.getDate()+1);
        $scope.nextBusinessDate = $filter('date')($scope.nextBusinessDate, "yyyy-MM-dd");
    };
    /*
    * Function to restart a failed process.
    */
    $scope.restartFailedProcess = function(process){
        var data = {           
            id : process.id
        };
        var restartProcessSuccess = function(){
            fetchEodLogOfSelectedDate();
        };
        var restartProcessFail = function(data){
            $rootScope.$broadcast('hideLoader');
        };
        $scope.invokeApi(RVEndOfDayModalSrv.restartFailedProcess,data,restartProcessSuccess,restartProcessFail);
    };
    /*
    * Set Selected date as previous date of Bussines date.
    */
    var setDefaultSelectedDate = function(){       
        var previousDate = tzIndependentDate($rootScope.businessDate);
        previousDate.setDate(previousDate.getDate() - 1)              
        $scope.selectedDate = $filter('date')(previousDate, "dd-MM-yyyy").split("-").reverse().join("-");        
    };
    /*
    * Setting Date options
    */
    var setUpDateData = function(){
        $scope.date =  $scope.selectedDate;
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            dateFormat: 'yy-mm-dd',
            maxDate: $scope.businessDate,
            yearRange: "-100:+0",
            onSelect: function(date, inst) {
                $scope.selectedDate = date;
                setDisplayDateValues();            
                if($scope.selectedDate !==$scope.businessDate){
                   fetchEodLogOfSelectedDate(); 
                };                
                ngDialog.close();
            }
        };
    };
   
    var refreshScroller = function() {
        $scope.refreshScroller('eod_scroll');
    };   

    $scope.showError = function(index){
        $scope.eodLogDetails[index].isOpened = !$scope.eodLogDetails[index].isOpened;
    };

    var fetchEodLogOfSelectedDate = function(){
        var data = {
            date: $scope.selectedDate
        };
        var fetchEodLogSuccess = function(data){
            $scope.eodLogDetails = data.eod_processes;
                      
            $rootScope.$broadcast('hideLoader');
            $timeout(function() {
                refreshScroller();           
            },1000); 
        };
        var fetchEodLogFailure = function(){
            $rootScope.$broadcast('hideLoader');
        };
        $scope.invokeApi(RVEndOfDayModalSrv.fetchLog,data,fetchEodLogSuccess,fetchEodLogFailure);
    };
    /*
    * Show date picker
    */
    $scope.clickedDate = function(){
        setUpDateData();
        ngDialog.open({
            template: '/assets/partials/endOfDay/rvEodDatepicker.html',
            className: 'single-date-picker',
            controller :'RVEndOfDayProcessController',
            scope: $scope
        });
    };

    $scope.setSelectedDateToBussinessDate = function(){
        $scope.selectedDate = $scope.businessDate;        
        setDisplayDateValues();
    };

    $scope.showSetToTodayButton = function(){
        return ($scope.selectedDate === $scope.businessDate)?true:false;
    };
    /*
    * returning class name depends on status.
    */
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

    $scope.openEndOfDayPopup = function() {
        ngDialog.open({
            template: '/assets/partials/endOfDay/rvEndOfDayModal.html',
            controller: 'RVEndOfDayModalController',
            className: 'end-of-day-popup ngdialog-theme-plain'
        });
    };

    init();
}]);