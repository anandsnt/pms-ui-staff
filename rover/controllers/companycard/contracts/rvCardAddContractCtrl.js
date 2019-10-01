angular.module('sntRover').controller('rvCardAddContractsCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', '$timeout',
	function($scope, RVCompanyCardSrv, $stateParams, ngDialog, $timeout) {
        BaseCtrl.call(this, $scope);
        var that = this;

        /* Items related to ScrollBars
		 * 1. When the tab is activated, refresh scroll.
		 * 2. Scroll is actually on a sub-scope created by ng-include.
		 *    So ng-iscroll will create the ,myScroll Array there, if not defined here.
		 */

		$scope.setScroller('cardNewContractsScroll');

		var refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('cardNewContractsScroll');
			}, 500);
		};

		/** ** Scroll related code ends here. ****/
        /**
         * @param {Object} data - API response of save new contract as the input
         * @return void
         */
        var saveNewContractSuccessCallback = function(data) {
            $scope.$emit('setErrorMessage', []);
            $scope.contractData.mode = 'EDIT';
            $scope.contractData.selectedContract = data.id;
            // emit something to refresh the Contracts list
            $scope.$emit('fetchContractsList');
            that.init();
        };

        /**
         * Failure callback for save API
         * @param {String} error - error string
         * @return void
         */
        var saveNewContractFailureCallback = function(error) {
            $scope.$emit('setErrorMessage', error);
            $scope.contractData.showNightsModal = false;
        };

        /**
         * Post object initializer
         */
        that.init = function() {
            $scope.addData = {
                contractName: '',
                accessCode: '',
                startDate: null,
                endDate: null,
                contractedNights: 0,
                contractedRates: [],
                isActive: true
            };
        };
        
        /**
         * Listener for scroll refresh
         */
        $scope.addListener('refreshAddScroller', refreshScroller);

        $scope.addListener('addDataReset', function() {
            if (!_.isEmpty($scope.addData)) {
                that.init();
                $scope.contractData.showNightsModal = false;
            }
        });

        /**
         * Function to toggle contract's active/inactive status
         */
        $scope.toggleActiveStatus = function() {
            $scope.addData.isActive = !$scope.addData.isActive;
        };

        /**
         * Function to cancel and close the new contract form
         */
        $scope.cancelNewContract = function() {
            $scope.contractData.mode = '';
            $scope.$emit('fetchContractsList');
            that.init();
        };

        /**
         * Function to save the new contract
         */
        $scope.saveNewContract = function() {
            var accountId;

            if ($stateParams.id === "add") {
                accountId = $scope.contactInformation.id;
            } else {
                accountId = $stateParams.id;
            }
            var postData = {
                'access_code': $scope.addData.accessCode,
                'contract_name': $scope.addData.contractName,
                'begin_date': $scope.addData.startDate,
                'end_date': $scope.addData.endDate,
                'total_contracted_nights': $scope.addData.contractedNights,
                'is_active': $scope.addData.isActive
            }, options = {
                params: {
                    'account_id': accountId,
                    'postData': postData
                },
                failureCallBack: saveNewContractFailureCallback,
                successCallBack: saveNewContractSuccessCallback
            };

            $scope.callAPI(RVCompanyCardSrv.addNewContract, options);
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
            $scope.contractData.showNightsModal = true;
            $scope.saveNewContract();
        };

        that.init();
    }
]);
