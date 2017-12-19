sntRover.controller('companyCardCommissionsCtrl', [
    '$scope',
    '$state',
    '$rootScope',
    '$stateParams',
    'RVCompanyCardSrv',
    'ngDialog',
    '$timeout',
    'rvPermissionSrv',
    'rvUtilSrv',
    '$window',
    '$vault',
    function($scope, $state, $rootScope, $stateParams, RVCompanyCardSrv, ngDialog, $timeout, rvPermissionSrv, util, $window, $vault ) {
        BaseCtrl.call(this, $scope);

    // Get the request parameters for the commission filtering
        var getRequestParams = function() {
            var params = {};

            if ($scope.filterData.fromDate) {
                params.from_date = $scope.filterData.fromDate;
            }
            if ($scope.filterData.toDate) {
                params.to_date = $scope.filterData.toDate;
            }
            params.paid_status = $scope.filterData.paidStatus;
            params.commission_status = $scope.filterData.commissionStatus;
            params.per_page = $scope.filterData.perPage;
            params.page = $scope.filterData.page;
            params.hotel_id = parseInt($scope.filterData.selectedHotel);
            return params;

        };

        $scope.setScroller('commission-list');
        var refreshScroll = function() {
            $timeout(function() {
                $scope.refreshScroller('commission-list');
            }, 3000);
        };

        refreshScroll();
    // Refresh the scroller when the tab is active.
        $scope.$on('commissionsTabActive', function() {
        // CICO-46891
            fetchCommissionDetails(true);
        });

    var fetchCommissionDetailsForPage = function(page_no) {
        $scope.filterData.page = page_no;
        fetchCommissionDetails(true);
    };

    // Fetches the commission details for the given filter options
        var fetchCommissionDetails = function(isPageChanged) {
            var onCommissionFetchSuccess = function(data) {

                    _.each(data.commission_details, function(element, index) {
                        _.extend(element, {is_checked: false});
                    });
                    $scope.selectedHotelCurrency = getCurrencySign(data.currency.value);
                    $scope.commissionDetails = data.commission_details;
                    $scope.commissionSummary.totalRevenue = data.total_revenue;
                    $scope.commissionSummary.totalCommission = data.total_commission;
                    $scope.commissionSummary.totalUnpaidCommission = data.total_commission_unpaid;
                    $scope.commissionSummary.taxOnCommissions = data.tax_on_commissions;
                // set pagination controls values
                    $scope.pagination.totalResultCount = data.total_count;
                // if ($scope.nextAction && isPageChanged) {
                //     $scope.pagination.start = $scope.pagination.start + $scope.filterData.perPage;
                // }
                // if ($scope.prevAction && isPageChanged) {
                //     $scope.pagination.start = $scope.pagination.start - $scope.filterData.perPage ;
                // }

                // if (isPageChanged) {
                //     $scope.pagination.end = $scope.pagination.start + $scope.commissionDetails.length - 1;
                // }
                    $timeout(function () {
                        $scope.$broadcast('updatePagination', $scope.paginationData.id );
                    }, 1000);
                    $scope.$emit('hideLoader');
                    refreshScroll();
                },
                onCommissionFetchFailure = function(error) {
                    $scope.$emit('hideLoader');
                    $scope.commissionDetails = [];
                    $scope.commissionSummary = {};
                };

            var requestData = {};

            requestData.params = getRequestParams();
            requestData.accountId = $scope.accountId;
        // CICO-44105 : Removing api call on creating new cards.
            if ( $scope.accountId !== 'add') {
                $scope.invokeApi(RVCompanyCardSrv.fetchTACommissionDetails, requestData, onCommissionFetchSuccess, onCommissionFetchFailure);
            }

        };

    /* Checking permission for edit PAID & UNPAID   */

        $scope.hasPermissionToEditPaid = function() {
            return rvPermissionSrv.getPermissionValue ('EDIT_COMMISSIONS_TAB');
        };

        $scope.loadNextSet = function() {
            $scope.filterData.page++;
            $scope.nextAction = true;
            $scope.prevAction = false;
            clearCurrentSelection();
            fetchCommissionDetails(true);
        };

        $scope.loadPrevSet = function() {
            $scope.filterData.page--;
            $scope.nextAction = false;
            $scope.prevAction = true;
            clearCurrentSelection();
            fetchCommissionDetails(true);
        };
    /*
     * Navigate to staycard from commissions tab reservations
     * @param reservation_id reservation id
     * @param confirmation_no confirmation no
     */
        $scope.goToStayCard = function(reservation_id, confirmation_no) {
            if ($rootScope.hotelDetails.userHotelsData.current_hotel_id === parseInt($scope.filterData.selectedHotel))
        {            
                $state.go('rover.reservation.staycard.reservationcard.reservationdetails', {'id': reservation_id,
                    'confirmationId': confirmation_no,
                    'isrefresh': true,
                    'isFromTACommission': true});
            }
        };

        $scope.isNextButtonDisabled = function() {
            var isDisabled = false;

            if ($scope.commissionDetails.length == 0) {
                return true;
            }
            if ($scope.pagination.end >= $scope.pagination.totalResultCount) {
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

        $scope.clearToDateField = function() {
            $scope.filterData.toDate = '';
            $scope.onFilterChange();
        };
        $scope.clearFromDateField = function() {
            $scope.filterData.fromDate = '';
            $scope.onFilterChange();
        };

        $scope.shouldShowPagination = function() {
            return $scope.commissionDetails.length > 0 && $scope.pagination.totalResultCount > $scope.filterData.perPage;
        };

        var initPaginationParams = function() {
            $scope.filterData.page = 1;
            $scope.pagination.start = 1;
            $scope.nextAction = false;
            $scope.prevAction = false;
        };

    // To handle from date change
        $scope.$on('fromDateChanged', function() {
            $scope.onFilterChange();
        });

    // To handle to date change
        $scope.$on('toDateChanged', function() {
            $scope.onFilterChange();
        });

    // Generic function to call on the change of filter parameters
        $scope.onFilterChange = function() {
            initPaginationParams();
            $scope.selectedCommissions = [];
            $scope.prePaidCommissions = [];
            fetchCommissionDetails(true);
        };


    /* Handling different date picker clicks */
        $scope.clickedFromDate = function() {
            $scope.popupCalendar('FROM');
        };
        $scope.clickedToDate = function() {
            $scope.popupCalendar('TO');
        };
    // Show calendar popup.
        $scope.popupCalendar = function(clickedOn) {
            $scope.clickedOn = clickedOn;
            ngDialog.open({
                template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
                controller: 'RVCommissionsDatePickerController',
                className: '',
                scope: $scope
            });
        };

        var updateCommissionSummary = function(commissionList) {
            var unpaidCommission = 0,
                totalRevenue = 0,
                totalCommission = 0;

            commissionList.forEach(function(commission) {
                if (!isEmptyObject(commission.commission_data)) {
                    if (commission.commission_data.paid_status == 'Unpaid') {
                        unpaidCommission += commission.commission_data.amount;
                    }
                    totalCommission += commission.commission_data.amount;
                }

                totalRevenue += commission.reservation_revenue;
            });

            $scope.commissionSummary.totalUnpaidCommission = unpaidCommission;
            $scope.commissionSummary.totalRevenue = totalRevenue;
            $scope.commissionSummary.totalCommission = totalCommission;
        };

    // Selecting individual record checkbox
        $scope.onCheckBoxSelection = function(commission) {
            $scope.filterData.commssionRecalculationValue = '';
            if (commission.is_checked) {
                if (commission.commission_data.paid_status == 'Prepaid') {
                    $scope.prePaidCommissions.push(commission);
                } else {
                    $scope.selectedCommissions.push(commission);
                }
            } else {
                $scope.selectedCommissions = _.filter($scope.selectedCommissions, function(value) {
                    return value.reservation_id != commission.reservation_id;
                });
                $scope.prePaidCommissions = _.filter($scope.prePaidCommissions, function(value) {
                    return value.reservation_id != commission.reservation_id;
                });
            }
            if ($scope.selectedCommissions.length == 0 && $scope.prePaidCommissions.length == 0) {
                fetchCommissionDetails(false);
                $scope.status.groupPaidStatus = '';
            } else {
                $scope.status.groupPaidStatus = '';
                var commissionList = $scope.selectedCommissions.concat($scope.prePaidCommissions);

                updateCommissionSummary(commissionList);
            }

            if ($scope.selectedCommissions.length === 0) {
                $scope.filterData.selectAll = false;
                $scope.toggleSelection();
            }            
        };

    // Updates the checked status of the current  page records while making the whole selection
        var updateCheckedStatus = function(status) {
            for (var i in $scope.commissionDetails) {
                $scope.commissionDetails[i].is_checked = status;
            }
        };

    // Select all checkbox action
        $scope.toggleSelection = function() {

            $scope.filterData.commssionRecalculationValue = '';

            if ($scope.filterData.selectAll) {
                updateCheckedStatus(true);
                $scope.selectedCommissions = Object.assign([], $scope.commissionDetails);
                $scope.prePaidCommissions = [];
                updateCommissionSummary($scope.commissionDetails);
                $scope.status.groupPaidStatus = '';
            } else {
                updateCheckedStatus(false);
                $scope.selectedCommissions = [];
                $scope.prePaidCommissions = [];
                fetchCommissionDetails(false);
                $scope.status.groupPaidStatus = '';
            }
        };

    // Updates the paid status to the server
        var updatePaidStatus = function(reqData) {
            var onCommissionStatusUpdateSuccess = function(data) {
                    clearCurrentSelection();
                    fetchCommissionDetails(false);
                },
                onCommissionStatusUpdateFailure = function(error) {
                    clearCurrentSelection();
                    fetchCommissionDetails(false);
                };

            $scope.invokeApi(RVCompanyCardSrv.saveTACommissionDetails, reqData, onCommissionStatusUpdateSuccess, onCommissionStatusUpdateFailure);
        };

    // Clear the selections after the paid status updation as we are refreshing the list after that
        var clearCurrentSelection = function() {
            $scope.selectedCommissions = [];
            $scope.prePaidCommissions = [];
            $scope.filterData.selectAll = false;
        };
    
    /*
     * Toggle global button
     */
        $scope.isTogglePaidStatusEnabled = function() {
            var isToggleEnabled = true;

            if ($scope.contactInformation.is_global_enabled) {
                isToggleEnabled = false;
                if (rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE')) {
                    isToggleEnabled = true;
                }
            
            }
            return isToggleEnabled;
        };

        $scope.shouldShowProperty = function() {
            var shouldShowPropertyDropDown = false;
        
            if ($scope.contactInformation.is_global_enabled && rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE') && $rootScope.isAnMPHotel) {
                shouldShowPropertyDropDown = true;
            }
            return shouldShowPropertyDropDown;
        };

    // Action for the paid/unpaid toggle button for individual record
        $scope.togglePaidStatus = function(commission) {

            var commissionToUpdate = {};

            commissionToUpdate.reservation_id = commission.reservation_id;
            commissionToUpdate.status = commission.commission_data.paid_status == 'Paid' ? 'Unpaid' : 'Paid';

            var requestData = {};

            requestData.accountId = $scope.accountId;
            requestData.commissionDetails = [commissionToUpdate];
            updatePaidStatus(requestData);

        };

        $scope.toggleHoldStatus = function(commission) {

            if (commission.commission_data.paid_status == "Paid" || commission.commission_data.paid_status == "Prepaid") {
                $scope.errorMessage = ['Only transactions on \'UNPAID\' status can be set to On Hold'];
                return;
            }
            var commissionToUpdate = {};

            commissionToUpdate.reservation_id = commission.reservation_id;
            commissionToUpdate.status = commission.commission_data.paid_status == 'On Hold' ? 'Unpaid' : 'On Hold';

            var requestData = {};

            requestData.accountId = $scope.accountId;
            requestData.commissionDetails = [commissionToUpdate];
            updatePaidStatus(requestData);
        };

    // Updates the paid status of all the selected records
        $scope.onGroupPaidStatusChange = function(isFromHoldStatus) {

            var commissionListToUpdate = [], isSelectionError = false;

            if ($scope.filterData.selectAll) {
                $scope.commissionDetails.forEach(function(commission) {
                    if (isFromHoldStatus && commission.commission_data.paid_status != 'Unpaid' && commission.commission_data.paid_status != 'On Hold') {
                        isSelectionError = true;
                    }
                    if (commission.commission_data.paid_status != 'Prepaid') {
                        commissionListToUpdate.push({reservation_id: commission.reservation_id,
                            status: $scope.status.groupPaidStatus});
                    }
                });
            } else {
                $scope.selectedCommissions.forEach(function(commission) {
                    if (isFromHoldStatus && commission.commission_data.paid_status != 'Unpaid' && commission.commission_data.paid_status != 'On Hold') {
                        isSelectionError = true;
                    }
                    if (commission.commission_data.paid_status != 'Prepaid') {
                        commissionListToUpdate.push({reservation_id: commission.reservation_id,
                            status: $scope.status.groupPaidStatus});
                    }
                });
            }

            var requestData = {};

            requestData.accountId = $scope.accountId;
            requestData.commissionDetails = commissionListToUpdate;
            if (isSelectionError) {
                $scope.errorMessage = ["The hold status can be updated only for unpaid or on hold commissions"];
            } else {
                updatePaidStatus(requestData);
            }
            
        };

        $scope.showToggleButton = function(commissionDetail) {
            var hasShownToggleBtn = commissionDetail.commission_data.paid_status == 'Paid' || commissionDetail.commission_data.paid_status == 'Unpaid';

            return hasShownToggleBtn ? {'visibility': 'visible'} : {'visibility': 'hidden'};
        };

    // To print the current screen details.
        $scope.clickedPrintButton = function() {

        // CICO-11667 to enable landscpe printing on transactions page.
        // Sorry , we have to access the DOM , so using jQuery..
            $('body').prepend('<style id=\'paper-orientation\'>@page { size: landscape; }</style>');

        /*
         *  ======[ READY TO PRINT ]======
         */
        // this will show the popup
            $timeout(function() {
            /*
             *  ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
             */

                $window.print();

                if ( sntapp.cordovaLoaded ) {
                    cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
                }

            // Removing the style after print.
                $('#paper-orientation').remove();

            }, 100);

        /*
         *  ======[ PRINTING COMPLETE. JS EXECUTION WILL COMMENCE ]======
         */

        };
    // Handle toggle commssion action
        $scope.toggleCommission = function() {
            $scope.filterData.toggleCommission = !$scope.filterData.toggleCommission;
        };
    // Method to fetch selected reservatio ids list
        var getSelectedReservationsHavingCommission = function() {

            var commissionListToUpdate = [];

            if ($scope.filterData.selectAll) {
                $scope.commissionDetails.forEach(function(commission) {
                    if (commission.commission_data.paid_status != 'Prepaid') {
                        commissionListToUpdate.push(commission.reservation_id);
                    }
                });
            } else {
                $scope.selectedCommissions.forEach(function(commission) {
                    if (commission.commission_data.paid_status != 'Prepaid') {
                        commissionListToUpdate.push(commission.reservation_id);
                    }
                });
            }

            return commissionListToUpdate;
        };

    // Method to select toggle mode
        var getCommissionRecalculateType = function() {
            var type = 'percent';

            if ($scope.filterData.toggleCommission) {
                type = 'amount';
            }

            return type;
        };

    // Handle recalculate button click
        $scope.clickedRecalculate = function() {

            var recalculateCommissionSuccess = function(data) {
                    clearCurrentSelection();

                    $timeout(function() {
                        fetchCommissionDetails(false);
                    }, 2000);
                },
                recalculateCommissionFailure = function(error) {
                    $scope.errorMessage = error;
                    $scope.$emit('hideLoader');
                };

            var postData = {
                'type': getCommissionRecalculateType(),
                'value': $scope.filterData.commssionRecalculationValue,
                'reservation_ids': getSelectedReservationsHavingCommission()
            };

            $scope.invokeApi(RVCompanyCardSrv.recalculateCommission, postData, recalculateCommissionSuccess, recalculateCommissionFailure);
        };
    /*
     * Fetch multi properties
     */
        var fetchMultiProperties = function() {
            var onPropertyFetchSuccess = function(data) {

                $scope.multiProperies = data.multi_properties;
            };

            var requestData = {};

            requestData.accountId = $scope.accountId;
        
            $scope.invokeApi(RVCompanyCardSrv.fetchMultiProperties, requestData, onPropertyFetchSuccess);

        };

        $scope.$on('LOAD_SUBSCRIBED_MPS', function() {
            if ($scope.contactInformation.is_global_enabled && $rootScope.isAnMPHotel && rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE')) {
                fetchMultiProperties();
            }
        
        });
        // CICO-47385 : Commissions: Status selection is not switching to "Commissionable" while opting a different property
        $scope.onPropertyFilterChange = function() {
            if ($rootScope.hotelDetails.userHotelsData.current_hotel_id !== parseInt($scope.filterData.selectedHotel)) {
                $scope.filterData.commissionStatus = "Commissionable";
            }
            $scope.onFilterChange();
        };


    // Initailizes the controller
    var init = function() {
        $scope.commissionDetails = [];
        $scope.commissionSummary = {};
        $scope.filterData = {
            fromDate: "",
            toDate: "",
            paidStatus: "Unpaid",
            commissionStatus: "Commissionable",
            perPage: 25, // RVCompanyCardSrv.DEFAULT_PER_PAGE,
            page: 1,
            start: 1,
            selectAll: false,
            toggleCommission: false,
            commssionRecalculationValue: '',
             // By default set the value to current hotel
                selectedHotel: parseInt($rootScope.hotelDetails.userHotelsData.current_hotel_id)
            };
        // NOTE: This controller runs under stay card too; In such a case, the $stateParams.id will have the reservation ID
            $scope.accountId = $state.current.name === 'rover.reservation.staycard.reservationcard.reservationdetails' ?
            $scope.travelAgentInformation.id : $stateParams.id;
            $scope.isEmpty = util.isEmpty;
            $scope.isEmptyObject = isEmptyObject;

            $scope.pagination = {
                start: 1,
                end: RVCompanyCardSrv.DEFAULT_PER_PAGE,
                totalResultCount: 0
            };
            $scope.selectedCommissions = [];
            $scope.prePaidCommissions = [];
            $scope.status = {
                groupPaidStatus: ''
            };
            $scope.businessDate = $rootScope.businessDate;
        // CICO-46891
            if ($scope.currentSelectedTab === 'cc-commissions') {
                fetchCommissionDetails(true);
            }
            $vault.set('travelAgentId', $stateParams.id);
            $vault.set('travelAgentType', $stateParams.type);
            $vault.set('travelAgentQuery', $stateParams.query);

            $scope.paginationData = {
                id: 'RESERVATION_LIST_' + $scope.accountId,
                api: fetchCommissionDetailsForPage,
                perPage: $scope.filterData.perPage
            };

        };

        init();

    }]);
