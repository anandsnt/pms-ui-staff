
sntRover.controller('rvContractedNightsCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', 'RVCompanyCardSrv', '$stateParams', function($rootScope, $scope, dateFilter, ngDialog, RVCompanyCardSrv, $stateParams) {
	$scope.nightsData = {};
	$scope.nightsData.occupancy = [];
	$scope.nightsData.allNights = "";
	var myDate = tzIndependentDate($rootScope.businessDate),
		beginDate = $scope.addData.startDate || myDate,
		endDate = $scope.addData.endDate || myDate.setDate(myDate.getDate() + 1),
		first_date = tzIndependentDate(beginDate),
		last_date = tzIndependentDate(endDate),

		month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		new_occupancy = [],
		start_point = first_date.getFullYear() * 12 + first_date.getMonth(),
		end_point = last_date.getFullYear() * 12 + last_date.getMonth(),
		my_point = start_point;

	while ( my_point <= end_point ) {
		var year = Math.floor(my_point / 12),
			month = my_point - year * 12,
			obj = {
				"contracted_occupancy": 0,
				"year": year,
				"actual_occupancy": 0,
				"month": month_array[month]
			};

		new_occupancy.push(obj);
		my_point += 1;
	}

	// Taking deep copy of current occupancy data
	angular.forEach($scope.contractData.occupancy, function(item, index) {
			angular.forEach(new_occupancy, function(item2, index2) {
				if ((item2.year === item.year) && (item2.month === item.month)) {
					item2.contracted_occupancy = item.contracted_occupancy;
					item2.actual_occupancy = item.actual_occupancy;
				}
    		});
    });
    $scope.nightsData.occupancy = new_occupancy;

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
			$scope.contractData.occupancy = temp_occupancy;
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
		angular.forEach($scope.nightsData.occupancy, function(item, index) {
			item.contracted_occupancy = $scope.nightsData.allNights;
	   	});
	};

	var init = function () {
		$scope.setScroller('contractedNightsScroller');
	};

	init();

}]);