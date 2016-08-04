angular.module('sntRover').controller('roomAvailabilityMainController', [
	'$scope',
	'rvAvailabilitySrv',
	'$rootScope',
	'ngDialog',
	'$filter' ,
	'$timeout',
	function($scope, rvAvailabilitySrv, $rootScope, ngDialog, $filter, $timeout){


	BaseCtrl.call(this, $scope);

	$scope.selectedView = 'grid';
	$scope.page.title = "Availability";

	$scope.setSelectedView = function(selectedView){
		$scope.$emit("showLoader");
		$scope.selectedView = selectedView;
	};

	$scope.loadSelectedView = function(){
		if($scope.selectedView === 'grid'){
			return '/assets/partials/availability/roomAvailabilityGridStatus.html';
		}
		else if($scope.selectedView === 'graph'){
			return '/assets/partials/availability/roomAvailabilityGraphStatus.html';
		}
	};



	//default number of selected days is 14
	$scope.numberOfDaysSelected = 14;


	$scope.data = {};

	//default date value
	$scope.data.selectedDate = $rootScope.businessDate;
	$scope.data.formattedSelectedDate = $filter('date')($scope.data.selectedDate, $rootScope.dateFormat);


	// To popup contract start date
	$scope.clickedOnDatePicker = function() {
		ngDialog.open({
			template: '/assets/partials/common/rvDatePicker.html',
			controller: 'rvRoomAvailabilityDatePickerController',
			className: '',
			scope: $scope,
			closeByDocument: true
		});
	};

	/**
	* success call of availability data fetch
	*/
	var successCallbackOfAvailabilityFetch = function(data){
		if($scope.selectedView === 'graph'){
			$scope.fetchAdditionalData();
			}else{
			$scope.$emit("hideLoader");
			$scope.$broadcast("changedRoomAvailableData");
		}

	};
	/**
	* success call of availability additional data fetch
	*/

	var successCallbackOfAvailabilityAdditionalDataFetch = function(data){
		$scope.$emit("hideLoader");
		$scope.$broadcast("changedRoomAvailableData");
	};

	/**
	* error call of availability data fetch
	*/
	var fetchApiFailed = function(errorMessage){
		$scope.$emit("hideLoader");
	};

	//calculating date after number of dates selected in the select box
	$scope.getDateParams = function() {
		var dateAfter = tzIndependentDate ($scope.data.selectedDate);

		dateAfter.setDate (dateAfter.getDate() + parseInt($scope.numberOfDaysSelected) - 1);
		var dataForWebservice = {
			'from_date': $filter('date')(tzIndependentDate ($scope.data.selectedDate), $rootScope.dateFormatForAPI),
			'to_date'  : $filter('date')(tzIndependentDate (dateAfter), $rootScope.dateFormatForAPI)
		};

		return dataForWebservice;
	};

	/**
	* Api to fetch additional data
	*/
	$scope.fetchAdditionalData = function(){
		$timeout(function(){
			$scope.invokeApi(rvAvailabilitySrv.fetchAvailabilityAdditionalDetails, $scope.getDateParams(), successCallbackOfAvailabilityAdditionalDataFetch, fetchApiFailed);
		}, 0);

	};

	var successCallbackOfGrpNAllotDataFetch = function(data){
		$scope.$emit("hideLoader");
		$scope.$broadcast("changedGrpNAllotData");
	};

	/**
	* Api to fetch group AND Allotment data
	*/
	$scope.fetchGrpNAllotData = function() {
		var isSameData = function() {
			var newParams = $scope.getDateParams(),
				oldParams = $scope.oldDateParams || { 'from_date': '', 'to_date': '' };

			return newParams.from_date == oldParams.from_date && newParams.to_date == oldParams.to_date;
		};

		if ( isSameData() ) {
			successCallbackOfGrpNAllotDataFetch();
		} else {
			$timeout(function(){
				$scope.oldDateParams = $scope.getDateParams();
				$scope.invokeApi(rvAvailabilitySrv.fetchGrpNAllotAvailDetails, $scope.getDateParams(), successCallbackOfGrpNAllotDataFetch, fetchApiFailed);
			}, 0);
		};
	};

	/**
	* When there is any change of for availability data params we need to call the api
	*/
	$scope.changedAvailabilityDataParams = function(){
		$timeout(function(){
			$scope.invokeApi(rvAvailabilitySrv.fetchAvailabilityDetails, $scope.getDateParams(), successCallbackOfAvailabilityFetch, fetchApiFailed);
		}, 0);

	};

	$scope.changedAvailabilityDataParams();
	}]);