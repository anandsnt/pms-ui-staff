sntRover.controller('RVJournalSummaryController', ['$scope','$rootScope', 'RVJournalSrv','$timeout',function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

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
        $rootScope.$broadcast('REFRESH_REVENUE_PAYMENT_DATA', $scope.data.summaryDate);
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
            summaryItem.end = summaryItem.start + summaryItem.transactions.length - 1;

            updateTotalForBalanceType( balance_type, responce.opening_balance, responce.debit_sum, responce.credit_sum, responce.closing_balance );

            if(isFromPagination){
                // Compute the start, end and total count parameters
                if(summaryItem.nextAction){
                    summaryItem.start = summaryItem.start + $scope.data.filterData.perPage;
                }
                if(summaryItem.prevAction){
                    summaryItem.start = summaryItem.start - $scope.data.filterData.perPage;
                }
                summaryItem.end = summaryItem.start + summaryItem.transactions.length - 1;
            }
            else if(summaryItem.transactions.length > 0){
                summaryItem.active = !summaryItem.active;
            }

            $scope.errorMessage = "";
            refreshSummaryScroller();
            $scope.$emit('hideLoader');
        };

        // Call api only while expanding the tab ..
        if(!summaryItem.active || isFromPagination) {
            var params = {
                "date": $scope.data.summaryDate,
                "page_no": summaryItem.page_no,
                "per_page": $scope.data.filterData.perPage,
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

        var toggleItem = getSummaryItemByBalanceType( balance_type );

        fetchBalanceDetails( balance_type, false );
    };

	initSummaryData();

    // Logic for pagination starts here ..
    $scope.loadNextSet = function( balance_type ){
        var item = getSummaryItemByBalanceType( balance_type );
        item.page_no ++;
        item.nextAction = true;
        item.prevAction = false;
        fetchBalanceDetails( balance_type, true );
    };

    $scope.loadPrevSet = function( balance_type ){
        var item = getSummaryItemByBalanceType( balance_type );
        item.page_no --;
        item.nextAction = false;
        item.prevAction = true;
        fetchBalanceDetails( balance_type, true );
    };

    $scope.isNextButtonDisabled = function( balance_type ){

        var item = getSummaryItemByBalanceType( balance_type ),
            isDisabled = false;

        if(!!item && item.end >= item.total_count){
            isDisabled = true;
        }
        return isDisabled;
    };

    $scope.isPrevButtonDisabled = function( balance_type ){

        var item = getSummaryItemByBalanceType( balance_type ),
            isDisabled = false;

        if(!!item && item.page_no === 1){
            isDisabled = true;
        }
        return isDisabled;
    };
    // Pagination logic ends ...

}]);