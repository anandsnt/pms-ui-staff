
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

	    $scope.selectInvoice = function (transactionId) {
	    	_.each($scope.arDataObj.balanceList, function (eachItem) {
		    	if (eachItem.transaction_id === transactionId) {
		    		eachItem.isSelected = !eachItem.isSelected;
		    		var selectedInvoiceObj = {};
		    		selectedInvoiceObj.invoice_id = transactionId;
		    		selectedInvoiceObj.amount = eachItem.amount;
		    		if (eachItem.isSelected) { 
		    			$scope.arDataObj.selectedInvoices.push(selectedInvoiceObj);
		    			$scope.arDataObj.totalAllocatedAmount+= eachItem.amount;
		    		} else { 
		    			
		    			$scope.arDataObj.selectedInvoices = _.filter($scope.arDataObj.selectedInvoices, function (item) {
		    				return item.invoice_id !== transactionId;
		    			})
		    			$scope.arDataObj.totalAllocatedAmount = $scope.arDataObj.totalAllocatedAmount - eachItem.amount;
		    		}
		    	} 	    	
		    });
		    console.log($scope.arDataObj.selectedInvoices)
	    };


}]);
