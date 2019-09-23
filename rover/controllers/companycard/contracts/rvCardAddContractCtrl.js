angular.module('sntRover').controller('rvCardAddContractsCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog',
	function($scope, RVCompanyCardSrv, $stateParams, ngDialog) {
        BaseCtrl.call(this, $scope);
        var showNightsModal = false;
        var saveNewContractSuccessCallback = function(data) {
            $scope.errorMessage = "";
            $scope.contractData.mode = '';
            if (showNightsModal) {
                ngDialog.open({
                    template: '/assets/partials/companyCard/contracts/rvContractedNightsPopup.html',
                    controller: 'rvContractedNightsCtrl',
                    className: 'ngdialog-theme-default1 calendar-single1',
                    scope: $scope
                });
                showNightsModal = false;
            };
            // emit something to refresh the Contracts list
            $scope.$emit('closeNewContractsForm')
        };

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
            $scope.$emit('closeNewContractsForm');
        };

        $scope.saveNewContract = function() {
            var account_id;

            if ($stateParams.id === "add") {
                account_id = $scope.contactInformation.id;
            } else {
                account_id = $stateParams.id;
            };
            var postData = {
                'access_code':$scope.formData.accessCode,
                'contract_name': $scope.formData.contractName,
                'begin_date': $scope.formData.startDate,
                'end_date': $scope.formData.endDate,
                'total_contracted_nights': $scope.formData.contractedNights
            }, options = {
                params: {
                    'account_id': account_id,
                    'postData': postData
                },
                successCallBack: saveNewContractSuccessCallback
            };

            $scope.callApi(RVCompanyCardSrv.addNewContract, options);
        };

        // To popup contract start date
		$scope.contractStart = function() {
			ngDialog.open({
				template: '/assets/partials/companyCard/contracts/rvCompanyCardContractsCalendar.html',
				controller: 'rvContractStartCalendarCtrl',
				className: '',
				scope: $scope
			});
        };
        
        // To popup contract end date
		$scope.contractEnd = function() {
			ngDialog.open({
				template: '/assets/partials/companyCard/contracts/rvCompanyCardContractsCalendar.html',
				controller: 'rvContractEndCalendarCtrl',
				className: '',
				scope: $scope
			});
        };
        
        // Show contracted nights popup
        $scope.contractedNights = function() {
            showNightsModal = true;
            $scope.saveNewContract();
        };
    }
]);
