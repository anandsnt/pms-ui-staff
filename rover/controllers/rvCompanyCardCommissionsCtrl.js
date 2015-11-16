sntRover.controller('companyCardCommissionsCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    'RVCompanyCardSrv',
function($rootScope, $scope, $stateParams, RVCompanyCardSrv) {
    BaseCtrl.call(this, $scope);

    //Get the request parameters for the commission filtering
    var getRequestParams = function() {
        var params = {};
        params.from_date = $scope.filterData.fromDate;
        params.to_date = $scope.filterData.toDate;
        params.paid_status = $scope.filterData.paidStatus;
        params.commission_status = $scope.filterData.commissionStatus;
        params.per_page = $scope.filterData.perPage;
        params.page = $scope.filterData.page;

        return params;

    };

    //Fetches the commission details for the given filter options
    var fetchCommissionDetails = function() {
        var onCommissionFetchSuccess = function(data) {
                $scope.commissionDetails = data.commission_details;
                $scope.commissionSummary.totalRevenue = data.total_revenue;
                $scope.commissionSummary.totalCommission = data.total_commission;
                $scope.commissionSummary.totalUnpaidCommission = data.total_commission_unpaid;

                //set pagination controls values
                $scope.pagination.totalResultCount = data.total_count;
                if($scope.nextAction){
                    $scope.pagination.start = $scope.pagination.start + $scope.commission.filter.per_page;
                }
                if($scope.prevAction){
                    $scope.pagination.start = $scope.pagination.start - $scope.commission.filter.per_page ;
                }

                $scope.pagination.end = $scope.pagination.start + $scope.commission.filter.per_page;
                $scope.$emit('hideLoader');
            },
            onCommissionFetchFailure = function(error) {
                $scope.$emit('hideLoader');
                $scope.commissionDetails = [];
                $scope.commissionSummary = {};
            };
        var requestParams = getRequestParams();
        $scope.invokeApi(RVCompanyCardSrv.fetchTACommissionDetails, $scope.commission.filter, onCommissionFetchSuccess);
    };

    $scope.loadNextSet = function(){
        $scope.commission.filter.perPage++;
        $scope.nextAction = true;
        $scope.prevAction = false;
        fetchCommissionDetails();
    };

    $scope.loadPrevSet = function(){
        $scope.commission.filter.perPage--;
        $scope.nextAction = false;
        $scope.prevAction = true;
        fetchCommissionDetails();
    };

    $scope.isNextButtonDisabled = function(){
        var isDisabled = false;
        if($scope.commissionDetails.length == 0) {
            return true;
        }
        if($scope.pagination.end >= $scope.$scope.pagination.totalResultCount){
            isDisabled = true;
        }
        return isDisabled;
    };

    $scope.isPrevButtonDisabled = function(){
        var isDisabled = false;
        if($scope.commission.filter.page === 1){
            isDisabled = true;
        }
        return isDisabled;

    };

    $scope.shouldShowPagination = function() {
        return ($scope.commissionDetails.length > 0 && $scope.pagination.totalCount > $scope.commission.filter.per_page);
    };

    var initPaginationParams = function(){
        $scope.filterData.pageNo = 1;
        $scope.filterData.start = 1;
        $scope.filterData.end = $scope.filterData.start + $scope.arTransactionDetails.ar_transactions.length - 1;
        $scope.nextAction = false;
        $scope.prevAction = false;
    };

    // To handle from date change
    $scope.$on('fromDateChanged',function(){
        initPaginationParams();
        fetchCommissionDetails();
    });

    // To handle to date change
    $scope.$on('toDateChanged',function(){
        initPaginationParams();
        fetchCommissionDetails();
    });

    var init = function() {
        $scope.commissionDetails = [];
        $scope.commissionSummary = {};
        $scope.filterData = {
            fromDate : "",
            toDate : "",
            paidStatus : "unpaid",
            commissionStatus : "commissionable",
            perPage : RVCompanyCardSrv.DEFAULT_PER_PAGE,
            page : 1,
            start : 1
        };
        $scope.showFilter = true;
        $scope.accountId = $stateParams.id;

        $scope.pagination = {
          start : 1,
          end : RVCompanyCardSrv.DEFAULT_PER_PAGE,
          totalResultCount : 0
        };


        fetchCommissionDetails();

    };

    init();

}]);