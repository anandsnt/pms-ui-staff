
sntRover.controller('RvArBalanceController', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', '$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv', '$filter',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller('balance-list');
	    var refreshScroll = function() {
	        $timeout(function() { 
	            $scope.refreshScroller('balance-list');
	        }, 6000);
	    };

	    $scope.$on("FETCH_COMPLETE_BALANCE_LIST", function() {
	    	console.log("FETCH_COMPLETE_BALANCE_LIST");
	    	refreshScroll();
	    });

	   

		
		
}]);
