angular.module('sntRover').controller('rvCardEditContractsCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', '$timeout',
	function($scope, RVCompanyCardSrv, $stateParams, ngDialog, $timeout) {
        BaseCtrl.call(this, $scope);

        $scope.setScroller('editContractScroller');
        var refreshEditScroller = function() {
            $timeout(function() {
				$scope.refreshScroller('editContractScroller');
			}, 500);
        };

        /**
         * Listener for edit scroller refresh
         */
        $scope.addListener('refreshEditScroller', refreshEditScroller);

        /**
         * Function for updating the contract
         */
        $scope.updateContract = function() {
            var changedData = {
                'access_code':$scope.contractData.editData.access_code,
                'contract_name': $scope.contractData.editData.contract_name,
                'begin_date': $scope.contractData.editData.begin_date,
                'end_date': $scope.contractData.editData.end_date,
                'total_contracted_nights': $scope.contractData.editData.total_contracted_nights,
                'is_active': $scope.contractData.editData.is_active
            },
            updateContractSuccessCallback = function(data) {
				$scope.$emit('fetchContractsList');
            },
            updateContractFailureCallback = function(data) {
				$scope.$emit('setErrorMessage', data);
				$scope.$parent.currentSelectedTab = 'cc-contracts';
            },
            accountId;

            if ($stateParams.id === "add") {
                accountId = $scope.contactInformation.id;
            } else {
                accountId = $stateParams.id;
            }
            var options = {
                params: {
                    'account_id': accountId,
                    "contract_id": $scope.contractData.selectedContract,
                    'postData': changedData
                },
                failureCallBack: updateContractFailureCallback,
                successCallBack: updateContractSuccessCallback
            };

            $scope.callAPI(RVCompanyCardSrv.updateContract, options);
        };

        /**
         * Function to toggle contract active status
         */
        $scope.toggleActiveStatus = function() {
            if (!$scope.contractData.disableFields) {
                $scope.contractData.editData.is_active = !$scope.contractData.editData.is_active;
            }
        };

        // To popup contract start date
		$scope.contractStart = function() {
            if (!$scope.contractData.disableFields) {
                ngDialog.open({
                    template: '/assets/partials/companyCard/contracts/rvCompanyCardContractsCalendar.html',
                    controller: 'rvContractStartCalendarCtrl',
                    className: '',
                    scope: $scope
                });
            }
        };
        
        // To popup contract end date
		$scope.contractEnd = function() {
            if (!$scope.contractData.disableFields) {
                ngDialog.open({
                    template: '/assets/partials/companyCard/contracts/rvCompanyCardContractsCalendar.html',
                    controller: 'rvContractEndCalendarCtrl',
                    className: '',
                    scope: $scope
                });
            }
        };
        
        // Show contracted nights popup
        $scope.editContractedNights = function() {
            if (!$scope.contractData.disableFields) {
                ngDialog.open({
                    template: '/assets/partials/companyCard/contracts/rvContractedNightsPopup.html',
                    controller: 'rvContractedNightsCtrl',
                    className: '',
                    scope: $scope
                });
            }            
        };
    }
]);