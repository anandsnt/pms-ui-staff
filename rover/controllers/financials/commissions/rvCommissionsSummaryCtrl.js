sntRover.controller('RVCommissionsSummaryController', ['$scope', '$rootScope', '$stateParams', '$filter', 'RVCommissionsSrv', '$timeout', '$window', '$state', function($scope, $rootScope, $stateParams, $filter, RVCommissionsSrv, $timeout, $window, $state) {

    BaseCtrl.call(this, $scope);

    var updateHeader = function() {
        // Setting up the screen heading and browser title.
        $scope.$emit('HeaderChanged', $filter('translate')('MENU_COMMISIONS'));
        $scope.setTitle($filter('translate')('MENU_COMMISSIONS'));
        $scope.$emit("updateRoverLeftMenu", "commisions");
    };

    var refreshArOverviewScroll = function() {
        setTimeout(function() {
            $scope.refreshScroller('commissionOverViewScroll');
        }, 500);
    };

    $scope.resetSelections = function(){
        $scope.isAnyCommisionSelected = false;
        $scope.noOfBillsSelected = 0;
        $scope.selectedAccountIds = [];
        _.each($scope.commissionsData.accounts, function(account) {
            account.isSelected = false;
        });
    };

    $scope.resetExpandedView = function() {
        $scope.expandedSubmenuId = -1;
    };
    $scope.expandCommision = function(account) {
        $scope.expandedSubmenuId = ($scope.expandedSubmenuId === account.id) ? -1 : account.id;

        $scope.selectedReservationIds = [];
        $scope.selectedCommisionReservations = RVCommissionsSrv.sampleReservationData;
        _.each($scope.selectedCommisionReservations, function(reservation) {
            reservation.isSelected = false;
        });

    };

    $scope.reservationSelectionChanged = function(){
        $scope.selectedReservationIds = [];
         _.each($scope.selectedCommisionReservations, function(reservation) {
            if (reservation.isSelected) {
                $scope.selectedReservationIds.push(reservation.id);
                console.log($scope.selectedReservationIds);
            }
        });
    };

    $scope.commisionSelectionChanged = function() {
        $scope.isAnyCommisionSelected = false;
        $scope.noOfBillsSelected = 0;
        $scope.selectedAccountIds = [];
        _.each($scope.commissionsData.accounts, function(account) {
            if (account.isSelected) {
                $scope.isAnyCommisionSelected = true;
                $scope.noOfBillsSelected++;
                $scope.selectedAccountIds.push(account.id);
                console.log($scope.selectedAccountIds);
            }
        });
    };

    $scope.setFilterTab = function(selectedTab) {
        $scope.commissionsData = {};
        $scope.filterData.billStatus.value = selectedTab === 'ON_HOLD' ? 'PAID' : 'ALL'; 
        $scope.searchAccounts();
        $scope.filterData.filterTab = selectedTab;
    };

    /***************** Search starts here *****************/

    var fetchCommissionsData = function() {
        var successCallBack = function(data) {
            $scope.commissionsData = data;
            $scope.resetSelections();
            updatePaginationParams();
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
            refreshArOverviewScroll();
        };

        var params = {
            'query': $scope.filterData.searchQuery,
            'page': $scope.filterData.page,
            'per_page': $scope.filterData.perPage,
            'bill_status': $scope.filterData.billStatus.value,
            'sort_by': $scope.filterData.sort_by.value,
            'min_commission_amount': $scope.filterData.minAmount
        };

        $scope.invokeApi(RVCommissionsSrv.fetchCommissions, params, successCallBack);
    };

    $scope.searchAccounts = function() {
        initPaginationParams();
        fetchCommissionsData();
    };

    $scope.clearSearchQuery = function() {
        $scope.filterData.searchQuery = '';
        initPaginationParams();
        fetchCommissionsData();
    };
    /***************** search ends here *****************************/

    /***************** Pagination starts here ***********************/

    var updatePaginationParams = function() {
        $scope.showPagination = ($scope.commissionsData.total_results <= 50) ? false : true;
        $scope.start = ($scope.filterData.page == 1) ? 1 : (($scope.filterData.page - 1) * $scope.filterData.perPage) + 1;
        $scope.end = (($scope.filterData.page * $scope.filterData.perPage) >= $scope.commissionsData.total_results) ? $scope.commissionsData.total_results : ($scope.filterData.page * $scope.filterData.perPage);

    };
    var initPaginationParams = function() {
        $scope.filterData.page = 1,
            $scope.filterData.perPage = 50;
    };

    $scope.loadNextPage = function() {
        $scope.filterData.page++;
        fetchCommissionsData();
    };
    $scope.loadPrevPage = function() {
        $scope.filterData.page--;
        fetchCommissionsData();
    };
    $scope.isNextButtonDisabled = function() {
        return ($scope.filterData.page > $scope.commissionsData.total_results / $scope.filterData.perPage);
    };

    $scope.isPrevButtonDisabled = function() {
        return ($scope.filterData.page == 1);
    };

    /***************** Pagination ends here *****************/

    /***************** Actions starts here *******************/

    $scope.exportCommisions = function(){
        console.log('export');
        console.log($scope.selectedAccountIds);
        console.log($scope.selectedReservationIds);
    };
    $scope.putOnHoldCommisions = function(){
        console.log('putOnHold');
        console.log($scope.selectedAccountIds);
        console.log($scope.selectedReservationIds);
    };
    $scope.releaseCommisions = function(){
        console.log('release');
        console.log($scope.selectedAccountIds);
        console.log($scope.selectedReservationIds);
    };
    $scope.setRecordsToPaid = function(){
        console.log('setRecordsToPaid');
        console.log($scope.selectedAccountIds);
        console.log($scope.selectedReservationIds);
    };

    $scope.printButtonClick = function() {
        $timeout(function() {
            $window.print();
            if (sntapp.cordovaLoaded) {
                cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
            }
        }, 100);
    };

    /***************** Actions ends here *******************/

    $scope.navigateToTA = function(account) {
        // https://stayntouch.atlassian.net/browse/CICO-40583
        // Can navigate to TA even if commission is off.
        $state.go('rover.companycarddetails', {
            id: account.id,
            type: 'TRAVELAGENT',
            origin: 'COMMISION_SUMMARY'
        });
    };

    var init = function() {
        $scope.commissionsData = {};
        $scope.filterData = {};
        updateHeader();
        $scope.filterData = RVCommissionsSrv.filterData;
        fetchCommissionsData();
        $scope.noOfBillsSelected = 0;
        $scope.isAnyCommisionSelected = false;
        $scope.expandedSubmenuId = -1;
        $scope.selectedAccountIds = [];
        $scope.selectedReservationIds = [];
        $scope.setScroller('commissionOverViewScroll', {});
    };

    init();

}]);