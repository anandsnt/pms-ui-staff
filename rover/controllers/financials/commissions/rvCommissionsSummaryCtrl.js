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
            $scope.isAnyCommisionSelected = false;
            $scope.allCommisionsSelected = false;
            $scope.expandedSubmenuId = -1;
            $scope.selectedAgentIds = [];
            $scope.selectedReservationIds = [];
            _.each($scope.commissionsData.accounts, function(account) {
                account.isSelected = false;
                account.isSemiSelected = false;
            });
        };

        $scope.expandCommision = function(account) {
            account.reservationsData = {};
            account.selectedReservations = [];
            // if already expanded, collapse
            if (account.isExpanded) {
                account.isExpanded = false;
                account.isSemiSelected = false;
            } else {
                account.isExpanded = true;
                account.reservationsData = angular.copy(RVCommissionsSrv.sampleReservationData);
                account.selectedReservations = [];
                _.each(account.reservationsData.reservations, function(reservation) {
                    // if the account is selected, the reservation list 
                    // inside should be selected
                    reservation.isSelected = account.isSelected;
                    var indexOfRes = account.selectedReservations.indexOf(reservation.id);

                    if (reservation.isSelected && indexOfRes === -1) {
                        account.selectedReservations.push(reservation.id);
                    }
                });
                account.reservationsPageNo = 1;
                account.showResPagination = account.reservationsData.total_count > 2;
            }
            refreshArOverviewScroll();
        };

        $scope.areAllBillsSelected = function() {
            if ($scope.commissionsData) {
                return $scope.commissionsData.total_results === $scope.noOfBillsSelected;
            } else {
                return false;
            }
        };

        $scope.areBillsPartialySelected = function() {
            if ($scope.commissionsData && $scope.noOfBillsSelected) {
                return $scope.commissionsData.total_results !== $scope.noOfBillsSelected;
            } else {
                return false;
            }
        };

        $scope.areAnyReservationsPartialySelected = function() {
            if ($scope.commissionsData && $scope.commissionsData.accounts) {
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
            console.log(account.selectedReservations);
            var deleteFromSelectedAccountList = function() {
                var indexOfOpenedAccount = $scope.selectedAgentIds.indexOf($scope.expandedSubmenuId);
                if (indexOfOpenedAccount !== -1) {
                    $scope.selectedAgentIds.splice(indexOfOpenedAccount, 1);
                }
            };

            // set the checked status of the outer account, based on inner checkbox selections
            if (account.selectedReservations.length === 0) {
                // if no items are selected
                account.isSelected = false;
                account.isSemiSelected = false;
                deleteFromSelectedAccountList();
            } else if (account.selectedReservations.length !== account.reservationsData.total_count) {
                // check if only some are selected
                account.isSelected = false;
                account.isSemiSelected = true;
                deleteFromSelectedAccountList();
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
                _.each(account.reservationsData.reservations, function(reservation) {
                    reservation.isSelected = account.isSelected;
                    var indexOfRes = account.selectedReservations.indexOf(reservation.id);

                    if (reservation.isSelected && indexOfRes === -1) {
                        account.selectedReservations.push(reservation.id);
                    } else if (!reservation.isSelected && indexOfRes !== -1) {
                        account.selectedReservations.splice(indexOfRes, 1);
                    }
                });
            }
        };

        // check/ uncheck all commisions dispayed based on the main selection
        $scope.allCommisionsSelectionChanged = function() {
            $scope.selectedAgentIds = [];
            $scope.expandedSubmenuId = -1;
            $scope.selectedReservationIds = [];

            // check/ uncheck all the commisions appearing
            _.each($scope.commissionsData.accounts, function(account) {
                account.isSelected = $scope.allCommisionsSelected;
                account.isExpanded = false;
                account.reservationsData = {};
                account.sele
                account.isSemiSelected = false;
                if (account.isSelected) {
                    $scope.selectedAgentIds.push(account.id);
                }
            });

            if ($scope.allCommisionsSelected) {
                $scope.noOfBillsSelected = $scope.commissionsData.total_results;
                $scope.noOfBillsInOtherPagesSelected = $scope.commissionsData.total_results - $scope.commissionsData.accounts.length;
            } else {
                $scope.noOfBillsSelected = 0;
                $scope.noOfBillsInOtherPagesSelected = 0;
            }
        };

        $scope.setFilterTab = function(selectedTab) {
            $scope.commissionsData = {};
            $scope.filterData.billStatus.value = selectedTab === 'ON_HOLD' ? 'PAID' : 'ALL';
            $scope.searchAccounts();
            $scope.filterData.filterTab = selectedTab;
        };

        /***************** Search starts here *****************/

        var fetchCommissionsData = function(pageNo) {
            $scope.filterData.page = !!pageNo ? pageNo : 1;

            var successCallBack = function(data) {
                $scope.commissionsData = data;
                _.each($scope.commissionsData.accounts, function(account) {
                    account.isExpanded = false;
                });
                $scope.resetSelections();
                $scope.showPagination = ($scope.commissionsData.total_results <= 50) ? false : true;
                $scope.errorMessage = "";
                $scope.$emit('hideLoader');
                refreshArOverviewScroll();
                $timeout(function() {
                    $scope.$broadcast('updatePagination', 'TA_LIST');
                }, 100);
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
            fetchCommissionsData();
        };

        $scope.clearSearchQuery = function() {
            $scope.filterData.searchQuery = '';
            fetchCommissionsData();
        };
        /***************** search ends here *****************************/

        /***************** Pagination starts here ***********************/

        // reservations

        var updateReservationPagination = function(account) {
            var perPage = 2;
            account.startRes = (account.reservationsPageNo == 1) ? 1 : ((account.reservationsPageNo - 1) * perPage) + 1;
            account.endRes = ((account.reservationsPageNo * perPage) >= account.reservationsData.total_count) ? account.reservationsData.total_count : (account.reservationsPageNo * perPage);
        };

        var setFlagBasedOnSelections = function(account) {
            _.each(account.reservationsData.reservations, function(reservation) {
                reservation.isSelected = false;
                // if expanded account is selected ALL, then mark all as checked
                if (account.isSelected) {
                    reservation.isSelected = true;
                } else {
                    // check for selections on other pages
                    _.each(account.selectedReservations, function(id) {
                        if (id === reservation.id) {
                            reservation.isSelected = true;
                        }
                    });
                }
            });
        };

        $scope.loadNextReservationPage = function(account) {
            account.reservationsData = angular.copy(RVCommissionsSrv.sampleNextPageReservationData);
            setFlagBasedOnSelections(account);
            account.reservationsPageNo++;
            updateReservationPagination(account);
        };
        $scope.loadPrevReservationPage = function(account) {
            account.reservationsData = angular.copy(RVCommissionsSrv.sampleReservationData);
            setFlagBasedOnSelections(account);
            account.reservationsPageNo--;
            updateReservationPagination(account);
        };
        $scope.disableReservationNextPage = function(account) {
            if (account.reservationsData && account.reservationsData.reservations) {
                return account.reservationsPageNo >= account.reservationsData.total_count / account.reservationsPageNo;
            } else {
                return false;
            }
        };

        /***************** Pagination ends here *****************/

        /***************** Actions starts here *******************/

        $scope.exportCommisions = function() {
            console.log('export');
            console.log($scope.selectedAgentIds);
            console.log($scope.selectedReservationIds);
        };

        $scope.popupBtnAction = function(action) {

            var params = {};

            params.action = action;
            if ($scope.areAllBillsSelected()) {
                params.update_all_bill = true;
            } else {
                params.selected_agents = [];
                params.partialy_selected_agents = [];
                _.each($scope.selectedAgentIds, function(id) {
                    params.selected_agents.push({
                        'id': id,
                        'update_all': true
                    });
                });

                _.each($scope.commissionsData.accounts, function(account) {
                    if (account.isExpanded && account.selectedReservations.length) {
                        var data = {
                            'id': account.id,
                            'selected_res_ids': account.selectedReservations
                        };
                        params.partialy_selected_agents.push(data);
                    }
                });
            }

            console.log(params);
            console.log(JSON.stringify(params));
            var successCallBack = function() {
                ngDialog.close();
                fetchCommissionsData();
            };
            successCallBack();
        };
        // to do
        $scope.eligibleForPayment = 34;
        $scope.putOnHoldCommisions = function() {
            console.log('putOnHold');

            ngDialog.open({
                template: '/assets/partials/financials/commissions/rvCommisionsHoldPopup.html',
                className: '',
                scope: $scope
            });
        };
        $scope.releaseCommisions = function() {
            console.log('release');
            ngDialog.open({
                template: '/assets/partials/financials/commissions/rvCommisionsReleasePopup.html',
                className: '',
                scope: $scope
            });
        };
        $scope.setRecordsToPaid = function() {
            console.log('setRecordsToPaid');
            ngDialog.open({
                template: '/assets/partials/financials/commissions/rvCommisionsSetAsPaidPopup.html',
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

        var init = function() {
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
            fetchCommissionsData();
            $scope.paginationData = {
                id: 'TA_LIST',
                api: fetchCommissionsData,
                perPage: $scope.filterData.perPage
            };
            $scope.setScroller('commissionOverViewScroll', {});
        };

        init();

    }
]);