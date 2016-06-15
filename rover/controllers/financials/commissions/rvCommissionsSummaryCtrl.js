sntRover.controller('RVCommissionsSummaryController', ['$scope', '$rootScope', '$stateParams', '$filter', 'RVCommissionsSrv','$timeout','$window','$state', function($scope, $rootScope, $stateParams, $filter, RVCommissionsSrv,$timeout, $window, $state) {

    BaseCtrl.call(this, $scope);

    var updateHeader = function(){
        // Setting up the screen heading and browser title.
        $scope.$emit('HeaderChanged', $filter('translate')('MENU_COMMISIONS'));
        $scope.setTitle($filter('translate')('MENU_COMMISSIONS'));
        $scope.$emit("updateRoverLeftMenu", "commisions");
    };
    /**
     * Setting up scroller with refresh options..
     */
    $scope.setScroller('commissionOverViewScroll', {});
    var refreshArOverviewScroll = function(){
        setTimeout(function(){$scope.refreshScroller('commissionOverViewScroll');}, 500);
    };
    refreshArOverviewScroll();

    /*
     *   Method to initialize the AR Overview Data set.
     */
    var fetchCommissionsData = function(){
        var successCallBack = function(data){
            $scope.commissionsData = data;
            updatePaginationParams();
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
            refreshArOverviewScroll();
        };

        var params = {
            'query'         : $scope.filterData.searchQuery,
            'page'          : $scope.filterData.page,
            'per_page'      : $scope.filterData.perPage,
            'bill_status'    :$scope.filterData.billStatus.value,
            'sort_by'       : $scope.filterData.sort_by.value,
            'min_commission_amount':$scope.filterData.minAmount
        };
        $scope.invokeApi(RVCommissionsSrv.fetchCommissions, params, successCallBack );
    };
    $scope.searchAccounts = function(){
        initPaginationParams();
        fetchCommissionsData();
    };
    var initSearchParams =function() {
        $scope.filterData = {
            'page':1,
            'perPage':50,
            'searchQuery': '',
            'minAmount': '',
            'billStatus': {'value': 'OPEN', 'name': 'OPEN'},
            'sort_by': {'value': 'NAME_ASC', 'name': 'NAME_ASC'},
            'billStatusOptions': [
                {'value': 'OPEN', 'name': 'OPEN'},
                {'value': 'PAID', 'name': 'PAID'},
                {'value': 'ALL', 'name': 'ALL'}],
            'sortOptions': [
                {'value': 'NAME_ASC', 'name': 'NAME ASC'},
                {'value': 'NAME_DSC', 'name': 'NAME DESC'},
                {'value': 'AMOUNT_ASC', 'name': 'AMOUNT ASC'},
                {'value': 'AMOUNT_DSC', 'name': 'AMOUNT DESC'}]
        };
    };

    $scope.clearSearchQuery = function(){
        $scope.filterData.searchQuery = '';
        initPaginationParams();
        fetchCommissionsData();
    };
    var updatePaginationParams = function(){
        $scope.showPagination =($scope.commissionsData.total_results <= 50)?false:true;
        $scope.start = ($scope.filterData.page ==1)?1:(($scope.filterData.page-1)*$scope.filterData.perPage)+1 ;
        $scope.end = (($scope.filterData.page *$scope.filterData.perPage )>=$scope.commissionsData.total_results)?$scope.commissionsData.total_results:($scope.filterData.page *$scope.filterData.perPage );

    }
    var initPaginationParams = function() {
        $scope.filterData.page= 1,
        $scope.filterData.perPage= 50
    };
    $scope.loadNextPage = function(){
        $scope.filterData.page++;
        fetchCommissionsData();
    };
    $scope.loadPrevPage = function(){
        $scope.filterData.page--;
        fetchCommissionsData();
    };
    $scope.isNextButtonDisabled = function(){
        if($scope.filterData.page > $scope.commissionsData.total_results/$scope.filterData.perPage){
            return true;
        }else{
            return false};
    };
    $scope.printButtonClick = function(){
        $timeout(function() {
            $window.print();
            if ( sntapp.cordovaLoaded ) {
                cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
            };
        }, 100);
    };
    $scope.navigateToTA =function(account){
        if(account.is_commission_on){
            $state.go('rover.companycarddetails',{id: account.id, type: 'TRAVELAGENT',origin:'COMMISION_SUMMARY'});
        };
    };
    $scope.isPrevButtonDisabled = function(){
        if($scope.filterData.page ==1){
            return true;
        }else{
            return false};
    };

    var init = function(){
        $scope.commissionsData ={};
        $scope.filterData={};
        updateHeader();
        initSearchParams();
        fetchCommissionsData();
    };
    init();

}]);