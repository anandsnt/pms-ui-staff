
sntRover.controller('RvArInvoiceAdjustController',
    ['$scope',
    '$timeout',
    'rvAccountsArTransactionsSrv', 'sntActivity', 'ngDialog',
    function($scope, $timeout, rvAccountsArTransactionsSrv, sntActivity, ngDialog) {

      BaseCtrl.call(this, $scope);

      $scope.adjustData = [];

      //if ($scope.selectedTransaction.is_group_by_ref) {
        var successCallBackOfGetInfo = function(data) {
          //sntActivity.stop('GET_GROUPED_ITEMS');
          $scope.adjustData = data;
        };

        var paramsToService = {},
            requestParams = {};
            requestParams.is_group_by_ref = $scope.selectedTransaction.is_group_by_ref;
            requestParams.reference_number = $scope.selectedTransaction.reference_number;
            requestParams.bill_id = $scope.selectedTransaction.bill_id;
            requestParams.financial_transaction_id = $scope.selectedTransaction.id;
            requestParams.ar_transaction_id = $scope.selectedInvoice.transaction_id;
            requestParams.item_ids = $scope.selectedTransaction.item_ids;
            paramsToService.requestParams = requestParams;
            paramsToService.accountId = $scope.arDataObj.accountId;
            paramsToService.arTransactionId = $scope.selectedInvoice.transaction_id;
        
        var options = {
          params: paramsToService,
          successCallBack: successCallBackOfGetInfo
        };

        
       // sntActivity.start('GET_GROUPED_ITEMS');
        $scope.callAPI( rvAccountsArTransactionsSrv.getAdjustmentInfo, options );
      //}

      $scope.clickedAdjust = function() {

      }

    }]);
