
sntRover.controller('RvArBalanceController', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', '$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv', '$filter',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller('balance-list');
	    var refreshScroll = function() {
	        $timeout(function() { 
	            $scope.refreshScroller('balance-list');
	        }, 2000);
	    };
        // Refresh scroll after completing fetch data
	    $scope.$on("FETCH_COMPLETE_BALANCE_LIST", function() {
	    	refreshScroll();
	    });		
}]);
