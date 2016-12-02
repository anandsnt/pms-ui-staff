angular.module('sntRover')
.controller('rvNightlyDiaryFilterbarSearchController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$filter',
    'ngDialog',
    'RVNightlyDiarySearchSrv',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $filter,
        ngDialog,
        RVNightlyDiarySearchSrv
    ) {
        var vm = this;
        
        // Variable initialisations go inside init function.
        var init = function() {
            $scope.textInQueryBox = '';
            $scope.diaryData.totalSearchResults = 0;
            $scope.diaryData.reservationSearchResults = [];
        };
        var searchFilteringCall = null;

        // Scroller options for search-results view.
        var scrollerOptions = {
            tap: true,
            preventDefault: false,
            deceleration: 0.0001,
            shrinkScrollbars: 'clip'
        };

        // Success callback for search results fetch from service.
        var successCallBackofDataFetch = function(data) {
            $scope.$emit('hideLoader');
            $scope.diaryData.reservationSearchResults = data.results;
            $scope.diaryData.totalSearchResults = data.total_count;
            $scope.diaryData.hasOverlay = true;
            refreshScroller();
        };

        var failureCallBackofDataFetch = function(errorData) {
            $scope.$emit('hideLoader');
            $scope.errorMessage = errorData;
        };

        var initiateSearch = function () {
            var params = {};

            params.query = $scope.textInQueryBox.trim();
            params.from_date = $scope.diaryData.fromDate;
            params.to_date = $scope.diaryData.toDate;
            $scope.invokeApi(RVNightlyDiarySearchSrv.fetchSearchResults, params, successCallBackofDataFetch, failureCallBackofDataFetch);
        };

        var refreshScroller = function() {
            $scope.refreshScroller('reservationSearchResultList');
        };

        BaseCtrl.call(vm, $scope);
        init();

        $scope.setScroller('reservationSearchResultList', scrollerOptions);

        // Get full name of each guest.
        $scope.getGuestName = function(firstName, lastName) {
            return lastName.toUpperCase() + ' ' + firstName.toUpperCase();
        };

        // CSS class for icons corresponding to each reservation status gets returned.
        $scope.getReservationClass = function(reservationStatus) {
            var classes = {
                'CHECKING_IN': 'check-in',
                'PRE_CHECKIN': 'pre-check-in',
                'CANCELED': 'cancel',
                'CHECKEDOUT': 'departed',
                'CHECKING_OUT': 'check-out',
                'CHECKEDIN': 'inhouse',
                'NOSHOW': 'no-show',
                'NOSHOW_CURRENT': 'no-show'
            };

            if (reservationStatus.toUpperCase() in classes) {
                return classes[reservationStatus.toUpperCase()];
            }
            return '';
        };

        // Watches the query text box to get the list of text for highlight.
        $scope.$watch('textInQueryBox', function(newVal) {
            $scope.searchWords = [];
            if (newVal.length >= 2) {
                if (newVal.indexOf(',') !== -1) {
                    $scope.searchWords = newVal.split(',');
                } else if (newVal.indexOf(' ') !== -1) {
                    $scope.searchWords = newVal.split(' ');
                } else {
                    $scope.searchWords.push(newVal);
                }
            }
        });
        // Function that will be called for every character entered into search field.
        $scope.queryEntered = function() {
            var queryText = $scope.textInQueryBox;

            // Setting first letter as captial
            $scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);

            if ($scope.textInQueryBox.length === 0) {
                $scope.clearResults();
                return;
            }
            else if ($scope.textInQueryBox.length >= 3) {
                if (searchFilteringCall !== null) {
                    clearTimeout(searchFilteringCall);
                }
                searchFilteringCall = setTimeout(function() {
                    if ($scope.textInQueryBox.length >= 3) {
                        initiateSearch();
                    }
                }, 800);
            }
        };

        // Function to clear query text as well as results object.
        $scope.clearResults = function() {
            $scope.textInQueryBox = '';
            $scope.diaryData.reservationSearchResults = [];
            $scope.diaryData.totalSearchResults = 0;
            $scope.diaryData.hasOverlay = false;
        };

        // To handle click on each search item.
        $scope.clickedOnResultItem = function( roomId ) {
            $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', roomId);
        };

        // To handle close search results after rendering new data set.
        $scope.$on('CLOSE_SEARCH_RESULT', function() {
            $scope.clearResults();
        });

    }]);