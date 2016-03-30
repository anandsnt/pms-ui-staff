sntRover.controller('RVAccountsReceivablesController', ['$scope','$stateParams', '$filter', 'RVAccountsReceivablesSrv', function($scope, $stateParams, $filter, RVAccountsReceivablesSrv ) {

	BaseCtrl.call(this, $scope);
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_ACCOUNTS_RECEIVABLES'));
	$scope.setTitle($filter('translate')('MENU_ACCOUNTS_RECEIVABLES'));

    $scope.setScroller('arOverViewScroll', {});
    var refreshArOverviewScroll = function(){
        setTimeout(function(){$scope.refreshScroller('arOverViewScroll');}, 500);
    };
    refreshArOverviewScroll();

    /// Need to remove accounts
    var accounts = [{
        "account_name": "StayNTouch",
        "ar_number": "47343",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 1,
        "aging_date": "2016-03-24",
        "aging_days": 0,
        "current_balance": -2.0,
        "type":"COMPANY"
    },{
        "account_name": "StayNTouch",
        "ar_number": "555",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 1,
        "aging_date": "2016-03-24",
        "aging_days": 0,
        "current_balance": 0.0,
        "type":"TRAVELAGENT"
    },{
        "account_name": "StayNTouch",
        "ar_number": "1456",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 5,
        "aging_date": "2016-03-24",
        "aging_days": 12,
        "current_balance": 2.0,
        "type":"TRAVELAGENT"
    },,{
        "account_name": "StayNTouch",
        "ar_number": "1456",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 5,
        "aging_date": "2016-03-24",
        "aging_days": 12,
        "current_balance": 2.0,
        "type":"TRAVELAGENT"
    },{
        "account_name": "StayNTouch",
        "ar_number": "1456",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 5,
        "aging_date": "2016-03-24",
        "aging_days": 12,
        "current_balance": 2.0,
        "type":"TRAVELAGENT"
    },{
        "account_name": "StayNTouch",
        "ar_number": "1456",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 5,
        "aging_date": "2016-03-24",
        "aging_days": 12,
        "current_balance": 2.0,
        "type":"TRAVELAGENT"
    },{
        "account_name": "StayNTouch",
        "ar_number": "1456",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 5,
        "aging_date": "2016-03-24",
        "aging_days": 12,
        "current_balance": 2.0,
        "type":"TRAVELAGENT"
    },{
        "account_name": "StayNTouch",
        "ar_number": "1456",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 5,
        "aging_date": "2016-03-24",
        "aging_days": 12,
        "current_balance": 2.0,
        "type":"TRAVELAGENT"
    },{
        "account_name": "StayNTouch",
        "ar_number": "1456",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 5,
        "aging_date": "2016-03-24",
        "aging_days": 12,
        "current_balance": 2.0,
        "type":"TRAVELAGENT"
    },{
        "account_name": "StayNTouch",
        "ar_number": "1456",
        "account_number": "123",
        "city": "City",
        "state": "State",
        "open_bill": 5,
        "aging_date": "2016-03-24",
        "aging_days": 12,
        "current_balance": 2.0,
        "type":"TRAVELAGENT"
    }];
    /*
     *   Method to initialize the AR Overview Data set.
     */  
    var initArOverviewData = function(){
        var successCallBackFetchAccountsReceivables = function(data){
            $scope.arOverviewData = {};
            $scope.arOverviewData = data;
            $scope.arOverviewData.accounts = accounts;///need to remove
            $scope.arOverviewData.total_result = 10;///need to remove
            $scope.errorMessage = "";
            refreshArOverviewScroll();
            $scope.$emit('hideLoader');
            initPaginationParams();
        };

        var params = {
            'query'     : $scope.filterData.searchQuery,
            'page'      : $scope.page,
            'per_page'  : $scope.filterData.perPage,
            'min_amount': $scope.filterData.minAmount,
            'aging_days': $scope.filterData.ageingDays,
            'sort_by'   : $scope.filterData.sortBy
        };

        $scope.invokeApi(RVAccountsReceivablesSrv.fetchAccountsReceivables, params, successCallBackFetchAccountsReceivables );
    };

    $scope.filterData = {
        'perPage'       : 50,
        'searchQuery'   : '',
        'ageingDays'    : 30,
        'minAmount'     : '',
        'ageingDaysList':
        [
            {   'value' : '30' },
            {   'value' : '60' },
            {   'value' : '90' },
            {   'value' : '120'}
        ],
        'sortList'      :
        [
            {   'value' : 'NAME_ASC'    ,'name':  'NAME ASC'   },
            {   'value' : 'NAME_DESC'   ,'name':  'NAME DESC'  },
            {   'value' : 'AMOUNT_ASC'  ,'name':  'AMOUNT ASC' },
            {   'value' : 'AMOUNT_DESC' ,'name':  'AMOUNT DESC'}
        ]
    };

    $scope.loadNextSet = function() {
        $scope.page++;
        $scope.nextAction = true;
        $scope.prevAction = false;
        initArOverviewData();
    };

    $scope.loadPrevSet = function() {
        $scope.page--;
        $scope.nextAction = false;
        $scope.prevAction = true;
        initArOverviewData();
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
        if ($scope.page === 1) {
            isDisabled = true;
        }
        return isDisabled;
    };

    var initPaginationParams = function() {
        $scope.page = 1;
        $scope.start = 1;
        $scope.end = $scope.start + $scope.arOverviewData.accounts.length - 1;
        $scope.nextAction = false;
        $scope.prevAction = false;
    };

    initArOverviewData();

    

}]);