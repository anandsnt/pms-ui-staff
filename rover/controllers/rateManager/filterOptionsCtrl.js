sntRover.controller('RMFilterOptionsCtrl',['$scope','RMFilterOptionsSrv','ngDialog', function($scope, RMFilterOptionsSrv, ngDialog){
	
  	BaseCtrl.call(this, $scope);
  	$scope.data = {};
  	$scope.data.selectedRatesList = [];
  	$scope.data.rates = [];
  	$scope.data.rate_types = [];
  	$scope.data.zoom_level = [{"value": "3","name": "3 days"},{"value": "4","name": "4 days"},{"value": "5","name": "5 days"},{"value": "6","name": "6 days"},{"value": "7","name": "7 days"}];
    $scope.data.date_range = [{"from": "10-10-12","to": "11-11-12"}];
    $scope.data.is_checked_all_rates = "false";   
  	/*
    * Method to fetch all filter options
    */
	$scope.fetchFilterOptions = function(){
		var fetchRatesSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.rates = data.results;
		};
		$scope.invokeApi(RMFilterOptionsSrv.fetchRates, {},fetchRatesSuccessCallback);
		var fetchRateTypesSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.rate_types = data;
		};
		$scope.invokeApi(RMFilterOptionsSrv.fetchRateTypes, {},fetchRateTypesSuccessCallback);
	};
	$scope.fetchFilterOptions();

	$scope.clickedAllRates = function(){
		if($scope.data.is_checked_all_rates == "true"){
			$scope.data.is_checked_all_rates = "false";
		}
		else{
			$scope.data.is_checked_all_rates = "true";
		}
	};
	
	$scope.showRates = function(){
		console.log("showRates");
	};
	
	$scope.$watch('data.rate_selected', function() {
		var isDataExists = false;
		angular.forEach($scope.data.selectedRatesList,function(item, index) {
       		if (item.id == $scope.data.rate_selected) {
       			isDataExists = true;
		 	}
       	});
		if(!isDataExists){
			angular.forEach($scope.data.rates,function(item, index) {
	       		if (item.id == $scope.data.rate_selected) {
	       			$scope.data.selectedRatesList.push(item);
			 	}
	       });
	    }
   	});
   	
	$scope.deleteRate = function(id){
		angular.forEach($scope.data.selectedRatesList,function(item, index) {
       		if (item.id == id) {
       			$scope.data.selectedRatesList.splice(index, 1);
		 	}
       	});
	};
	
	$scope.showCalendar = function(){
		
		ngDialog.open({
			
			 template:'/assets/partials/rateManager/selectDateRangeModal.html',
    		 controller: 'SelectDateRangeModalCtrl',
			 className: 'ngdialog-theme-default calendar-modal'
    	});
    	
	};
  
}]);