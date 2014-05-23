sntRover.controller('RMFilterOptionsCtrl',['$scope','RMFilterOptionsSrv','ngDialog', function($scope, RMFilterOptionsSrv, ngDialog){
    BaseCtrl.call(this, $scope);
    /*
    * Method to fetch all filter options
    */
    
    $scope.leftMenuDimensions = {};
    //company card search query text
    $scope.companySearchText = "";
    $scope.companyLastSearchText = "";
    $scope.companyCardResults = [];

    $scope.cmpCardSearchDivHgt = 42;
    $scope.cmpCardSearchDivTop = 0;
    $scope.arrowPosFromTop = 0;

    var companyCardFetchInterval = '';

    var heightOfComponents = 500;
    var headerHeight = 60;
    var heightOfFixedComponents = 140;
    var variableComponentHeight = 90;
    var maxSize = $(window).height() - headerHeight;

    $scope.leftMenuDimensions.outerContainerHeight = $(window).height() > heightOfComponents ? heightOfComponents : maxSize;

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
    * company card search text entered
    */
    $scope.companySearchTextEntered = function(){
        if($scope.companySearchText.length === 0){
            $scope.companyCardResults = [];
        }
        else{
            companyCardFetchInterval = window.setInterval(function(){displayFilteredResults();}, 500);
        }
    };


    //if no replace value is passed, it returns an empty string
    
    var escapeNull = function(value){
        var valueToReturn = ((value == null || typeof value == 'undefined' ) ? '' : value);
        return valueToReturn;
    };

    var refreshScroller = function(){
        $scope.cmpCardSearchDivHgt = "250";
        $scope.arrowPosFromTop = $('#company-card').offset().top;
        var popOverBottomPosFromTop = $('#company-card').offset().top + 20;
        var totalHeight = $('#search-list').height();
        if(totalHeight < $scope.cmpCardSearchDivHgt){
            $scope.cmpCardSearchDivHgt = totalHeight;
        }
        $scope.cmpCardSearchDivTop = popOverBottomPosFromTop - $scope.cmpCardSearchDivHgt + 10;
    }

    var successCallBackOfCompanySearch = function(data){
        $scope.$emit("hideLoader");
        $scope.companyCardResults = data.accounts;
        refreshScroller();
    }

    /**
    * function to perform filering on results.
    * if not fouund in the data, it will request for webservice
    */
    var displayFilteredResults = function(){
        if($scope.companySearchText !='' && $scope.companyLastSearchText != $scope.companySearchText){
            var paramDict = {'query': $scope.companySearchText.trim()};
            $scope.invokeApi(RMFilterOptionsSrv.fetchCompanyCard, paramDict, successCallBackOfCompanySearch);
            // we have changed data, so we are refreshing the scrollerbar
            $scope.companyLastSearchText = $scope.companySearchText;
            clearInterval(companyCardFetchInterval);
            refreshScroller(); 
        }
    };

    $scope.setCompanyCardFilter = function(name){
        $scope.companySearchText = name;
        $scope.currentFilterData.name_on_cards.push(name);
        // reset company card result array
        $scope.companyCardResults = [];
    }

	$scope.clickedAllRates = function(){
		if($scope.currentFilterData.is_checked_all_rates){
			$scope.currentFilterData.is_checked_all_rates = false;
			$scope.leftMenuDimensions.scrollableContainerHeight = Math.min($scope.leftMenuDimensions.scrollableContainerHeight + variableComponentHeight, maxSize - heightOfFixedComponents);
		}
		else{
			$scope.currentFilterData.is_checked_all_rates = true;
    		$scope.leftMenuDimensions.scrollableContainerHeight = $scope.leftMenuDimensions.outerContainerHeight - heightOfFixedComponents;   
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
}]);
