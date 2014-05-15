sntRover.controller('RMDashboradCtrl', ['$scope','$window','dateFilter', function($scope,$window,dateFilter){
    
    BaseCtrl.call(this, $scope);
    $scope.displayMode = "CALENDAR";
    $scope.filterConfigured = false;
    var defaultDateRange = 7;
	$scope.showLeftMenu = true;
    
	$scope.currentFilterData =	{
           begin_date : dateFilter(new Date(), 'yyyy-MM-dd'),
           end_date : dateFilter(new Date((new Date()).getTime() + defaultDateRange*24*60*60*1000), 'yyyy-MM-dd'),
           zoom_level : [{"value": "3","name": "3 days"},{"value": "4","name": "4 days"},{"value": "5","name": "5 days"},{"value": "6","name": "6 days"},{"value": "7","name": "7 days"}],
           zoom_level_selected : "3",
           is_checked_all_rates : true,
           rate_types: [],
           rate_type_selected : '',
           rates : [],
           rates_selected_list : [],
           name_on_cards : []

    };
    /* UI options like column width are computed here 
       A property, and a function to compute the same are given below
    */
    var DEFAULT_COLUMN_WIDTH = 200;
    var DEFAULT_TABLE_WIDTH = 4000;
    $scope.uiOptions={
        columWidth : DEFAULT_COLUMN_WIDTH,
        tableWidth : DEFAULT_TABLE_WIDTH,
        
    };

    $scope.computeColumWidth = function(){

        var FILTER_OPTIONS_WIDTH = 230;
        var FIRST_COLUMN_WIDTH = 270;
        var COLUMN_BORDER_WIDTH = 20;
        var totalwidth = $window.innerWidth - FILTER_OPTIONS_WIDTH - FIRST_COLUMN_WIDTH; //Adjusting for left side .
        var singleColumnWidth = parseInt($scope.currentFilterData.zoom_level_selected) + COLUMN_BORDER_WIDTH; //Adjusting for the padding etc
        var mywidth = totalwidth/parseInt($scope.currentFilterData.zoom_level_selected);
        var numColumns = new Date($scope.currentFilterData.end_date) - new Date($scope.currentFilterData.begin_date);
        numColumns = numColumns/(24*60*60*1000) + 1;
        var columsTotalWidth = numColumns * mywidth;
        if ( columsTotalWidth < totalwidth) columsTotalWidth = totalwidth; //@minimum, table should cover full view.
        $scope.uiOptions.tableWidth = parseInt(FIRST_COLUMN_WIDTH + columsTotalWidth);
        $scope.uiOptions.columWidth = parseInt(mywidth);
        
        console.log("TotalWidth :  "+ totalwidth);
        console.log("singleColumnWidth :  "+singleColumnWidth );
        console.log("mywidth :  "+mywidth );
        console.log("numColumns :  "+ numColumns);
        console.log("columsTotalWidth :  "+columsTotalWidth );
        console.log("tableWidth :  "+$scope.uiOptions.tableWidth );
        console.log("columWidth :  "+$scope.uiOptions.columWidth );
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
        $scope.computeColumWidth();
        $scope.$broadcast("showRatesClicked");
        
    };
    $scope.backButtonClicked = function(){
        angular.copy($scope.currentFilterData.rates_selected_list, $scope.ratesDisplayed);
        $scope.$broadcast("setCalendarModeRateType");
    }

}]);
