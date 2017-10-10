
sntRover.controller('RvArInvoiceAdjustController',
    ['$scope',
    '$timeout',
    'rvAccountsArTransactionsSrv', 'sntActivity', 'ngDialog',
    function($scope, $timeout, rvAccountsArTransactionsSrv, sntActivity, ngDialog) {

      BaseCtrl.call(this, $scope);

      if ($scope.selectedTransaction.is_group_by_ref) {
        var paramsToService = {},
            requestParams = {};
            requestParams.is_group_by_ref = $scope.selectedTransaction.is_group_by_ref;
            requestParams.reference_number = $scope.selectedTransaction.reference_number;
            requestParams.bill_id = $scope.selectedTransaction.bill_id;
            requestParams.financial_transaction_id = $scope.selectedTransaction.id;
            requestParams.ar_transaction_id = $scope.selectedInvoice.transaction_id;
            paramsToService.requestParams = requestParams;
            paramsToService.accountId = $scope.arDataObj.accountId;
            paramsToService.arTransactionId = $scope.selectedTransaction.id;
        
        var options = {
          params: paramsToService,
          successCallBack: successCallBackOfGetInfo
        };

        var successCallBackOfGetInfo = function(data) {

        }

        $scope.callAPI( rvAccountsArTransactionsSrv.getAdjustmentInfo, options );
      }

    }]);
