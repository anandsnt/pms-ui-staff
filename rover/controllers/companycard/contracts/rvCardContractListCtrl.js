angular.module('sntRover').controller('rvCardContractListCtrl', ['$timeout', '$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog',
	function($timeout, $scope, RVCompanyCardSrv, $stateParams, ngDialog) {
        BaseCtrl.call(this, $scope);
        $scope.selectedType = '';
        $scope.opened = false;

        $scope.setScroller('contractListScroller');
        var refreshScroller = function() {
			$timeout(function() {
				if ($scope.myScroll && $scope.myScroll['contractListScroller']) {
					$scope.myScroll['contractListScroller'].refresh();
				}
				$scope.refreshScroller('contractListScroller');
			}, 500);
		};

        $scope.openContractsList = function(listType) {
            $scope.selectedType = listType;
            $scope.opened = !$scope.opened;
            refreshScroller();
        };

        $scope.fetchDetails = function(contractId) {
            $scope.$emit('fetchContract', contractId);
        };
    }
]);