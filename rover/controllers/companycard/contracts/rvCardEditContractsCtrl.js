angular.module('sntRover').controller('rvCardEditContractsCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog',
	function($scope, RVCompanyCardSrv, $stateParams, ngDialog) {
        BaseCtrl.call(this, $scope);

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
        $scope.contractedNights = function() {
            if ($scope.contractData.disableFields) {
                return;
            }
            ngDialog.open({
                template: '/assets/partials/companyCard/contracts/rvContractedNightsPopup.html',
                controller: 'rvContractedNightsCtrl',
                className: 'ngdialog-theme-default1 calendar-single1',
                scope: $scope
            });            
        };
    }
]);