sntRover.controller('RMDashboradCtrl', ['$scope','dateFilter', function($scope,dateFilter){
    
    BaseCtrl.call(this, $scope);
    $scope.displayMode = "CALENDAR";
    $scope.filterConfigured = false;
    
    $scope.currentFilterData =  {
           begin_date : dateFilter(new Date(), 'yyyy-MM-dd'),
           end_date : dateFilter(new Date(), 'yyyy-MM-dd'),
           zoom_level : [{"value": "3","name": "3 days"},{"value": "4","name": "4 days"},{"value": "5","name": "5 days"},{"value": "6","name": "6 days"},{"value": "7","name": "7 days"}],
           zoom_level_selected : '',
           is_checked_all_rates : true,
           rate_types: [],
           rate_type_selected : '',
           rates : [],
           rates_selected_list : [],
           name_on_cards : []
    };
    $scope.ratesDisplayed = [];
     
    $scope.showCalendarView = function(){
        $scope.displayMode = "CALENDAR";
    };

    $scope.showGraphView = function(){
        $scope.displayMode = "GRAPH";
    };

    $scope.showRatesBtnClicked = function(){
        $scope.filterConfigured = true;
        $scope.$broadcast("showRatesClicked");
    };
    $scope.backButtonClicked = function(){
        $scope.ratesDisplayed = $scope.currentFilterData.rates_selected_list;
        $scope.$broadcast("setCalendarModeRateType");
    }

}]);
