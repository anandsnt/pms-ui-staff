sntRover.controller('RMFilterOptionsCtrl',['$scope','RMFilterOptionsSrv','ngDialog', function($scope, RMFilterOptionsSrv, ngDialog){
    BaseCtrl.call(this, $scope);
    /*
    * Method to fetch all filter options
    */
    
    $scope.leftMenuDimensions = {};
    //company card search query text
    $scope.companySearchText = "";
    $scope.companyCardResults = [];

    var heightOfComponents = 500;
    var headerHeight = 60;
    var heightOfFixedComponents = 140;

    $scope.leftMenuDimensions.outerContainerHeight = $(window).height() > heightOfComponents ? heightOfComponents : $(window).height() - headerHeight;

    $scope.leftMenuDimensions.scrollableContainerHeight = $scope.leftMenuDimensions.outerContainerHeight - heightOfFixedComponents;   

    $scope.$parent.myScrollOptions = {
        'filter_details': {
            scrollbars: true,
            snap: false,            
            preventDefault: false,
            interactiveScrollbars: true
        }
    };
    
    $scope.$on('$viewContentLoaded', function() {
        setTimeout(function(){          
            $scope.$parent.myScroll['filter_details'].refresh();
            }, 
        3000);
        
     });

    $scope.fetchFilterOptions = function(){
        var fetchRatesSuccessCallback = function(data) {
            $scope.$emit('hideLoader');
            $scope.currentFilterData.rates = data.results;
        };
        $scope.invokeApi(RMFilterOptionsSrv.fetchRates, {},fetchRatesSuccessCallback);
        var fetchRateTypesSuccessCallback = function(data) {
            $scope.$emit('hideLoader');
            $scope.currentFilterData.rate_types = data;
        };
        $scope.invokeApi(RMFilterOptionsSrv.fetchRateTypes, {},fetchRateTypesSuccessCallback);
    };
    $scope.fetchFilterOptions();

    $scope.clickedAllRates = function(){
        if($scope.currentFilterData.is_checked_all_rates){
            $scope.currentFilterData.is_checked_all_rates = false;
        }
        else{
            $scope.currentFilterData.is_checked_all_rates = true;
        }
        setTimeout(function(){
            $scope.$$childTail.$parent.myScroll['filter_details'].refresh();
            }, 300);
    };
    
    
    
    $scope.$watch('currentFilterData.rate_selected', function() {
        var isDataExists = false;
        angular.forEach($scope.currentFilterData.rates_selected_list,function(item, index) {
            if (item.id == $scope.currentFilterData.rate_selected) {
                isDataExists = true;
            }
        });
        if(!isDataExists){
            angular.forEach($scope.currentFilterData.rates,function(item, index) {
                if (item.id == $scope.currentFilterData.rate_selected) {
                    $scope.currentFilterData.rates_selected_list.push(item);
                }
           });
        }
    });
    
    $scope.deleteRate = function(id){
        angular.forEach($scope.currentFilterData.rates_selected_list,function(item, index) {
            if (item.id == id) {
                $scope.currentFilterData.rates_selected_list.splice(index, 1);
            }
        });
    };
    
    $scope.showCalendar = function(){
        ngDialog.open({
             template: '/assets/partials/rateManager/selectDateRangeModal.html',
             controller: 'SelectDateRangeModalCtrl',
             className: 'ngdialog-theme-default calendar-modal',
             scope: $scope
        });
    };

    /**
    * company search 
    */
    $scope.companySearchTextEntered = function(){
        if($scope.companySearchText.length === 0){
            $scope.companyCardResults = [];
        }
        else{
            setTimeout(function(){displayFilteredResults();}, 500);
            // displayFilteredResults();
        }
    };

    //if no replace value is passed, it returns an empty string
    
    var escapeNull = function(value){
        var valueToReturn = ((value == null || typeof value == 'undefined' ) ? '' : value);
        return valueToReturn;
    };

    var successCallBackOfCompanySearch = function(data){
        $scope.$emit("hideLoader");
        // $scope.companyCardResults = data.accounts;

        // TODO - Replace below hardcoded values with above commented out line once API is ready
        $scope.companyCardResults = [
                                        {
                                            "first_name": "Isabelle",
                                            "last_name": "Park"
                                        },
                                        {
                                            "first_name": "Trevino",
                                            "last_name": "Black"
                                        },
                                        {
                                            "first_name": "Suarez",
                                            "last_name": "Mercer"
                                        },
                                        {
                                            "first_name": "Banks",
                                            "last_name": "Sharp"
                                        },
                                        {
                                            "first_name": "Heath",
                                            "last_name": "Wyatt"
                                        },
                                        {
                                            "first_name": "Lorna",
                                            "last_name": "Galloway"
                                        },
                                        {
                                            "first_name": "Millicent",
                                            "last_name": "Drake"
                                        },
                                        {
                                            "first_name": "Rivas",
                                            "last_name": "House"
                                        }
                                    ]
        // setTimeout(function(){refreshScroller();}, 750);
    }

    /**
    * function to perform filering on results.
    * if not fouund in the data, it will request for webservice
    */
    var displayFilteredResults = function(){ 
        //if the entered text's length < 3, we will show everything, means no filtering    
        if($scope.companySearchText.length < 3){
          //based on 'is_row_visible' parameter we are showing the data in the template      
          for(var i = 0; i < $scope.companyCardResults.length; i++){
              $scope.companyCardResults[i].is_row_visible = true;
          }     
          
          // we have changed data, so we are refreshing the scrollerbar
          // refreshScroller();      
        }
        else{
          var value = ""; 
          var visibleElementsCount = 0;
          //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
          //if it is zero, then we will request for webservice
          for(var i = 0; i < $scope.companyCardResults.length; i++){
            value = $scope.companyCardResults[i];
            if (($scope.escapeNull(value.first_name).toUpperCase()).indexOf($scope.companySearchText.toUpperCase()) >= 0 || 
                ($scope.escapeNull(value.last_name).toUpperCase()).indexOf($scope.companySearchText.toUpperCase()) >= 0 ) 
                {
                   $scope.companyCardResults[i].is_row_visible = true;
                   visibleElementsCount++;
                }
            else {
              $scope.companyCardResults[i].is_row_visible = false;
            }
                  
          }
          // last hope, we are looking in webservice.      
         if(visibleElementsCount == 0){   
            var paramDict = {'query': $scope.companySearchText.trim()};
            $scope.invokeApi(RMFilterOptionsSrv.fetchCompanyCard, paramDict, successCallBackOfCompanySearch);
          }
          // we have changed data, so we are refreshing the scrollerbar
          // refreshScroller();                  
        }
    };

    $scope.setCompanyCardFilter = function(name){
        $scope.companySearchText = name;
        $scope.currentFilterData.name_on_cards.push(name);
        // reset company card result array
        $scope.companyCardResults = [];
    }
  
}]);
