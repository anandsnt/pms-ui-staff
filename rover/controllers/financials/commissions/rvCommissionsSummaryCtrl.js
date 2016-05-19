sntRover.controller('RVCommissionsSummaryController', ['$scope', '$rootScope', '$stateParams', '$filter', 'RVAccountsReceivablesSrv', function($scope, $rootScope, $stateParams, $filter, RVAccountsReceivablesSrv ) {

    BaseCtrl.call(this, $scope);

    var updateHeader = function(){
        // Setting up the screen heading and browser title.
        $scope.$emit('HeaderChanged', $filter('translate')('MENU_COMMISIONS'));
        $scope.setTitle($filter('translate')('MENU_ACCOUNTS_RECEIVABLES'));
        $scope.$emit("updateRoverLeftMenu", "commisions");
    };
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
    var fetchCommissionsData = function(){
        var successCallBack = function(data){
            $scope.commissionsData = data;

            $scope.errorMessage = "";
            $scope.$emit('hideLoader');

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
        //TODO :Add api
        $scope.invokeApi("url",params, successCallBack );
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
            fetchCommissionsData();
        }
    };

    $scope.clearSearchQuery = function(){
        $scope.filterData.searchQuery = '';
        fetchCommissionsData();
    };


    $scope.changedSortBy = function(){
        fetchCommissionsData();
    };

    //$scope.changedAgeingDays = function(){
    //    fetchCommissionsData();
    //};

    var initPaginationParams = function() {
        $scope.filterData.page = 1;
        $scope.start = 1;
        $scope.end = $scope.filterData.perPage;
        $scope.nextAction = false;
        $scope.prevAction = false;
    };

    var init = function(){
        updateHeader();
        initPaginationParams();
        //fetchCommissionsData();
    };
    init();

}]);