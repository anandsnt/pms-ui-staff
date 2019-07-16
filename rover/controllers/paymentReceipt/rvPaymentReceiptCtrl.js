sntRover.controller('RVReceiptPopupController', 
    ['$scope', 
    '$rootScope', 
    'RVBillCardSrv', 
    'RVContactInfoSrv',
    'ngDialog',     
    function($scope, $rootScope, RVBillCardSrv, RVContactInfoSrv, ngDialog) {


    BaseCtrl.call(this, $scope); 

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

        var dataToSend = {
            successCallBack: successCallBackForLanguagesFetch
        };

        $scope.callAPI(RVContactInfoSrv.fetchGuestLanguages, dataToSend);
    };
    
    init();

}]);
