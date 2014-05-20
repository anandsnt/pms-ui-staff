sntRover.controller('RMFilterOptionsCtrl',['$scope','RMFilterOptionsSrv','ngDialog', function($scope, RMFilterOptionsSrv, ngDialog){
  	BaseCtrl.call(this, $scope);
  	/*
    * Method to fetch all filter options
    */
    
    $scope.leftMenuDimensions = {};

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
	    },
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
  
}]);
