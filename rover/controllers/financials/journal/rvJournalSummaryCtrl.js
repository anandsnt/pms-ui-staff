sntRover.controller('RVJournalSummaryController', ['$scope','$rootScope', 'RVJournalSrv','$timeout',function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";
    $scope.perPage = 50;

    $scope.setScroller('summary_content',{});
    var refreshSummaryScroller = function () {
        setTimeout(function(){$scope.refreshScroller('summary_content');}, 500);
    };

    $rootScope.$on('REFRESHSUMMARYCONTENT',function () {
        refreshSummaryScroller();
    });

    $scope.$on('RELOADSUMMARYOVERVIEW', function() {
        initSummaryData();
    });

    // CICO-28060 : Update dates for summary upon changing from-date from Revenue or Payments 
    $rootScope.$on('REFRESH_SUMMARY_DATA',function( event, date ){
        $scope.data.summaryDate = date;
        initSummaryData();
    });

    /* Utility method to get the summary type details.
        @param  {string} will be { DEPOSIT_BALANCE/ GUEST_BALANCE/ AR_BALANCE }
        @return {object}
     */
    var getSummaryItemByBalanceType = function( balance_type ){

        var summaryItem = "";

        switch( balance_type ) {
            case 'DEPOSIT_BALANCE'  :
                summaryItem = $scope.data.summaryData.deposit_balance;
                break;
            case 'GUEST_BALANCE' :
                summaryItem = $scope.data.summaryData.guest_balance;
                break;
            case 'AR_BALANCE' :
                summaryItem = $scope.data.summaryData.ar_balance;
                break;
        }
        return summaryItem;
    };

    var updateTotalForBalanceType = function( balance_type, opening_balance, debit_sum, credit_sum, closing_balance ){
        switch( balance_type ) {
            case 'DEPOSIT_BALANCE'  :
                $scope.data.summaryData.deposit_closing_balance = closing_balance;
                $scope.data.summaryData.deposit_credits = credit_sum;
                $scope.data.summaryData.deposit_debits = debit_sum;
                $scope.data.summaryData.deposit_opening_balance = opening_balance;
                break;
            case 'GUEST_BALANCE' :
                $scope.data.summaryData.guest_closing_balance = closing_balance;
                $scope.data.summaryData.guest_credits = credit_sum;
                $scope.data.summaryData.guest_debits = debit_sum;
                $scope.data.summaryData.guest_opening_balance = opening_balance;
                break;
            case 'AR_BALANCE' :
                $scope.data.summaryData.ar_closing_balance = closing_balance;
                $scope.data.summaryData.ar_credits = credit_sum;
                $scope.data.summaryData.ar_debits = debit_sum;
                $scope.data.summaryData.ar_opening_balance = opening_balance;
                break;
        }
    };

	var initSummaryData = function(){

		var successCallBackFetchSummaryData = function(responce){

            $scope.data.summaryData = {};
            $scope.data.summaryData = responce.data;

            // Initializing objetcs for DEPOSIT_BALANCE/ GUEST_BALANCE/ AR_BALANCE sections.
            $scope.data.summaryData.deposit_balance = { 'active' : false ,'page_no' : 1,'start' : 1,'end' : 1,'nextAction' : false,'prevAction' : false };
            $scope.data.summaryData.guest_balance   = { 'active' : false ,'page_no' : 1,'start' : 1,'end' : 1,'nextAction' : false,'prevAction' : false };
            $scope.data.summaryData.ar_balance      = { 'active' : false ,'page_no' : 1,'start' : 1,'end' : 1,'nextAction' : false,'prevAction' : false };

            $scope.errorMessage = "";
            refreshSummaryScroller();
            $scope.$emit('hideLoader');
		};

        var params = {
            "date": $scope.data.summaryDate
        };
		$scope.invokeApi(RVJournalSrv.fetchSummaryData, params, successCallBackFetchSummaryData);
    };

    // To handle date updation on summary tab
    $rootScope.$on('summaryDateChanged',function(){
        initSummaryData();
        // CICO-28060 : Update dates for Revenue & Payments upon changing summary dates
        $rootScope.$broadcast('REFRESH_REVENUE_PAYMENT_DATA', {"date":$scope.data.summaryDate, "origin" :"SUMMARY_DATE_CHANGED"});
    });

    /* To fetch the details on each balance tab
        @param  {string} will be { DEPOSIT_BALANCE/ GUEST_BALANCE/ AR_BALANCE }
        @return {object}
     */
    var fetchBalanceDetails = function( balance_type , isFromPagination ){

        var summaryItem = getSummaryItemByBalanceType( balance_type );

        var successCallBackFetchBalanceDetails = function(responce){

            summaryItem.transactions = [];
            summaryItem.transactions = responce.transactions;
            summaryItem.total_count  = responce.total_count;

            updateTotalForBalanceType( balance_type, responce.opening_balance, responce.debit_sum, responce.credit_sum, responce.closing_balance );

            if(!isFromPagination && summaryItem.transactions.length > 0){
                summaryItem.active = !summaryItem.active;
            }

            $scope.errorMessage = "";
            refreshSummaryScroller();
            $scope.$broadcast('updatePagination', balance_type);
            $scope.$emit('hideLoader');
        };

        // Call api only while expanding the tab ..
        if(!summaryItem.active || isFromPagination) {
            var params = {
                "date": $scope.data.summaryDate,
                "page_no": summaryItem.page_no,
                "per_page": $scope.perPage,
                "type": balance_type
            };
            $scope.invokeApi(RVJournalSrv.fetchBalanceDetails, params, successCallBackFetchBalanceDetails);
        }
        else{
            summaryItem.active = !summaryItem.active;
            refreshSummaryScroller();
        }
    };

    /*
     *   Handle Expand/Collapse on balance each type
     *   @param  {string} will be { DEPOSIT_BALANCE/ GUEST_BALANCE/ AR_BALANCE }
     */
    $scope.toggleJournalSummaryItem = function( balance_type ) {

        fetchBalanceDetails( balance_type, false );
    };

	initSummaryData();

    //To load API data for pagination
    var loadAPIData = function( balance_type, pageNo ){
        var item        = getSummaryItemByBalanceType( balance_type );
        item.page_no    = pageNo;
        fetchBalanceDetails( balance_type, true );
    };
    
    // Pagination options for GUEST_BALANCE
    $scope.guestPagination = {
        id      : 'GUEST_BALANCE',
        api     : [ loadAPIData, 'GUEST_BALANCE' ],
        perPage : $scope.perPage
    };

    // Pagination options for DEPOSIT_BALANCE
    $scope.depositPagination = {
        id      : 'DEPOSIT_BALANCE',
        api     : [ loadAPIData, 'DEPOSIT_BALANCE' ],
        perPage : $scope.perPage
    };

    // Pagination options for AR_BALANCE
    $scope.arPagination = {
        id      : 'AR_BALANCE',
        api     : [ loadAPIData, 'AR_BALANCE' ],
        perPage : $scope.perPage
    };

}]);