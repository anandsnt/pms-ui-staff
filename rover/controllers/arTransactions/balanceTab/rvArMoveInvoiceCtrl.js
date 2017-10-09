sntRover.controller('rvArMoveInvoiceCtrl', ['$scope', 'ngDialog', 'RVAccountsReceivablesSrv', function($scope, ngDialog, RVAccountsReceivablesSrv ) {

    BaseCtrl.call(this, $scope);
    /**
     * Setting up scroller with refresh options..
     */
    $scope.setScroller('arMoveInvoiceListScroll', {});

    var refreshScroll = function() {
        setTimeout(function() {
            $scope.refreshScroller('arMoveInvoiceListScroll');
        }, 500);
    };

    refreshScroll();

    // Data set ninitialization
    $scope.moveInvoiceData = {
        isConfirmInvoiceMoveScreen: false,
        searchResult: {},
        selectedAccount: {},
        query: '',
        perPage: 10,
        page: 1
    };

    /*
     *   Method to initialize the AR Overview Data set.
     */  
    var getSearchResult = function() {
        var successCallBack = function(data) {

            $scope.moveInvoiceData.searchResult = data;

            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
        };

        var params = {
            'query': $scope.moveInvoiceData.query,
            'page': $scope.moveInvoiceData.page,
            'per_page': $scope.moveInvoiceData.perPage
        };

        $scope.invokeApi(RVAccountsReceivablesSrv.fetchAccountsReceivables, params, successCallBack );
    };

    // Filter block starts here ..
    $scope.changedSearchQuery = function() {

        if ($scope.moveInvoiceData.query.length > 2 || $scope.moveInvoiceData.query === "") {
            getSearchResult();
        }
    };

    $scope.clearSearchQuery = function() {
        $scope.moveInvoiceData.query = '';
    };

}]);
