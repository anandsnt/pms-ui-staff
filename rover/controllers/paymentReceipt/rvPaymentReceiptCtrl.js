sntRover.controller('RVReceiptPopupController', 
    ['$scope', 
    '$rootScope', 
    'RVBillCardSrv', 
    'RVContactInfoSrv',
    'ngDialog',     
    function($scope, $rootScope, RVBillCardSrv, RVContactInfoSrv, ngDialog) {

    BaseCtrl.call(this, $scope);

    /*
     * Function to get email button class
     */
    $scope.getEmailButtonClass = function() {

        var emailButtonClass = "blue";

        if (!$scope.data.mailto_address) {
            emailButtonClass = "grey";
        }
        return emailButtonClass;
    };

    /*
     * Function to get email button disabled or not
     */
    $scope.isEmailButtonDisabled = function() {

        var isEmailButtonDisabled = false;

        if (!$scope.data.mailto_address) {
            isEmailButtonDisabled = true;
        }
        return isEmailButtonDisabled;
    };
    /*
     * print receipt method
     */
    $scope.printReceipt = function() {
        var printReceiptSuccess = function (response) {
                $scope.$emit("PRINT_RECEIPT", response.data);
            },
            dataToSend = {
                params: {
                  bill_id: $scope.billId,
                  transaction_id: $scope.transactionId
                },
            successCallBack: printReceiptSuccess
        };

        $scope.callAPI(RVBillCardSrv.printReceiptData, dataToSend);
    };

    $scope.closeDialog = function() {
      ngDialog.close();
    };

    /*
     * email receipt method
     */
    $scope.emailReceipt = function() {
        var emailReceiptSuccess = function (response) {
                $scope.successMessage = ["Email send succesfully!"];
                $scope.closeDialog();
            },
            dataToSend = {
                params: {
                  bill_id: $scope.billId,
                  transaction_id: $scope.transactionId,
                  to_address: $scope.data.mailto_address
                },
                successCallBack: emailReceiptSuccess
            };

        $scope.callAPI(RVBillCardSrv.emailReceiptData, dataToSend);
    };

    var successCallBackForLanguagesFetch = function(data) {
        if (data.languages) {
          data.languages = _.filter(data.languages, {
              is_show_on_guest_card: true
          });
        }
        $scope.languageData = data;
        $scope.data.locale = data.selected_language_code;
    };

    /**
     * Fetch the guest languages list and settings
     * @return {undefined}
     */
    var init = function() {

        $scope.data = {};

        var dataToSend = {
            successCallBack: successCallBackForLanguagesFetch
        };

        $scope.callAPI(RVContactInfoSrv.fetchGuestLanguages, dataToSend);
    };
    
    init();

}]);
