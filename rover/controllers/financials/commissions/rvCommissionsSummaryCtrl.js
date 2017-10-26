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

        $scope.resetExpandedView = function() {
            $scope.expandedSubmenuId = -1;
        };

        $scope.expandCommision = function(account) {

            $scope.selectedReservationIds = [];
            // if already expanded, collapse
            if ($scope.expandedSubmenuId === account.id) {
                $scope.expandedSubmenuId = -1;
                $scope.expandedAgent = {};
            } else {
                $scope.expandedSubmenuId = account.id;
                $scope.expandedAgent = account;
                $scope.selectedCommisionReservations = RVCommissionsSrv.sampleReservationData;
                _.each($scope.selectedCommisionReservations.reservations, function(reservation) {
                    // if the account is selected, the reservation list 
                    // inside should be selected
                    reservation.isSelected = account.isSelected;
                    if (reservation.isSelected) {
                        $scope.selectedReservationIds.push(reservation.id);
                    }
                });
                $scope.reservationsPageNo = 1;
                $scope.showResPagination = ($scope.selectedCommisionReservations.total_count <= 2) ? false : true;
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
            if ($scope.expandedSubmenuId === -1) {
                return false
            } else {
                return $scope.expandedAgent.isSelected || $scope.expandedAgent.isSemiSelected;
            }
        };

        $scope.reservationSelectionChanged = function(reservation) {
            // if selected, add to the array
            var selectedIndex = $scope.selectedReservationIds.indexOf(reservation.id);

            // is checked and was not added before
            if (reservation.isSelected && selectedIndex === -1) {
                $scope.selectedReservationIds.push(reservation.id);
            } else if (!reservation.isSelected && selectedIndex !== -1) {
                // was unchecked and was added before --> remove the item from array
                $scope.selectedReservationIds.splice(selectedIndex, 1);
                if ($scope.expandedAgent.isSelected) {
                    $scope.noOfBillsSelected--;
                }
                if ($scope.selectedReservationIds.length > 0) {
                    $scope.expandedAgent.isSemiSelected = true;
                }
                $scope.expandedAgent.isSelected = false;
            }
            console.log($scope.selectedReservationIds);
            var deleteFromSelectedAccountList = function() {
                var indexOfOpenedAccount = $scope.selectedAgentIds.indexOf($scope.expandedSubmenuId);
                if (indexOfOpenedAccount !== -1) {
                    $scope.selectedAgentIds.splice(indexOfOpenedAccount, 1);
                }
            };

            // set the checked status of the outer account, based on inner checkbox selections
            if ($scope.selectedReservationIds.length === 0) {
                // if no items are selected
                $scope.expandedAgent.isSelected = false;
                $scope.expandedAgent.isSemiSelected = false;
                deleteFromSelectedAccountList();
            } else if ($scope.selectedReservationIds.length !== $scope.selectedCommisionReservations.total_count) {
                // check if only some are selected
                $scope.expandedAgent.isSelected = false;
                $scope.expandedAgent.isSemiSelected = true;
                deleteFromSelectedAccountList();
            } else if ($scope.selectedReservationIds.length === $scope.selectedCommisionReservations.total_count) {
                // check if ALL reservations are selected
                // if so turn ON corresponding commision and based on other 
                // commisions, turn ON main allCommisionsSelected
                $scope.expandedAgent.isSelected = true;
                $scope.expandedAgent.isSemiSelected = false;
                if($scope.selectedAgentIds.indexOf($scope.expandedSubmenuId) !== -1){
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
            if ($scope.expandedSubmenuId !== -1 && account.id === $scope.expandedSubmenuId) {
                $scope.selectedReservationIds = [];
                _.each($scope.selectedCommisionReservations.reservations, function(reservation) {
                    reservation.isSelected = account.isSelected;
                    if (reservation.isSelected) {
                        $scope.selectedReservationIds.push(reservation.id);
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

        var updateReservationPagination = function() {
            var perPage = 2;
            $scope.startRes = ($scope.reservationsPageNo == 1) ? 1 : (($scope.reservationsPageNo - 1) * perPage) + 1;
            $scope.endRes = (($scope.reservationsPageNo * perPage) >= $scope.selectedCommisionReservations.total_count) ? $scope.selectedCommisionReservations.total_count : ($scope.reservationsPageNo * perPage);
        };

        var setFlagBasedOnSelections = function() {
            _.each($scope.selectedCommisionReservations.reservations, function(reservation) {
                reservation.isSelected = false;
                // if expanded account is selected ALL, then mark all as checked
                if ($scope.expandedAgent.isSelected) {
                    reservation.isSelected = true;
                } else {
                    // check for selections on other pages
                    _.each($scope.selectedReservationIds, function(id) {
                        if (id == reservation.id) {
                            reservation.isSelected = true;
                        }
                    });
                }
            });
        };

        $scope.loadNextReservationPage = function() {
            $scope.selectedCommisionReservations = RVCommissionsSrv.sampleNextPageReservationData;
            setFlagBasedOnSelections();
            $scope.reservationsPageNo++;
            updateReservationPagination();
        };
        $scope.loadPrevReservationPage = function() {
            $scope.selectedCommisionReservations = RVCommissionsSrv.sampleReservationData;
            setFlagBasedOnSelections();
            $scope.reservationsPageNo--;
            updateReservationPagination();
        };
        $scope.disableReservationNextPage = function() {
            if ($scope.selectedCommisionReservations) {
                return $scope.reservationsPageNo >= $scope.selectedCommisionReservations.total_count / $scope.reservationsPageNo;
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
                _.each($scope.selectedAgentIds, function(id) {
                    params.selected_agents.push({
                        'id': id,
                        'update_all': true
                    });
                });
                if ($scope.expandedAgent && $scope.expandedAgent.isSemiSelected) {
                    var data = {
                        'id': $scope.expandedSubmenuId,
                        'update_all': false,
                        'selected_res_ids': $scope.selectedReservationIds
                    };
                    params.selected_agents.push(data);
                }
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
            $scope.expandedSubmenuId = -1;
            $scope.selectedAgentIds = [];
            $scope.selectedReservationIds = [];
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