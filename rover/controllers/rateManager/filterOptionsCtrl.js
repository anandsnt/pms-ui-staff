sntRover.controller('RMFilterOptionsCtrl',['$scope','RMFilterOptionsSrv','ngDialog', function($scope, RMFilterOptionsSrv, ngDialog){
  	BaseCtrl.call(this, $scope);
  	/*
    * Method to fetch all filter options
    */
    


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
