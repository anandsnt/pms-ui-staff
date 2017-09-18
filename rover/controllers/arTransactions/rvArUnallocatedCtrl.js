
sntRover.controller('RvArUnallocatedController',
	['$scope',
	 '$timeout',
	 'rvAccountsArTransactionsSrv','sntActivity', 'ngDialog',
	  function($scope, $timeout, rvAccountsArTransactionsSrv, sntActivity, ngDialog) {

		BaseCtrl.call(this, $scope);

        $scope.setScroller('unallocated-list-scroller');

		// Refreshes the scroller for the unallocated lists
		var refreshScroll = function() {
	        $timeout(function() {
	            $scope.refreshScroller('unallocated-list-scroller');
	        }, 1000);
    	};

    	// Refresh scroller while updating the results from parent controller
    	$scope.$on( 'REFRESH_UNALLOCATED_LIST_SCROLLER' , function () {
    		refreshScroll();
    	});

    	// Handle Unallocated tab expansion api call.
        var callExpansionAPI = function( item ) {
            sntActivity.start('EXPAND_UNALLOCATED');
            var successCallbackOfExpansionAPI = function( data ) {
                sntActivity.stop('EXPAND_UNALLOCATED');
                item.transactions = data.allocated_transactions;
                item.active = true;
                refreshScroll();
            },
            failureCallbackOfExpansionAPI = function( errorMessage ) {
                sntActivity.stop('EXPAND_UNALLOCATED');
                $scope.$emit('SHOW_ERROR_MSG', errorMessage);
            };

            var dataToSend = {
                'id': item.transaction_id,
                'account_id': $scope.arDataObj.accountId
            };
            
            $scope.invokeApi(rvAccountsArTransactionsSrv.expandAllocateAndUnallocatedList, dataToSend, successCallbackOfExpansionAPI, failureCallbackOfExpansionAPI );
        };

        // Handle Toggle button click to expand list item
        $scope.clickedUnallocatedListItem = function( index ) {
            var clikedItem = $scope.arDataObj.unallocatedList[index];

            if (clikedItem.is_partially_paid) {
                if (!clikedItem.active) {
                    callExpansionAPI(clikedItem);
                }
                else {
                    clikedItem.active = false;
                    refreshScroll();
                }
            }
        };

        // Handle allocate button click.
        $scope.clickedAllocateButton = function(index) {
            event.cancelBubble = true;
            if(event.stopPropagation) event.stopPropagation();
            console.log($scope.arDataObj.unallocatedList[index]);
            console.log("----")
            $scope.$emit("CLICKED_ALLOCATE_BUTTON", $scope.arDataObj.unallocatedList[index]);
        };
          /*
           * Handle unallocate button click
           */
          $scope.clickedUnallocate = function(payment) {
              var successCallBackOfUnallocateData = function(data) {
                  $scope.selectedUnAllocatedItem = data;
                  ngDialog.open({
                      template: '/assets/partials/companyCard/arTransactions/rvCompanyTravelAgentUnallocatePopup.html',
                      scope: $scope
                  });
              };

              var requestParams = {},
                  paramsToService = {};

              requestParams.allocation_id = payment.id;
              paramsToService.account_id = $scope.arDataObj.accountId;
              paramsToService.data = requestParams;

              var options = {
                  params: paramsToService,
                  successCallBack: successCallBackOfUnallocateData
              };

              $scope.callAPI( rvAccountsArTransactionsSrv.unAllocateData, options );
          };
          /*
           * Un allocate selected payment
           */
          $scope.unAllocate = function(){
              var requestParams = {},
                  paramsToService = {},
                  successCallBackOfUnallocate = function (data) {
                      $scope.$emit('REFRESH_UNALLOCATED');
                      ngDialog.close();
                  };
              requestParams.allocation_id = $scope.selectedUnAllocatedItem.allocation_id;
              requestParams.credit_id = $scope.selectedUnAllocatedItem.from_bill.transaction_id;
              requestParams.debit_id = $scope.selectedUnAllocatedItem.to_payment.transaction_id;
              requestParams.amount = $scope.selectedUnAllocatedItem.amount;

              paramsToService.account_id = $scope.arDataObj.accountId;
              paramsToService.data = requestParams;

              var options = {
                  params: paramsToService,
                  successCallBack: successCallBackOfUnallocate
              };

              $scope.callAPI( rvAccountsArTransactionsSrv.unAllocateSelectedPayment, options );
          }

}]);
