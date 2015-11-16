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
    });

    /* To fetch the details on each balance tab 
        @param  {string} will be { DEPOSIT_BALANCE/ GUEST_BALANCE/ AR_BALANCE }
        @return {object} 
     */
    var fetchBalanceDetails = function( balance_type , toggleItem , isFromPagination ){
        
        var successCallBackFetchBalanceDetails = function(responce){

            toggleItem.transactions = [];
            toggleItem.transactions = responce.transactions;
            toggleItem.total_count  = responce.total_count;
            toggleItem.end = toggleItem.start + toggleItem.transactions.length - 1;

            if(isFromPagination){
                // Compute the start, end and total count parameters
                if(toggleItem.nextAction){
                    toggleItem.start = toggleItem.start + $scope.data.filterData.perPage;
                }
                if(toggleItem.prevAction){
                    toggleItem.start = toggleItem.start - $scope.data.filterData.perPage;
                }
                toggleItem.end = toggleItem.start + toggleItem.transactions.length - 1;
            }
            else if(toggleItem.transactions.length > 0){
                toggleItem.active = !toggleItem.active;
            }

            $scope.errorMessage = "";
            refreshSummaryScroller();
            $scope.$emit('hideLoader');
        };

        // Call api only while expanding the tab ..
        if(!toggleItem.active || isFromPagination) {
            var params = {
                "date": $scope.data.summaryDate,
                "page_no": toggleItem.page_no,
                "per_page": $scope.data.filterData.perPage,
                "type": balance_type
            };
            $scope.invokeApi(RVJournalSrv.fetchBalanceDetails, params, successCallBackFetchBalanceDetails);
        }
        else{
            toggleItem.active = !toggleItem.active;
        }
    };

    /* 
     *   Handle Expand/Collapse on balance each type 
     *   @param  {string} will be { DEPOSIT_BALANCE/ GUEST_BALANCE/ AR_BALANCE }
     */
    $scope.toggleJournalSummaryItem = function( balance_type ) {
        
        var toggleItem = "";

        switch( balance_type ) {
            case 'DEPOSIT_BALANCE'  :
                toggleItem = $scope.data.summaryData.deposit_balance;
                break;
            case 'GUEST_BALANCE' :
                toggleItem = $scope.data.summaryData.guest_balance;
                break;
            case 'AR_BALANCE' :
                toggleItem = $scope.data.summaryData.ar_balance;
                break;
        }

        fetchBalanceDetails( balance_type , toggleItem , false );
    };

	initSummaryData();

}]);