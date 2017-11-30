sntRover.controller('RVCommissionsSummaryController', ['$scope',
    '$rootScope',
    '$stateParams',
    '$filter',
    'RVCommissionsSrv',
    '$timeout',
    '$window',
    '$state',
    function($scope, $rootScope, $stateParams, $filter, RVCommissionsSrv, $timeout, $window, $state) {

        BaseCtrl.call(this, $scope);

        var updateHeader = function() {
            // Setting up the screen heading and browser title.
            $scope.$emit('HeaderChanged', $filter('translate')('MENU_COMMISIONS'));
            $scope.setTitle($filter('translate')('MENU_COMMISSIONS'));
            $scope.$emit('updateRoverLeftMenu', 'commisions');
        };

        var refreshArOverviewScroll = function() {
            $timeout(function() {
                $scope.refreshScroller('commissionOverViewScroll');
            }, 500);
        };

        var calculateTotalSelectedBillAmount = function() {
            var total_amount = 0,
                totalBillAmountOnCurrentPage = 0;

            _.each($scope.commissionsData.accounts, function(account) {
                totalBillAmountOnCurrentPage += parseFloat(account.amount_owing);
                if (account.isSelected || account.isSemiSelected) {
                    if (account.reservationsData && account.reservationsData.reservations) {
                        _.each(account.reservationsData.reservations, function (reservation) {
                            if (reservation.isSelected) {
                                total_amount += parseFloat(reservation.amount_owing);
                            }
                        });
                    } else {
                        total_amount += parseFloat(account.amount_owing);
                    }
                }
            });

            if (!$scope.allCommisionsSelected) {
                $scope.commissionsData.selectedBillsAmount = total_amount;
            } else {
                var totalAmountForSelectedTab = $scope.filterData.filterTab === 'ON_HOLD' ?
                    $scope.commissionsData.amount_totals.on_hold : $scope.commissionsData.amount_totals.unpaid;

                $scope.commissionsData.selectedBillsAmount = parseFloat(totalAmountForSelectedTab)
                    - totalBillAmountOnCurrentPage + total_amount;
            }
        };

        $scope.resetSelections = function() {
            $scope.noOfTASelected = 0;
            $scope.noOfBillsSelected = 0;
            $scope.noOfTAInOtherPagesSelected = 0;
            $scope.allCommisionsSelected = false;
            $scope.selectedAgentIds = [];
            $scope.commissionsData.selectedBillsAmount = 0;
            _.each($scope.commissionsData.accounts, function(account) {
                account.isSelected = false;
                account.isSemiSelected = false;
                account.isExpanded = false;
                account.isSemiSelected = false;
                account.reservationsData = {};
                account.selectedReservations = [];
            });
        };

        // clicked on the expandable icon
        $scope.expandCommision = function(account) {
            account.reservationsData = {};
            account.selectedReservations = [];
            // if already expanded, collapse
            if (account.isExpanded) {
                account.isExpanded = false;
                account.isSemiSelected = false;
            } else {
                account.fetchReservationData();
            }
            calculateTotalSelectedBillAmount();
        };

        // based on selections, the top menu changes.
        // check if all agents are selected
        $scope.areAllAgentsSelected = function() {
            return $scope.commissionsData.total_count > 0 && $scope.commissionsData.total_count === $scope.noOfTASelected;
        };

        // check if any one of the agents is selected
        $scope.areAgentsPartialySelected = function() {
            return $scope.noOfTASelected > 0 && $scope.commissionsData.total_count !== $scope.noOfTASelected;
        };

        // check if any one of the reservation inside any agent is selected
        $scope.areAnyReservationsPartialySelected = function() {
            if ($scope.commissionsData.accounts) {
                var isAnyReservationIsSelected = false;

                _.each($scope.commissionsData.accounts, function(account) {
                    if (account.isExpanded && account.selectedReservations.length) {
                        isAnyReservationIsSelected = true;
                    }
                });
                return isAnyReservationIsSelected;
            } 
            return false;
            
        };

        var deleteFromSelectedAgentList = function(account) {
            var indexOfOpenedAccount = $scope.selectedAgentIds.indexOf(account.id);

            if (indexOfOpenedAccount !== -1) {
                $scope.selectedAgentIds.splice(indexOfOpenedAccount, 1);
            }
        };

        var setReservationSelectedStatus = function(account, isSelected, isSemiSelected) {
            account.isSelected = isSelected;
            account.isSemiSelected = isSemiSelected;
        };

        var addRemoveFromSelectedReservationsList = function(account, reservation) {
            var selectedIndex = account.selectedReservations.indexOf(reservation.id);

            // is checked and was not added before
            if (reservation.isSelected && selectedIndex === -1) {
                account.selectedReservations.push(reservation.id);
                $scope.noOfBillsSelected = $scope.noOfBillsSelected + 1;
            } else if (!reservation.isSelected && selectedIndex !== -1) {
                // was unchecked and was added before --> remove the item from array
                account.selectedReservations.splice(selectedIndex, 1);
                $scope.noOfBillsSelected = $scope.noOfBillsSelected - 1;
                if (account.isSelected) {
                    $scope.noOfTASelected--;
                }
                if (account.selectedReservations.length > 0) {
                    account.isSemiSelected = true;
                }
                account.isSelected = false;
            }
        };

        // based on the change in reservation selection, the corresponding 
        // agent and all agent selected/ semi selected flag need to be set.
        $scope.reservationSelectionChanged = function(account, reservation) {
            // if selected, add to the array
            addRemoveFromSelectedReservationsList(account, reservation);
            // set the checked status of the outer account, based on inner checkbox selections
            if (account.selectedReservations.length === 0) {
                // if no items are selected
                setReservationSelectedStatus(account, false, false);
                deleteFromSelectedAgentList(account);
            } else if (account.selectedReservations.length !== account.reservationsData.total_count) {
                // check if only some are selected
                setReservationSelectedStatus(account, false, true);
                deleteFromSelectedAgentList(account);
            } else if (account.selectedReservations.length === account.reservationsData.total_count) {
                // check if ALL reservations are selected
                // if so turn ON corresponding commision and based on other 
                // commisions, turn ON main allCommisionsSelected
                setReservationSelectedStatus(account, true, false);
                if ($scope.selectedAgentIds.indexOf(account.id) === -1) {
                    $scope.selectedAgentIds.push(account.id);
                }
                $scope.noOfTASelected++;
            } else {
                return;
            }
            calculateTotalSelectedBillAmount();
        };

        var handleExpandedReservationsList = function(account) {
            if (account.isSelected) {
                _.each(account.reservationsData.reservations, function(reservation) {
                    reservation.isSelected = true;
                    var indexOfRes = account.selectedReservations.indexOf(reservation.id);

                    if (reservation.isSelected && indexOfRes === -1) {
                        account.selectedReservations.push(reservation.id);
                    } else if (!reservation.isSelected && indexOfRes !== -1) {
                        account.selectedReservations.slice(indexOfRes, 1);
                    }
                });
            } else {
                _.each(account.reservationsData.reservations, function(reservation) {
                    reservation.isSelected = false;
                });
                account.selectedReservations = [];
            }
        };

        // based on the commision selection, set the no of bills.
        $scope.commisionSelectionChanged = function(account) {

            account.isSemiSelected = false;
            $scope.selectedAgentIds = [];
            // based on selection, update no of bills
            if (account.isSelected) {
                $scope.noOfTASelected++;
                // substract all selected Resevations and add all reservations again
                $scope.noOfBillsSelected = $scope.noOfBillsSelected - account.selectedReservations.length + account.number_of_unpaid_bills;
            } else if ($scope.noOfTASelected > 0) {
                $scope.noOfTASelected--;
                $scope.noOfBillsSelected = $scope.noOfBillsSelected - account.number_of_unpaid_bills;
            } else {
                $scope.noOfTASelected = 0;
                $scope.noOfBillsSelected = $scope.noOfBillsSelected - account.number_of_unpaid_bills;
            }
            // check if any one of the entity is selected
            _.each($scope.commissionsData.accounts, function(account) {
                if (account.isSelected) {
                    $scope.selectedAgentIds.push(account.id);
                }
            });
            // set the checked status of the inner reservations list
            if (account.isExpanded) {
                handleExpandedReservationsList(account);
            }
            calculateTotalSelectedBillAmount();
        };

        // check / uncheck all commisions dispayed based on the main selection
        $scope.allCommisionsSelectionChanged = function() {

            $scope.selectedAgentIds = [];

            // check/ uncheck all the commisions appearing
            _.each($scope.commissionsData.accounts, function(account) {
                account.isSelected = $scope.allCommisionsSelected;
                account.isExpanded = false;
                account.reservationsData = {};
                account.selectedReservations = [];
                account.isSemiSelected = false;
                if (account.isSelected) {
                    $scope.selectedAgentIds.push(account.id);
                }
            });

            if ($scope.allCommisionsSelected) {
                $scope.noOfTASelected = $scope.commissionsData.total_count;
                $scope.noOfTAInOtherPagesSelected = $scope.commissionsData.total_count - $scope.commissionsData.accounts.length;
                $scope.noOfBillsSelected = $scope.filterData.filterTab === 'ON_HOLD' ?
                    $scope.commissionsData.bill_count_totals.on_hold : $scope.commissionsData.bill_count_totals.open;
            } else {
                $scope.noOfTASelected = 0;
                $scope.noOfTAInOtherPagesSelected = 0;
                $scope.noOfBillsSelected = 0;
            }
            calculateTotalSelectedBillAmount();
        };

        // main tab switch - On Hold and To pay
        $scope.setFilterTab = function(selectedTab) {
            $scope.commissionsData = {};
            $scope.filterData.billStatus.value = selectedTab === 'ON_HOLD' ? 'ON_HOLD' : 'UN_PAID';
            $scope.searchAccounts();
            $scope.filterData.filterTab = selectedTab;
        };

        /**   *************** Search starts here *****************/

        var reservationsListFetchCompletedActions = function(account, response) {
            account.isExpanded = true;
            account.reservationsData = response;
            // if the account is selected, the reservation list 
            // inside should be selected
            _.each(account.reservationsData.reservations, function(reservation) {
                var indexOfRes = account.selectedReservations.indexOf(reservation.id);

                reservation.isSelected = account.isSelected || indexOfRes !== -1;

                if (reservation.isSelected && indexOfRes === -1) {
                    account.selectedReservations.push(reservation.id);
                }
            });
            // start with page 1
            account.reservationsPageNo = 1;
            account.showResPagination = account.reservationsData.total_count > $scope.filterData.innerPerPage;
            $timeout(function() {
                $scope.$broadcast('updatePagination', 'RESERVATION_LIST_' + account.id);
            }, 100);
            refreshArOverviewScroll();
        };

        var setUpReserationsListForAgents = function() {
            _.each($scope.commissionsData.accounts, function(account) {
                account.isExpanded = false;
                account.fetchReservationData = function(pageNo) {
                    var page = pageNo ? pageNo : 1;

                    var onFetchListSuccess = function(response) {
                        reservationsListFetchCompletedActions(account, response);
                    };

                    $scope.callAPI(RVCommissionsSrv.fetchReservationOfCommissions, {
                        params: {
                            id: account.id,
                            'page': page,
                            'per_page': $scope.filterData.innerPerPage,
                            'action_type': $scope.filterData.filterTab
                        },
                        successCallBack: onFetchListSuccess
                    });
                };
                account.paginationData = {
                    id: 'RESERVATION_LIST_' + account.id,
                    api: account.fetchReservationData,
                    perPage: $scope.filterData.innerPerPage
                };
            });
        };

        $scope.fetchAgentsData = function(pageNo) {
            $scope.filterData.page = pageNo ? pageNo : 1;
            var successCallBack = function(data) {
                $scope.commissionsData = data;
                setUpReserationsListForAgents();
                $scope.resetSelections();
                $scope.showPagination = !($scope.commissionsData.total_count <= $scope.filterData.perPage);
                $scope.errorMessage = '';
                $scope.$emit('hideLoader');
                refreshArOverviewScroll();
                $timeout(function() {
                    $scope.$broadcast('updatePagination', 'TA_LIST');
                }, 100);
                $scope.initialLoading = false;
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
            $scope.fetchAgentsData();
        };

        $scope.clearSearchQuery = function() {
            $scope.filterData.searchQuery = '';
            $scope.fetchAgentsData();
        };
        /* *************** search ends here **************************** */
        $scope.printButtonClick = function() {
            $timeout(function() {
                $window.print();
                if (sntapp.cordovaLoaded) {
                    cordova.exec(function() {}, function() {}, 'RVCardPlugin', 'printWebView', []);
                }
            }, 100);
        };
      
        $scope.navigateToTA = function(account) {
            // https://stayntouch.atlassian.net/browse/CICO-40583
            // Can navigate to TA even if commission is off.
            $state.go('rover.companycarddetails', {
                id: account.id,
                type: 'TRAVELAGENT',
                origin: 'COMMISION_SUMMARY'
            });
        };

        (function() {
            updateHeader();
            $scope.commissionsData = {};
            $scope.filterData = RVCommissionsSrv.filterData;
            // set intial values
            $scope.noOfTASelected = 0;
            // if select ALL is applied, it will update all items in other pages also.
            $scope.noOfTAInOtherPagesSelected = 0;
            $scope.allCommisionsSelected = false;
            $scope.selectedAgentIds = [];
            $scope.pageNo = 1;
            $scope.noOfBillsSelected = 0;
            $scope.paginationData = {
                id: 'TA_LIST',
                api: $scope.fetchAgentsData,
                perPage: $scope.filterData.perPage
            };
            $scope.setScroller('commissionOverViewScroll', {});
            $scope.initialLoading = true;
            // fetch initial data
            $scope.fetchAgentsData();
        })();

    }
]);
