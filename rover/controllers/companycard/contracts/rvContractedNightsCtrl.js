
sntRover.controller('rvContractedNightsCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', 'RVCompanyCardSrv', '$stateParams', function($rootScope, $scope, dateFilter, ngDialog, RVCompanyCardSrv, $stateParams) {
	$scope.nightsData = {};
	$scope.nightsData.occupancy = [];
	$scope.nightsData.allNights = "";
	var myDate = tzIndependentDate($rootScope.businessDate),
		beginDate,
		endDate;

	if ($scope.contractData.mode === 'ADD') {
		myDate = $scope.addData.startDate ? tzIndependentDate($scope.addData.startDate) : myDate;
		beginDate = dateFilter(myDate, 'yyyy-MM-dd');
		endDate = $scope.addData.endDate || dateFilter(myDate.setDate(myDate.getDate() + 1), 'yyyy-MM-dd');
	}
	else if ($scope.contractData.mode === 'EDIT') {
		myDate = $scope.contractData.editData && $scope.contractData.editData.begin_date ?
				tzIndependentDate($scope.contractData.editData.begin_date) :
				myDate;
		beginDate = dateFilter(myDate, 'yyyy-MM-dd');
		endDate = $scope.contractData.editData.end_date || dateFilter(myDate.setDate(myDate.getDate() + 1), 'yyyy-MM-dd');
	}
	var	firstDate = tzIndependentDate(beginDate),
		lastDate = tzIndependentDate(endDate),
		monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		newOccupancy = [],
		startPoint = firstDate.getFullYear() * 12 + firstDate.getMonth(),
		endPoint = lastDate.getFullYear() * 12 + lastDate.getMonth(),
		myPoint = startPoint;

	while ( myPoint <= endPoint ) {
		var year = Math.floor(myPoint / 12),
			month = myPoint - year * 12,
			obj = {
				"contracted_occupancy": 0,
				"year": year.toString(),
				"actual_occupancy": 0,
				"month": monthArray[month]
			};

		newOccupancy.push(obj);
		myPoint += 1;
	}
	var currentOccupancy = $scope.contractData.editData && $scope.contractData.editData.occupancy; 

	// Taking deep copy of current occupancy data
	angular.forEach(currentOccupancy, function(item) {
		angular.forEach(newOccupancy, function(item2) {
			if ((item2.year === item.year) && (item2.month === item.month)) {
				item2.contracted_occupancy = item.contracted_occupancy;
				item2.actual_occupancy = item.actual_occupancy;
			}
		});
    });
    $scope.nightsData.occupancy = newOccupancy;

	/*
	 * To save contract Nights.
	 */
	$scope.saveContractedNights = function() {
		var saveContractSuccessCallback = function(data) {
			$scope.contractData.total_contracted_nights = data.total_contracted_nights;
			$scope.contractData.occupancy = $scope.nightsData.occupancy;
			$scope.contractData.selectedContract = data.id;
			$scope.$emit('setErrorMessage', []);
			$scope.$emit('fetchContractsList');
			ngDialog.close();
		},
		saveContractFailureCallback = function(data) {
			$scope.$emit('setErrorMessage', data);
		},
		data = {"occupancy": $scope.nightsData.occupancy},
		accountId;

		if ($stateParams.id === "add") {
			accountId = $scope.contactInformation.id;
		}
		else {
			accountId = $stateParams.id;
		}

		var currentContract = $scope.contractData.selectedContract || null,
			options = {
				successCallBack: saveContractSuccessCallback,
				failureCallBack: saveContractFailureCallback,
				params: {
					"account_id": accountId,
					"contract_id": currentContract,
					"postData": data
				}
			};

		if (currentContract) {
			$scope.callAPI(RVCompanyCardSrv.updateNight, options);
		}
	};

	$scope.clickedCancel = function() {
		ngDialog.close();
	};
	/*
	 * To update all nights contract nights.
	 */
	$scope.updateAllNights = function() {
		angular.forEach($scope.nightsData.occupancy, function(item) {
			item.contracted_occupancy = $scope.nightsData.allNights;
		});
	};

	var init = function () {
		$scope.setScroller('contractedNightsScroller');
	};

	init();

}]);