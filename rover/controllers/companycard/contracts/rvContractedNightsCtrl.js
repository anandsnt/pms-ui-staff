
sntRover.controller('rvContractedNightsCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', 'RVCompanyCardSrv', '$stateParams', function($rootScope, $scope, dateFilter, ngDialog, RVCompanyCardSrv, $stateParams) {
	$scope.nightsData = {};
	$scope.nightsData.occupancy = [];
	$scope.nightsData.allNights = "";
	var myDate = tzIndependentDate($rootScope.businessDate);
	var beginDate = $scope.formData.startDate || myDate;
	var endDate = $scope.formData.endDate || myDate.setDate(myDate.getDate() + 1);
	var first_date = new Date(beginDate);
	var last_date = new Date(endDate);

	var month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
	    	$scope.$emit('setErrorMessage', []);
	    	ngDialog.close();
	    };
	  	var saveContractFailureCallback = function(data) {
	        $scope.$emit('setErrorMessage', data);
	        $scope.contractData.occupancy = temp_occupancy;
	    };

	    var data = {"occupancy": $scope.nightsData.occupancy};

	    if ($stateParams.id === "add") {
    		var account_id = $scope.contactInformation.id;
	    }
	    else {
	    	var account_id = $stateParams.id;
		}
		
		var options = {
			successCallBack: saveContractSuccessCallback,
			failureCallBack: saveContractFailureCallback,
			params: {
				"account_id": account_id,
				"contract_id": $scope.contractData.selectedContract,
				"postData": data
			}
		}

	    if (typeof $scope.contractData.selectedContract !== 'undefined') {
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