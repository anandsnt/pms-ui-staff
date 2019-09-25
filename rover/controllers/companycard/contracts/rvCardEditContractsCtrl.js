angular.module('sntRover').controller('rvCardEditContractsCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', '$timeout',
	function($scope, RVCompanyCardSrv, $stateParams, ngDialog, $timeout) {
        BaseCtrl.call(this, $scope);

        $scope.setScroller('editContractScroller');
        var refreshEditScroller = function() {
            $timeout(function() {
				if ($scope.myScroll && $scope.myScroll['editContractScroller']) {
					$scope.myScroll['editContractScroller'].refresh();
				}
				$scope.refreshScroller('editContractScroller');
			}, 500);
        };

        /**
         * Listener for edit scroller refresh
         */
        $scope.addListener('refreshEditScroller', refreshEditScroller);

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