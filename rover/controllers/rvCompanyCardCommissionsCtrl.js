sntRover.controller('companyCardCommissionsCtrl', [
    '$scope',
    '$rootScope',
    '$stateParams',
    'RVCompanyCardSrv',
    'ngDialog',
    '$timeout',
function($scope, $rootScope, $stateParams, RVCompanyCardSrv, ngDialog, $timeout) {
    BaseCtrl.call(this, $scope);

    //Get the request parameters for the commission filtering
    var getRequestParams = function() {
        var params = {};
        if(!!$scope.filterData.fromDate) {
            params.from_date = $scope.filterData.fromDate;
        }
        if(!!$scope.filterData.toDate) {
            params.to_date = $scope.filterData.toDate;
        }
        params.paid_status = $scope.filterData.paidStatus;
        params.commission_status = $scope.filterData.commissionStatus;
        params.per_page = $scope.filterData.perPage;
        params.page = $scope.filterData.page;
        return params;

    };

    // Refresh the scroller when the tab is active.
    $rootScope.$on("refreshComissionsScroll", function(event) {
        $timeout(function() {
            $scope.refreshScroller('commission-list');
        }, 100);
    });

    //Fetches the commission details for the given filter options
    var fetchCommissionDetails = function() {
        var onCommissionFetchSuccess = function(data) {
                _.each(data.commission_details, function(element, index) {
                    _.extend(element, {is_checked: false});
                });
                $scope.commissionDetails = data.commission_details;
                $scope.commissionSummary.totalRevenue = data.total_revenue;
                $scope.commissionSummary.totalCommission = data.total_commission;
                $scope.commissionSummary.totalUnpaidCommission = data.total_commission_unpaid;

                $timeout(function() {
                    $scope.refreshScroller('commission-list');
                }, 100);
                //set pagination controls values
                $scope.pagination.totalResultCount = data.total_count;
                if($scope.nextAction){
                    $scope.pagination.start = $scope.pagination.start + $scope.filterData.perPage;
                }
                if($scope.prevAction){
                    $scope.pagination.start = $scope.pagination.start - $scope.filterData.perPage ;
                }

                $scope.pagination.end = $scope.pagination.start + $scope.filterData.perPage;
                $scope.$emit('hideLoader');
            },
            onCommissionFetchFailure = function(error) {
                $scope.$emit('hideLoader');
                $scope.commissionDetails = [];
                $scope.commissionSummary = {};
            };

        var requestData = {};
        requestData.params = getRequestParams();
        requestData.accountId = $scope.accountId;
        $scope.invokeApi(RVCompanyCardSrv.fetchTACommissionDetails, requestData, onCommissionFetchSuccess, onCommissionFetchFailure);
    };

    $scope.loadNextSet = function(){
        $scope.filterData.page++;
        $scope.nextAction = true;
        $scope.prevAction = false;
        fetchCommissionDetails();
    };

    $scope.loadPrevSet = function(){
        $scope.filterData.page--;
        $scope.nextAction = false;
        $scope.prevAction = true;
        fetchCommissionDetails();
    };

    $scope.isNextButtonDisabled = function(){
        var isDisabled = false;
        if($scope.commissionDetails.length == 0) {
            return true;
        }
        if($scope.pagination.end >= $scope.pagination.totalResultCount){
            isDisabled = true;
        }
        return isDisabled;
    };

    $scope.isPrevButtonDisabled = function(){
        var isDisabled = false;
        if($scope.filterData.page === 1){
            isDisabled = true;
        }
        return isDisabled;

    };

    $scope.clearToDateField = function(){
        $scope.filterData.toDate = '';
        $scope.onFilterChange();
    };
    $scope.clearFromDateField = function(){
        $scope.filterData.fromDate = '';
        $scope.onFilterChange();
    };

    $scope.shouldShowPagination = function() {
        return ($scope.commissionDetails.length > 0 && $scope.pagination.totalResultCount > $scope.filterData.perPage);
    };

    var initPaginationParams = function(){
        $scope.filterData.pageNo = 1;
        $scope.pagination.start = 1;
        $scope.nextAction = false;
        $scope.prevAction = false;
    };

    // To handle from date change
    $scope.$on('fromDateChanged',function(){
       $scope.onFilterChange();
    });

    // To handle to date change
    $scope.$on('toDateChanged',function(){
        $scope.onFilterChange();
    });

    //Generic function to call on the change of filter parameters
    $scope.onFilterChange = function() {
        initPaginationParams();
        fetchCommissionDetails();
    };


    /* Handling different date picker clicks */
    $scope.clickedFromDate = function(){
        $scope.popupCalendar('FROM');
    };
    $scope.clickedToDate = function(){
        $scope.popupCalendar('TO');
    };
    // Show calendar popup.
    $scope.popupCalendar = function(clickedOn) {
        $scope.clickedOn = clickedOn;
        ngDialog.open({
            template:'/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
            controller: 'RVArTransactionsDatePickerController',
            className: '',
            scope: $scope
        });
    };

    var updateCommissionSummary = function(commissionList) {
        var unpaidCommission = 0,
            totalRevenue = 0,
            totalCommission = 0;
        commissionList.forEach(function(commission) {
            if (commission.commission_paid_status == 'unpaid') {
               unpaidCommission += commission.commission_amount;
            }
            totalCommission += commission.commission_amount;
            totalRevenue += commission.reservation_revenue;
        });

        $scope.commissionSummary.totalUnpaidCommission = unpaidCommission;
        $scope.commissionSummary.totalRevenue = totalRevenue;
        $scope.commissionSummary.totalCommission = totalCommission;
    };

    //Selecting individual record checkbox
    $scope.onCheckBoxSelection = function(commission) {
        commission.is_checked = !commission.is_checked;
        if (commission.is_checked) {
            $scope.selectedCommissions.push(commission);
        } else {
            $scope.selectedCommissions = _.filter($scope.selectedCommissions, function(value) {
                                                return value.reservation_id != commission.reservation_id;
                                            });
        }
        updateCommissionSummary($scope.selectedCommissions);
    };

    //Updates the checked status of the current  page records while making the whole selection
    var updateCheckedStatus = function(status) {
       for(var i in $scope.commissionDetails) {
         $scope.commissionDetails[i].is_checked = status;
       }
    };

    //Select all checkbox action
    $scope.toggleSelection = function() {
        $scope.selectAll = !$scope.selectAll;
        if($scope.selectAll) {
            updateCheckedStatus(true);
            updateCommissionSummary($scope.commissionDetails);
        } else {
           updateCheckedStatus(false);
           fetchCommissionDetails();

        }

    };

    //Updates the paid status to the server
    var updatePaidStatus = function(reqData) {
        var onCommissionStatusUpdateSuccess = function(data) {
                fetchCommissionDetails();
            },
            onCommissionStatusUpdateFailure = function(error) {
                fetchCommissionDetails();
            };
        $scope.invokeApi(RVCompanyCardSrv.saveTACommissionDetails, reqData, onCommissionStatusUpdateSuccess, onCommissionStatusUpdateFailure);
    };

    //Action for the paid/unpaid toggle button for individual record
    $scope.togglePaidStatus = function(commission) {
        var commissionToUpdate = {};
        commissionToUpdate.reservation_id = commission.reservation_id;
        commissionToUpdate.status = commission.commission_paid_status == "paid" ? "unpaid" : "paid";

        var requestData = {};
        requestData.accountId = $scope.accountId;
        requestData.commissionDetails = [commissionToUpdate];
        updatePaidStatus(requestData);
    };

    //Updates the paid status of all the selected records
    $scope.onGroupPaidStatusChange = function() {
        var commissionListToUpdate = [];
        if($scope.selectAll) {
           $scope.commissionDetails.forEach(function(commission) {
                commissionListToUpdate.push({id : commission.reservation_id, status : $scope.status.groupPaidStatus});
           });
        } else {
            $scope.selectedCommissions.forEach(function(commission) {
                commissionListToUpdate.push({id : commission.reservation_id, status : $scope.status.groupPaidStatus});
            });
        }

        var requestData = {};
        requestData.accountId = $scope.accountId;
        requestData.commissionDetails = commissionListToUpdate;
        updatePaidStatus(requestData);
    };

    //Initailizes the controller
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
        $scope.accountId = $stateParams.id;

        $scope.pagination = {
          start : 1,
          end : RVCompanyCardSrv.DEFAULT_PER_PAGE,
          totalResultCount : 0
        };

        $scope.selectAll = false;
        $scope.selectedCommissions = [];
        $scope.status = {
           groupPaidStatus : ""
        };
        fetchCommissionDetails();
    };

    init();

}]);