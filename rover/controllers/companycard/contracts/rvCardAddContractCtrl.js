angular.module('sntRover').controller('rvCardAddContractsCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', 'dateFilter', '$timeout',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter, $timeout) {
        BaseCtrl.call(this, $scope);

        $scope.formData = {
            contractName: '',
            accessCode: '',
            startDate: null,
            endDate: null,
            contractedNights: 0,
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
            var saveContractSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = "";
				$scope.contractData.mode = '';
				// updateContractList(data); yet to handle
			}, saveContractFailureCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			}, postData = {
                'access_code':$scope.formData.accessCode,
                'contract_name': $scope.formData.contractName,
                'begin_date': $scope.formData.startDate,
                'end_date': $scope.formData.endDate,
                'total_contracted_nights': $scope.formData.contractedNights
            }, account_id = $scope.contactInformation.id || $stateParams.id,
            options = {
                params: {
                    'account_id': account_id,
                    'postData': postData
                },
                successCallBack: saveContractSuccessCallback,
				failureCallBack: saveContractFailureCallback
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
