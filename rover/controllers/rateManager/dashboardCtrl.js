sntRover.controller('RMDashboradCtrl', ['$scope','$window','dateFilter', '$filter',  function($scope,$window,dateFilter, $filter){
    
    BaseCtrl.call(this, $scope);

    var title = $filter('translate')('RATE_MANAGER_TITLE');
	$scope.setTitle(title);
	
    $scope.$emit("updateRoverLeftMenu","rateManager");

    $scope.displayMode = "CALENDAR";
    //$scope.filterConfigured = false;
    var defaultDateRange = 7;
    $scope.backbuttonEnabled = false;
    
    //left side menu class, based on which it will appear or not
    $scope.currentLeftMenuClass = 'slide_right';
    

	$scope.currentFilterData =	{
           filterConfigured: false,
           begin_date : "",//dateFilter(new Date(), 'yyyy-MM-dd'),
           end_date : "",//dateFilter(new Date((new Date()).getTime() + defaultDateRange*24*60*60*1000), 'yyyy-MM-dd'),
           zoom_level : [{"value": "3","name": "3 days"},{"value": "4","name": "4 days"},{"value": "5","name": "5 days"},{"value": "6","name": "6 days"},{"value": "7","name": "7 days"}],
           zoom_level_selected : "3",
           is_checked_all_rates : true,
           rate_types: [],
           rate_type_selected_list : [],
           rates : [],
           rates_selected_list : [],
           name_cards : [],
           selected_date_range : "Select Date Range"
   	};

    /* UI options like column width are computed here 
       A property, and a function to compute the same are given below
    */
    var DEFAULT_COLUMN_WIDTH = 200;
    var DEFAULT_TABLE_WIDTH = 4000;
    var DEFAULT_TABLE_WIDTH = 400;
    $scope.uiOptions={
        tableHeight : DEFAULT_TABLE_WIDTH,
        columWidth : DEFAULT_COLUMN_WIDTH,
        tableWidth : DEFAULT_TABLE_WIDTH,
        
    };

    $scope.computeColumWidth = function(){

        var FILTER_OPTIONS_WIDTH = 5;
        var FIRST_COLUMN_WIDTH = 220;
        var COLUMN_BORDER_WIDTH = 20;
        var TOP_BOTTOM_HEIGHT = 240;

        var totalwidth = $window.innerWidth - FILTER_OPTIONS_WIDTH - FIRST_COLUMN_WIDTH; //Adjusting for left side .
  
        var mywidth = totalwidth/parseInt($scope.currentFilterData.zoom_level_selected);
        var numColumns = new Date($scope.currentFilterData.end_date) - new Date($scope.currentFilterData.begin_date);
        numColumns = numColumns/(24*60*60*1000) + 1;
        if (numColumns < parseInt($scope.currentFilterData.zoom_level_selected)){
          numColumns = parseInt($scope.currentFilterData.zoom_level_selected);
        }

        var columsTotalWidth = numColumns * mywidth;
        if ( columsTotalWidth < totalwidth) columsTotalWidth = totalwidth; //@minimum, table should cover full view.
        $scope.uiOptions.tableWidth = parseInt(FIRST_COLUMN_WIDTH + columsTotalWidth);
        $scope.uiOptions.tableHeight = $window.innerHeight - TOP_BOTTOM_HEIGHT;
        $scope.uiOptions.columWidth = parseInt(mywidth);
        
    };

    $scope.ratesDisplayed = [];

    $scope.showCalendarView = function(){
        $scope.displayMode = "CALENDAR";
    };

    $scope.showGraphView = function(){
        $scope.displayMode = "GRAPH";
    };

    $scope.showRatesBtnClicked = function(){
        //$scope.filterConfigured = true;
        $scope.computeColumWidth();
        $scope.toggleLeftMenu();
        $scope.$broadcast("showRatesClicked");
        
    };
    $scope.backButtonClicked = function(){
        $scope.backbuttonEnabled = false;
        $scope.displayMode = "CALENDAR";
        angular.copy($scope.currentFilterData.rates_selected_list, $scope.ratesDisplayed);
        $scope.$broadcast("setCalendarModeRateType");
    }

    $scope.$on("enableBackbutton", function(){
        $scope.backbuttonEnabled = true;
    });


    /**
    * function to handle left side menu toggling
    */
    $scope.toggleLeftMenu = function()   {
      if ($scope.currentLeftMenuClass == 'slide_right'){
        $scope.currentLeftMenuClass = 'slide_left';
      }
      else{
        $scope.currentLeftMenuClass = 'slide_right';
      }
    }

    /*
    * function to handle click
    */

    $scope.rateManagerContentClick = function($event){

       $scope.$broadcast('closeFilterPopup');
    }

}]);
