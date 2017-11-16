sntRover.controller('RVCommissionsSummaryController', ['$scope',
    '$rootScope',
    '$stateParams',
    '$filter',
    'RVCommissionsSrv',
    '$timeout',
    '$window',
    '$state',
    'ngDialog',
    function($scope, $rootScope, $stateParams, $filter, RVCommissionsSrv, $timeout, $window, $state, ngDialog) {

        BaseCtrl.call(this, $scope);

        var updateHeader = function() {
            // Setting up the screen heading and browser title.
            $scope.$emit('HeaderChanged', $filter('translate')('MENU_COMMISIONS'));
            $scope.setTitle($filter('translate')('MENU_COMMISSIONS'));
            $scope.$emit("updateRoverLeftMenu", "commisions");
        };

        var refreshArOverviewScroll = function() {
            $timeout(function() {
                $scope.refreshScroller('commissionOverViewScroll');
            }, 500);
        };

        $scope.resetSelections = function() {
            $scope.noOfBillsSelected = 0;
            $scope.noOfBillsInOtherPagesSelected = 0;
            $scope.allCommisionsSelected = false;
            $scope.selectedAgentIds = [];
            _.each($scope.commissionsData.accounts, function(account) {
                account.isSelected = false;
                account.isSemiSelected = false;
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
        };

        // based on selections, the top menu changes.
        // check if all agents are selected
        $scope.areAllAgentsSelected = function() {
            return $scope.commissionsData.total_count > 0 && $scope.commissionsData.total_count === $scope.noOfBillsSelected;
        };

        // check if any one of the agents is selected
        $scope.areAgentsPartialySelected = function() {
            return $scope.noOfBillsSelected > 0 && $scope.commissionsData.total_count !== $scope.noOfBillsSelected;
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
            } else {
                return false;
            }
        };

        // based on the change in reservation selection, the corresponding 
        // agent and all agent selected/ semi selected flag need to be set.
        $scope.reservationSelectionChanged = function(account, reservation) {
            // if selected, add to the array
            var selectedIndex = account.selectedReservations.indexOf(reservation.id);

            // is checked and was not added before
            if (reservation.isSelected && selectedIndex === -1) {
                account.selectedReservations.push(reservation.id);
            } else if (!reservation.isSelected && selectedIndex !== -1) {
                // was unchecked and was added before --> remove the item from array
                account.selectedReservations.splice(selectedIndex, 1);
                if (account.isSelected) {
                    $scope.noOfBillsSelected--;
                }
                if (account.selectedReservations.length > 0) {
                    account.isSemiSelected = true;
                }
                account.isSelected = false;
            }
            var deleteFromSelectedAgentList = function() {
                var indexOfOpenedAccount = $scope.selectedAgentIds.indexOf(account.id);
                if (indexOfOpenedAccount !== -1) {
                    $scope.selectedAgentIds.splice(indexOfOpenedAccount, 1);
                }
            };

            // set the checked status of the outer account, based on inner checkbox selections
            if (account.selectedReservations.length === 0) {
                // if no items are selected
                account.isSelected = false;
                account.isSemiSelected = false;
                deleteFromSelectedAgentList();
            } else if (account.selectedReservations.length !== account.reservationsData.total_count) {
                // check if only some are selected
                account.isSelected = false;
                account.isSemiSelected = true;
                deleteFromSelectedAgentList();
            } else if (account.selectedReservations.length === account.reservationsData.total_count) {
                // check if ALL reservations are selected
                // if so turn ON corresponding commision and based on other 
                // commisions, turn ON main allCommisionsSelected
                account.isSelected = true;
                account.isSemiSelected = false;
                if ($scope.selectedAgentIds.indexOf(account.id) === -1) {
                    $scope.selectedAgentIds.push($scope.expandedSubmenuId);
                }
                $scope.noOfBillsSelected++;
            } else {
                return;
            }
        };

        // based on the commision selection, set the no of bills.
        $scope.commisionSelectionChanged = function(account) {
            account.isSemiSelected = false;
            $scope.selectedAgentIds = [];
            // based on selection, update no of bills
            if (account.isSelected) {
                $scope.noOfBillsSelected++;
            } else if ($scope.noOfBillsSelected > 0) {
                $scope.noOfBillsSelected--;
            } else {
                $scope.noOfBillsSelected = 0;
            }
            // check if any one of the entity is selected
            _.each($scope.commissionsData.accounts, function(account) {
                if (account.isSelected) {
                    $scope.selectedAgentIds.push(account.id);
                    console.log($scope.selectedAgentIds);
                }
            });
            // set the checked status of the inner reservations list
            if (account.isExpanded) {
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
            }
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
                $scope.noOfBillsSelected = $scope.commissionsData.total_count;
                $scope.noOfBillsInOtherPagesSelected = $scope.commissionsData.total_count - $scope.commissionsData.accounts.length;
            } else {
                $scope.noOfBillsSelected = 0;
                $scope.noOfBillsInOtherPagesSelected = 0;
            }
        };

        // main tab switch - On Hold and To pay
        $scope.setFilterTab = function(selectedTab) {
            $scope.commissionsData = {};
            $scope.filterData.billStatus.value = selectedTab === 'ON_HOLD' ? 'ON_HOLD' : 'UN_PAID';
            $scope.searchAccounts();
            $scope.filterData.filterTab = selectedTab;
        };

        /***************** Search starts here *****************/

        var fetchAgentsData = function(pageNo) {
            $scope.filterData.page = !!pageNo ? pageNo : 1;
            var successCallBack = function(data) {
                $scope.commissionsData = data;
                _.each($scope.commissionsData.accounts, function(account) {
                    account.isExpanded = false;
                    account.fetchReservationData = function(pageNo) {
                        var page = !!pageNo ? pageNo : 1;

                        var onFetchListSuccess = function(response) {
                            console.log(response);
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
                        $scope.callAPI(RVCommissionsSrv.fetchReservationOfCommissions, {
                            params: {
                                id: account.id,
                                'page': page,
                                'per_page': $scope.filterData.innerPerPage
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
                $scope.resetSelections();
                $scope.showPagination = ($scope.commissionsData.total_count <= $scope.filterData.perPage) ? false : true;
                $scope.errorMessage = "";
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
            fetchAgentsData();
        };

        $scope.clearSearchQuery = function() {
            $scope.filterData.searchQuery = '';
            fetchAgentsData();
        };
        /***************** search ends here *****************************/

        /***************** Actions starts here *******************/

        var generateParams = function(){
           var params = {};
            params.no_of_bills_selected = $scope.noOfBillsSelected;

            if ($scope.areAllAgentsSelected()) {
                params.update_all_bill = true;
            } else {
                params.partialy_selected_agents = [];
                // if only items in the existing page are selected
                if (params.no_of_bills_selected <= $scope.filterData.perPage) {
                    params.selected_agents = [];
                    _.each($scope.selectedAgentIds, function(id) {
                        params.selected_agents.push({
                            'id': id,
                            'update_all': true
                        });
                    });
                } else {
                    // when more than per page items are selected and
                    // some of the current page items are unchecked
                    params.un_selected_agents = [];
                    _.each($scope.commissionsData.accounts, function(account) {
                        if (!account.isSelected) {
                            params.un_selected_agents.push(account.id);
                        }
                    });
                }
                _.each($scope.commissionsData.accounts, function(account) {
                    if (account.isExpanded && account.selectedReservations.length && account.selectedReservations.length !== account.reservationsData.total_count) {
                        var data = {
                            'id': account.id,
                            'selected_res_ids': account.selectedReservations
                        };
                        params.partialy_selected_agents.push(data);
                    }
                });

                if (!params.partialy_selected_agents.length) {
                    delete params.partialy_selected_agents;
                }
            }
            console.log(JSON.stringify(params));
            return params;
        };

        var setExportStatus = function(inProgress, failed, success) {
            $scope.exportSuccess = success;
            $scope.exportFailed = failed;
            $scope.exportInProgess = inProgress;
        };

        $scope.exportCommisions = function() {

            var options = {
                params: generateParams(),
                successCallBack: function(response){
                    // for now we will only show in progress status and then dismiss the
                    // popup
                    $timeout(function(){
                        setExportStatus(false, false, true);
                        ngDialog.close();
                    },5000);
                },
                failureCallBack: function(err){
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
            params = generateParams();
            params.action = action;
            var successCallBack = function() {
                ngDialog.close();
                fetchAgentsData();
            };
            successCallBack();
        };

        $scope.openPopupWithTemplate = function(template) {
            if ($scope.filterData.filterTab === 'PAYABLE') {
                if ($scope.areAllAgentsSelected()) {
                    $scope.eligibleForPayment = $scope.commissionsData.amount_totals.unpaid;
                } else {
                    var amountOwing;

                    // if only items in the existing page are selected
                    if ($scope.noOfBillsSelected <= $scope.filterData.perPage) {
                        amountOwing = 0;
                        _.each($scope.commissionsData.accounts, function(account) {
                            _.each($scope.selectedAgentIds, function(id) {
                                if (id === account.id) {
                                    amountOwing = amountOwing + parseInt(account.amount_owing);
                                }
                            });
                        });

                    } else {
                        // when more than per page items are selected and
                        // some of the current page items are unchecked
                        // subtract unselected amount from total
                        amountOwing = parseInt($scope.commissionsData.amount_totals.unpaid);
                        _.each($scope.commissionsData.accounts, function(account) {
                            if (!account.isSelected) {
                                amountOwing = amountOwing - parseInt(account.amount_owing);
                            }
                        });
                    }
                    $scope.eligibleForPayment = amountOwing;
                }
            }

            
            ngDialog.open({
                template: '/assets/partials/financials/commissions/' + template + '.html',
                className: '',
                scope: $scope
            });
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

        (function() {
            updateHeader();
            $scope.commissionsData = {};
            $scope.filterData = RVCommissionsSrv.filterData;
            // set intial values
            $scope.noOfBillsSelected = 0;
            // if select ALL is applied, it will update all items in other pages also.
            $scope.noOfBillsInOtherPagesSelected = 0;
            $scope.allCommisionsSelected = false;
            $scope.selectedAgentIds = [];
            $scope.pageNo = 1;
            // fetch initial data
            fetchAgentsData();
            $scope.paginationData = {
                id: 'TA_LIST',
                api: fetchAgentsData,
                perPage: $scope.filterData.perPage
            };
            $scope.setScroller('commissionOverViewScroll', {});
            $scope.initialLoading = true;
        })();

    }
]);