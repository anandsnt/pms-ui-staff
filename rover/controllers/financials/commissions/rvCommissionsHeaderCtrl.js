sntRover.controller('RVCommisionsHeaderCtrl', ['$scope', 'ngDialog', '$log', '$timeout', 'RVCommissionsSrv', function($scope, ngDialog, $log, $timeout, RVCommissionsSrv) {
    BaseCtrl.call(this, $scope);

    var setParamsInCurrentPage = function(params) {
        params.selected_tas = [];
        _.each($scope.selectedAgentIds, function(id) {
            params.selected_tas.push(id);
        });
        return params;
    };

    var setParamsInCurrentPageAndOtherPages = function(params) {
        params.un_selected_tas = [];
        _.each($scope.commissionsData.accounts, function(account) {
            if (!account.isSelected) {
                params.un_selected_tas.push(account.id);
            }
        });
        return params;
    };

    var generateParams = function() {
        var params = {};

        if ($scope.areAllAgentsSelected()) {
            params.update_all_tas = true;
        } else {
			// if only items in the existing page are selected
            if ($scope.noOfTASelected <= $scope.filterData.perPage) {
                params = setParamsInCurrentPage(params);
            } else {
				// when more than per page items are selected and
				// some of the current page items are unchecked
                params = setParamsInCurrentPageAndOtherPages(params);
            }
            params.partially_selected_tas = [];
            params.selected_reservations_ids = [];
            _.each($scope.commissionsData.accounts, function(account) {
                if (account.isExpanded && account.selectedReservations.length
                    && account.selectedReservations.length !== account.reservationsData.total_count) {
                    params.partially_selected_tas.push(account.id);
                    params.selected_reservations_ids = params.selected_reservations_ids.concat(account.selectedReservations);
                }
            });
        }
        return params;
    };

    var setExportStatus = function(inProgress, failed, success) {
        $scope.exportSuccess = success;
        $scope.exportFailed = failed;
        $scope.exportInProgess = inProgress;
    };

    $scope.exportCommisions = function() {

        var params = {
            min_commission_amount: $scope.filterData.minAmount,
            query: $scope.filterData.searchQuery,
            sort_by: $scope.filterData.sort_by.value
        };
        
        var options = {
            params: params,
            successCallBack: function() {
				// for now we will only show in progress status and then dismiss the
				// popup
                $timeout(function() {
                    setExportStatus(false, false, true);
                    ngDialog.close();
                }, 1000);
            },
            failureCallBack: function() {
                setExportStatus(false, true, false);
            }
        };

        setExportStatus(true, false, false);
        $scope.callAPI(RVCommissionsSrv.exportCommissions, options);
    };

    $scope.showExportPopup = function() {
        setExportStatus(false, false, false);
        ngDialog.open({
            template: '/assets/partials/financials/commissions/rvCommissionsExport.html',
            className: '',
            scope: $scope
        });
    };

    $scope.popupBtnAction = function(action) {
        var params = generateParams();

        params.action_type = action;
        var successCallBack = function() {
            ngDialog.close();
            $scope.fetchAgentsData();
        };

        $scope.invokeApi(RVCommissionsSrv.updateCommissionPaidStatus, params, successCallBack);
    };

    var openNgDialogWithTemplate = function(template) {
        ngDialog.open({
            template: '/assets/partials/financials/commissions/' + template + '.html',
            className: '',
            scope: $scope
        });
    };

    $scope.openPopupWithTemplate = function(template) {
        openNgDialogWithTemplate(template);
    };


}]);
