sntRover.controller('roomAvailabilityMainController', [		
	'$scope', 
	'rvAvailabilitySrv',
	'$rootScope',
	'ngDialog', 
	function($scope, rvAvailabilitySrv, $rootScope, ngDialog){
	

	BaseCtrl.call(this, $scope);
	
	$scope.selectedView = 'grid';

	$scope.setSelectedView = function(selectedView){
		$scope.selectedView = selectedView;
	};

	$scope.loadSelectedView = function(){
		if($scope.selectedView == 'grid'){
			return '/assets/partials/availability/roomAvailabilityGridStatus.html';
		}
		else if($scope.selectedView == 'graph'){
			return '/assets/partials/availability/roomAvailabilityGraphStatus.html';
		}
	}



	//default number of selected days is 14
	$scope.numberOfDaysSelected = 14;


	$scope.data = {};

	//default date value
	$scope.data.selectedDate = $rootScope.businessDate;






	// To popup contract start date
	$scope.clickedOnDatePicker = function() {
		ngDialog.open({
			template: '/assets/partials/common/rvDatePicker.html',
			controller: 'rvAvailabilityDatePickerController',
			className: 'ngdialog-theme-default calendar-single1',
			scope: $scope,
			closeByDocument: true
		});
	};	

	/**
	* success call of availability data fetch
	*/
	var successCallbackOfAvailabilityFetch = function(data){
		$scope.$emit("hideLoader");
		rvAvailabilitySrv.updateData(data);
		$scope.$broadcast("changedRoomAvailableData");
		// for this successcallback we are not hiding the activty indicator
		// we will hide it only after template loading.

	}

	/**
	* error call of availability data fetch
	*/
	var failureCallbackOfAvailabilityFetch = function(errorMessage){
		$scope.$emit("hideLoader");

	};


	/**
	* When there is any change of for availability data params we need to call the api
	*/	
	$scope.changedAvailabilityDataParams = function(){
		//calculating date after number of dates selected in the select box
		var dateAfter = tzIndependentDate ($scope.data.selectedDate);

		dateAfter.setDate (dateAfter.getDate() + $scope.numberOfDaysSelected);
		var dataForWebservice = {
			'from_date': tzIndependentDate ($scope.data.selectedDate),
			'to_date'  : "2014-08-30T00:00:00.000Z"
		}
		$scope.invokeApi(rvAvailabilitySrv.fetchAvailabilityDetails, dataForWebservice, successCallbackOfAvailabilityFetch, failureCallbackOfAvailabilityFetch);						
	};	


	$scope.changedAvailabilityDataParams();
	}]);