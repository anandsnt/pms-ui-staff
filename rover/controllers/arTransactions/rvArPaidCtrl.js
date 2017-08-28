
sntRover.controller('RvArPaidController', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', '$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv', '$filter',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller('paid-list');
	    var refreshScroll = function() {
	        $timeout(function() { 
	            $scope.refreshScroller('paid-list');
	        }, 3000);
	    };

	    $scope.$on("FETCH_COMPLETE_PAID_LIST", function() {
	    	refreshScroll();
	    });

		
}]);
