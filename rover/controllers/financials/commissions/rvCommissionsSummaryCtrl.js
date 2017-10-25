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

    $scope.resetSelections = function() {
        $scope.noOfBillsSelected = 0;
        $scope.noOfBillsInOtherPagesSelected = 0;
        $scope.isAnyCommisionSelected = false;
        $scope.allCommisionsSelected = false;
        $scope.expandedSubmenuId = -1;
        $scope.selectedAccountIds = [];
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
            $scope.expandedAccount = {};
        } else {
            $scope.expandedSubmenuId = account.id;
            $scope.expandedAccount = account;
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

    $scope.checkAndSetIfAnyCommisionSelected = function() {
        // check if any one of the entity is selected
        var isAnythingSeleced = false
        _.each($scope.commissionsData.accounts, function(account) {
            if (account.isSelected) {
                isAnythingSeleced = true;
            }
        });
        return isAnythingSeleced;
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
            $scope.expandedAccount.isSelected = false;
            $scope.noOfBillsSelected--;
            $scope.allCommisionsSelected = false;
        }
        console.log($scope.selectedReservationIds);

        // set the checked status of the outer account, based on inner checkbox selections
        if ($scope.selectedReservationIds.length === 0) {
            // if no items are selected
            $scope.expandedAccount.isSelected = false;
            $scope.expandedAccount.isSemiSelected = false;
        } else if ($scope.selectedReservationIds.length !== $scope.selectedCommisionReservations.total_count) {
            // check if only some are selected
            $scope.expandedAccount.isSelected = false;
            $scope.expandedAccount.isSemiSelected = true;
        } else if ($scope.selectedReservationIds.length === $scope.selectedCommisionReservations.total_count) {
            // check if ALL reservations are selected
            // if so turn ON corresponding commision and based on other 
            // commisions, turn ON main allCommisionsSelected
            $scope.expandedAccount.isSelected = true;
            $scope.expandedAccount.isSemiSelected = false;
            $scope.noOfBillsSelected++;
            if ($scope.commissionsData.total_results === $scope.selectedAccountIds.length + $scope.noOfBillsInOtherPagesSelected) {
                $scope.allCommisionsSelected = true;
            }
        } else {
            return;
        }
    };

    $scope.commisionSelectionChanged = function(account) {
        account.isSemiSelected = false;
        $scope.selectedAccountIds = [];
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
                $scope.selectedAccountIds.push(account.id);
                console.log($scope.selectedAccountIds);
            }
        });
        // set the checked status of the inner reservations list
        if ($scope.expandedSubmenuId !== -1 && account.id === $scope.expandedSubmenuId) {
            _.each($scope.selectedCommisionReservations.reservations, function(reservation) {
                reservation.isSelected = account.isSelected;
            });
        }
        // based on the count of selected items, turn ON select ALL checkbox
        if (!account.isSelected) {
            $scope.allCommisionsSelected = false;
        } else if ($scope.commissionsData.total_results === $scope.selectedAccountIds.length + $scope.noOfBillsInOtherPagesSelected) {
            $scope.allCommisionsSelected = true;
        }
    };

    // check/ uncheck all commisions dispayed based on the main selection
    $scope.allCommisionsSelectionChanged = function() {
        $scope.selectedAccountIds = [];
        // check/ uncheck all the commisions appearing
        _.each($scope.commissionsData.accounts, function(account) {
            account.isSelected = $scope.allCommisionsSelected;
            if (account.isSelected) {
                $scope.selectedAccountIds.push(account.id);
            }
        });

        if ($scope.allCommisionsSelected) {
            $scope.noOfBillsSelected = $scope.commissionsData.total_results;
            $scope.noOfBillsInOtherPagesSelected = $scope.commissionsData.total_results - $scope.commissionsData.accounts.length;
            $scope.expandedSubmenuId = -1;
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
            if ($scope.expandedAccount.isSelected) {
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
        console.log($scope.selectedAccountIds);
        console.log($scope.selectedReservationIds);
    };
    $scope.putOnHoldCommisions = function() {
        console.log('putOnHold');
        console.log($scope.selectedAccountIds);
        console.log($scope.selectedReservationIds);
    };
    $scope.releaseCommisions = function() {
        console.log('release');
        console.log($scope.selectedAccountIds);
        console.log($scope.selectedReservationIds);
    };
    $scope.setRecordsToPaid = function() {
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
        updateHeader();
        $scope.commissionsData = {};
        $scope.filterData = RVCommissionsSrv.filterData;
        // set intial values
        $scope.noOfBillsSelected = 0;
        // if select ALL is applied, it will update all items in other pages also.
        $scope.noOfBillsInOtherPagesSelected = 0;
        $scope.allCommisionsSelected = false;
        $scope.expandedSubmenuId = -1;
        $scope.selectedAccountIds = [];
        $scope.selectedReservationIds = [];
        // fetch initial data
        fetchCommissionsData();
        $scope.setScroller('commissionOverViewScroll', {});
    };

    init();

}]);