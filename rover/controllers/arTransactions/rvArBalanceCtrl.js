
sntRover.controller('RvArBalanceController', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', '$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv', '$filter',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);		

		var sumOfAllocatedAmount = 0;
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
	    /*
	     * Calculate the total amount of selected invoices - Footer
	     */
	    var calculateTotalAmount = function() {
	    	$scope.arDataObj.totalAllocatedAmount = 0;
	    	_.each($scope.arDataObj.balanceList, function (eachItem) {
		    	if (eachItem.isSelected) {				    	    
		    		$scope.arDataObj.totalAllocatedAmount = parseFloat($scope.arDataObj.totalAllocatedAmount) + parseFloat(eachItem.amount);		    		
		    	} 	    	
		    });
	    }
	    /*
	     * Changing amount in invoices
	     */
	    $scope.changeBalanceAmount = function(index) {
	    	$scope.arDataObj.balanceList[index].amount = ($scope.arDataObj.balanceList[index].amount > $scope.arDataObj.balanceList[index].initialAmount) ? $scope.arDataObj.balanceList[index].initialAmount : $scope.arDataObj.balanceList[index].amount;
	    	$scope.arDataObj.balanceList[index].balanceAfter = $scope.arDataObj.balanceList[index].initialAmount - $scope.arDataObj.balanceList[index].amount;
	    	$scope.arDataObj.balanceList[index].balanceNow = $scope.arDataObj.balanceList[index].amount;
	    	// $scope.arDataObj.totalAllocatedAmount = sumOfAllocatedAmount - $scope.arDataObj.balanceList[index].balanceAfter;
	    	calculateTotalAmount();
	    };
	    
	    /*
	     * Select individual invoices in balance tab
	     * update the selected invoices variable
	     */ 
	    $scope.selectInvoice = function (transactionId) {

	    	_.each($scope.arDataObj.balanceList, function (eachItem) {
		    	if (eachItem.transaction_id === transactionId) {
		    		eachItem.isSelected = !eachItem.isSelected;
		    		var selectedInvoiceObj = {};
		    		selectedInvoiceObj.invoice_id = transactionId;
		    		selectedInvoiceObj.amount = eachItem.amount;
		    		if (eachItem.isSelected) { 
		    			$scope.arDataObj.selectedInvoices.push(selectedInvoiceObj);		    			
		    		} else { 
		    			
		    			$scope.arDataObj.selectedInvoices = _.filter($scope.arDataObj.selectedInvoices, function (item) {
		    				return item.invoice_id !== transactionId;
		    			})		    			
		    		}
		    	} 	    	
		    });
		    calculateTotalAmount();
		    console.log($scope.arDataObj.selectedInvoices)
	    };


}]);
