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

    $scope.printReceipt = function() {
        var getBillDataSuccess = function (response) {
                $scope.$emit("PRINT_RECEIPT", response);
            },
            dataToSend = {
                params: {
                  bill_id: $scope.billId,
                  transaction_id: $scope.transactionId
                },
            successCallBack: getBillDataSuccess
        };

        $scope.callAPI(RVBillCardSrv.fetchReceiptData, dataToSend);
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
