sntRover.controller('RVAccountsReceivablesController', ['$scope', '$rootScope', '$stateParams', '$filter', 'RVAccountsReceivablesSrv', function($scope, $rootScope, $stateParams, $filter, RVAccountsReceivablesSrv ) {

	BaseCtrl.call(this, $scope);
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_ACCOUNTS_RECEIVABLES'));
	$scope.setTitle($filter('translate')('MENU_ACCOUNTS_RECEIVABLES'));
    $scope.$emit("updateRoverLeftMenu", "accountsReceivables");
    /**
     * Setting up scroller with refresh options..
     */
    $scope.setScroller('arOverViewScroll', {});
    var refreshArOverviewScroll = function(){
        setTimeout(function(){$scope.refreshScroller('arOverViewScroll');}, 500);
    };
    refreshArOverviewScroll();

    /*
     *   Method to initialize the AR Overview Data set.
     */  
    var fetchArOverviewData = function(){
        var successCallBackFetchAccountsReceivables = function(data){

            $scope.arOverviewData = {};
            $scope.arOverviewData = data;

            $scope.errorMessage = "";
            $scope.$emit('hideLoader');

            // Compute the start, end and total count parameters
            if ($scope.nextAction) {
                $scope.start = $scope.start + $scope.filterData.perPage;
            }
            if ($scope.prevAction) {
                $scope.start = $scope.start - $scope.filterData.perPage;
            }
            $scope.end = $scope.start + $scope.arOverviewData.accounts.length - 1;

            refreshArOverviewScroll();

            // Condition to show/hide header bar - with OPEN GUEST BILL & UNPAID BALANCE.
            if($scope.filterData.searchQuery !== "" || $scope.filterData.minAmount !== "" || $scope.filterData.ageingDays !== ""){
            	$scope.filterData.hideArHeader = true;
            }
            else{
            	$scope.filterData.hideArHeader = false;
            }
        };

        var params = {
            'query'         : $scope.filterData.searchQuery,
            'page'          : $scope.filterData.page,
            'per_page'      : $scope.filterData.perPage,
            'min_amount'    : $scope.filterData.minAmount,
            'ageing_days'   : $scope.filterData.ageingDays,
            'sort_by'       : $scope.filterData.sortBy
        };
        $scope.invokeApi(RVAccountsReceivablesSrv.fetchAccountsReceivables, params, successCallBackFetchAccountsReceivables );
    };

    // Setting filter data set for pagination and filter options..
    $scope.filterData = {

        'page'          : 1,
        'perPage'       : 50,
        'searchQuery'   : '',
        'minAmount'     : '',
        'sortBy'        : 'NAME_ASC',
        'ageingDays'    : '',
        'hideArHeader'	: false,
        
        'ageingDaysList':
        [
            {   'value' : ''    ,   'name'  : ''    },
            {   'value' : '30'  ,   'name'  : '30'  },
            {   'value' : '60'  ,   'name'  : '60'  },
            {   'value' : '90'  ,   'name'  : '90'  },
            {   'value' : '120' ,   'name'  : '120' }
        ],
        'sortList'      :
        [
            {   'value' : 'NAME_ASC'    ,   'name':  'NAME ASC'   },
            {   'value' : 'NAME_DESC'   ,   'name':  'NAME DESC'  },
            {   'value' : 'AMOUNT_ASC'  ,   'name':  'AMOUNT ASC' },
            {   'value' : 'AMOUNT_DESC' ,   'name':  'AMOUNT DESC'}
        ]
    };

    // Filter block starts here ..
    $scope.changedSearchQuery = function(){

        if($scope.filterData.searchQuery.length > 2 || $scope.filterData.searchQuery === ""){
            $scope.filterData.minAmount     = "";
            $scope.filterData.ageingDays    = "";
            fetchArOverviewData();
        }
    };

    $scope.clearSearchQuery = function(){
        $scope.filterData.searchQuery = '';
        fetchArOverviewData();
    };

    $scope.changedMinAmount = function(){
        fetchArOverviewData();
    };

    $scope.changedSortBy = function(){
        fetchArOverviewData();
    };

    $scope.changedAgeingDays = function(){
        fetchArOverviewData();
    };
    // Filter block ends here ..

    // Pagination block starts here ..
    $scope.loadNextSet = function() {
        $scope.filterData.page++;
        $scope.nextAction = true;
        $scope.prevAction = false;
        fetchArOverviewData();
    };

    $scope.loadPrevSet = function() {
        $scope.filterData.page--;
        $scope.nextAction = false;
        $scope.prevAction = true;
        fetchArOverviewData();
    };

    $scope.isNextButtonDisabled = function() {
        var isDisabled = false;
        if (!!$scope.arOverviewData && ($scope.end >= $scope.arOverviewData.total_result)) {
            isDisabled = true;
        }
        return isDisabled;
    };

    $scope.isPrevButtonDisabled = function() {
        var isDisabled = false;
        if ($scope.filterData.page === 1) {
            isDisabled = true;
        }
        return isDisabled;
    };

    var initPaginationParams = function() {
        $scope.filterData.page = 1;
        $scope.start = 1;
        $scope.end = $scope.filterData.perPage;
        $scope.nextAction = false;
        $scope.prevAction = false;
    };

    initPaginationParams();

    // Pagination block ends here ..
    
    fetchArOverviewData();

    /*
     *	Utility function that converts a null value to a desired string.
     *	@param 	{ String } [value to be checked for null string]
     *	@param 	{ String } [value to be replaced for null string]
     *	@return { String } 
     */
    $scope.escapeNullStr = function(value, replaceWith) {
		var newValue = "";
		if ((typeof replaceWith !== "undefined") && (replaceWith !== null)) {
			newValue = replaceWith;
		}
		var valueToReturn = ((value === null || typeof value === 'undefined') ? newValue : value);
        if (valueToReturn.indexOf('null') !== -1){
            valueToReturn = '';//removes unwanted ", null" type of values
        }
		return valueToReturn;
	};

	/* 	Is show pagination tab
	 *	@return { boolean } 
	 */
	$scope.isShowPagination = function(){
		var arOverviewData = $scope.arOverviewData;
		return (!!arOverviewData && arOverviewData.total_result >= $scope.filterData.perPage && arOverviewData.accounts.length > 0);
	};

}]);