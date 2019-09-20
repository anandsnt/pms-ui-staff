angular.module('sntRover').controller('rvCardAddContractsCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', 'dateFilter', '$timeout',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter, $timeout) {
        BaseCtrl.call(this, $scope);

        $scope.formData = {
            contractName: '',
            accessCode: '',
            startDate: null,
            endDate: null,
            contractedNights: '',
            contractedRates: [],
            isActive: false
        };

        $scope.toggleActiveStatus = function() {
            $scope.formData.isActive = !$scope.formData.isActive;
        };

        $scope.cancelNewContract = function() {
            $scope.$emit('closeContractsForm');
        };
        // Remove this function and rename the next one once the API is ready
        $scope.saveNewContract = function() {
            console.log($scope.formData);
        };

        $scope.saveContract = function() {
            var postData = {
                'access_code':'StayN',
                'contract_name': 'testARteeasafaf',
                'begin_date': '2015-07-27',
                'end_date': '2023-07-19',
                'total_contracted_nights': 0
            }, options = {
                params: {
                    account_id: $stateParams.id,
                    postData: $scope.formData
                }
            }

            $scope.callApi(RVCompanyCardSrv.addNewContract, options);
        };

        // To popup contract start date
		$scope.contractStart = function() {
			ngDialog.open({
				template: '/assets/partials/companyCard/contracts/rvCompanyCardContractsCalendar.html',
				controller: 'contractStartCalendarCtrl',
				className: 'calendar-single1',
				scope: $scope
			});
        };
        
        // To popup contract end date
		$scope.contractEnd = function() {
			ngDialog.open({
				template: '/assets/partials/companyCard/contracts/rvCompanyCardContractsCalendar.html',
				controller: 'contractEndCalendarCtrl',
				className: 'calendar-single1',
				scope: $scope
			});
        };
        
        // Show contracted nights popup
        $scope.contractedNights = function() {
            ngDialog.open({
                template: '/assets/partials/companyCard/contracts/rvContractedNightsPopup.html',
                controller: 'contractedNightsCtrl',
                className: 'ngdialog-theme-default1 calendar-single1',
                scope: $scope
            });
        }
    }
]);
