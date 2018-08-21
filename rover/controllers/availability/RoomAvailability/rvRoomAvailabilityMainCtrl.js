angular.module('sntRover').controller('roomAvailabilityMainController', [
	'$scope',
	'rvAvailabilitySrv',
	'$rootScope',
	'ngDialog',
	'$filter',
	'$timeout',
    '$q',
    '$state',
	function($scope, rvAvailabilitySrv, $rootScope, ngDialog, $filter, $timeout, $q, $state) {


	BaseCtrl.call(this, $scope);

	$scope.selectedView = 'grid';
	$scope.page.title = "Availability";

	$scope.setSelectedView = function(selectedView) {
		$scope.$emit("showLoader");
		$scope.selectedView = selectedView;
	};

	$scope.loadSelectedView = function() {
		if ($scope.selectedView === 'grid') {
			return '/assets/partials/availability/roomAvailabilityGridStatus.html';
		}
		else if ($scope.selectedView === 'graph') {
			return '/assets/partials/availability/roomAvailabilityGraphStatus.html';
		}
	};


	// default number of selected days is 14
	$scope.numberOfDaysSelected = '14';

	$scope.data = {};

	// default date value
	$scope.data.selectedDate = $rootScope.businessDate;
	$scope.data.formattedSelectedDate = $filter('date')($scope.data.selectedDate, $rootScope.dateFormat);
	$scope.data.isIncludeOverbooking = false;

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
	var successCallbackOfAvailabilityFetch = function(data) {
		if ($scope.selectedView === 'graph') {
			$scope.fetchAdditionalData();
			} else {
			$scope.$emit("hideLoader");
			$scope.$broadcast("changedRoomAvailableData");
		}

	};
	/**
	* success call of availability additional data fetch
	*/

	var successCallbackOfAvailabilityAdditionalDataFetch = function(data) {
		$scope.$emit("hideLoader");
		$scope.$broadcast("changedRoomAvailableData");
	};

	/**
	* error call of availability data fetch
	*/
	var fetchApiFailed = function(errorMessage) {
		$scope.$emit("hideLoader");
	};

	// calculating date after number of dates selected in the select box
	$scope.getDateParams = function() {
		var dateAfter = tzIndependentDate ($scope.data.selectedDate);

		dateAfter.setDate (dateAfter.getDate() + parseInt($scope.numberOfDaysSelected) - 1);
		var dataForWebservice = {
			'from_date': $filter('date')(tzIndependentDate ($scope.data.selectedDate), $rootScope.dateFormatForAPI),
			'to_date': $filter('date')(tzIndependentDate (dateAfter), $rootScope.dateFormatForAPI),
			'is_include_overbooking': $scope.data.isIncludeOverbooking
		};

		return dataForWebservice;
	};

	/**
	* Api to fetch additional data
	*/
	$scope.fetchAdditionalData = function() {
		$timeout(function() {
			$scope.invokeApi(rvAvailabilitySrv.fetchAvailabilityAdditionalDetails, $scope.getDateParams(), successCallbackOfAvailabilityAdditionalDataFetch, fetchApiFailed);
		}, 0);

	};

	/**
	* Api to fetch group AND Allotment data
	*/
	$scope.fetchGrpNAllotData = function() {
        var deferred = $q.defer();

		var isSameData = function() {
			var newParams = $scope.getDateParams(),
				oldParams = $scope.oldDateParams || { 'from_date': '', 'to_date': '' };

			return newParams.from_date == oldParams.from_date && newParams.to_date == oldParams.to_date;
		};

        var successCallbackOfGrpNAllotDataFetch = function() {
            $scope.$emit('hideLoader');
            $scope.$broadcast('changedGrpNAllotData');
            deferred.resolve( true );
        };

		if ( isSameData() ) {
			successCallbackOfGrpNAllotDataFetch();
		} else {
			$timeout(function() {
				$scope.oldDateParams = $scope.getDateParams();
				$scope.invokeApi(
                    rvAvailabilitySrv.fetchGrpNAllotAvailDetails,
                    $scope.getDateParams(),
                    successCallbackOfGrpNAllotDataFetch,
                    fetchApiFailed
                );
			}, 0);
		}

        return deferred.promise;
	};

	$scope.printAvaiability = function () {
		$scope.$broadcast('PRINT_AVAILABILITY');
	};

	$scope.shouldShowPrint = function () {
		var DAYS = '14',
			ROOM = 'room';

        return DAYS === $scope.numberOfDaysSelected && ROOM === $scope.availabilityToShow;
	};

	/**
	* When there is any change of for availability data params we need to call the api
	*/
	$scope.changedAvailabilityDataParams = function() {
		$timeout(function() {
			$scope.invokeApi(rvAvailabilitySrv.fetchAvailabilityDetails, $scope.getDateParams(), successCallbackOfAvailabilityFetch, fetchApiFailed);
		}, 0);

	};
	// Handle include overbooking button click
	$scope.clickedIncludeOverbooking = function() {
		$scope.data.isIncludeOverbooking = !$scope.data.isIncludeOverbooking;
		$scope.$broadcast('INCLUDE_OVERBOOKING', $scope.data.isIncludeOverbooking);
		$scope.changedAvailabilityDataParams();
	};

	$scope.changedAvailabilityDataParams();

	/**
	 * Navigate to create reservation flow first page with the given params
	 * @param {Object} roomTypeInfo - roomtypeinfo holding room type info
	 * @param {Array}  dates - Array of dates for which the availability is shown
	 * @param {Integer} selectedDateIdx index of the dates for which the room type is chosen
	 * @return {void}
	 */
	$scope.navigateToCreateReservation = function(roomTypeInfo, dates, selectedDateIdx) {
		$state.go('rover.reservation.search', {
			selectedArrivalDate: dates[selectedDateIdx].date,
			selectedRoomTypeId: roomTypeInfo.id
		});
		$scope.$emit('CLOSE_AVAILIBILTY_SLIDER');
	};

	}]);