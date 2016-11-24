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
            $scope.results = [];
        };

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
            $scope.results = data.results;
            $scope.diaryData.totalSearchResults = data.total_count;
            $scope.$parent.myScroll['result_showing_area'].scrollTo(0, 0, 0);
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
            params.fromDate = $scope.diaryData.fromDate;
            params.toDate = $scope.diaryData.toDate;
            $scope.invokeApi(RVNightlyDiarySearchSrv.fetchSearchResults, params, successCallBackofDataFetch, failureCallBackofDataFetch);
        };

        var refreshScroller = function() {
            $scope.refreshScroller('result_showing_area');
        };

        BaseCtrl.call(vm, $scope);
        init();

        $scope.setScroller('result_showing_area', scrollerOptions);

        // Get full name of each guest.
        $scope.getGuestName = function(firstName, lastName) {
            return lastName.toUpperCase() + ' ' + firstName.toUpperCase();
        };

        // CSS class for icons corresponding to each reservation status gets returned.
        $scope.getReservationClass = function(reservationStatus) {
            var classes = {
                'CHECKING_IN': 'check-in',
                'PRE_CHECKIN': 'pre-check-in',
                'RESERVED': 'arrival',
                'CANCELED': 'cancel',
                'CHECKED_OUT': 'departed',
                'CHECKING_OUT': 'check-out',
                'CHECKEDIN': 'inhouse',
                'NOSHOW': 'guest-no-show',
                'NOSHOW_CURRENT': 'guest-no-show'
            };

            if (reservationStatus.toUpperCase() in classes) {
                return classes[reservationStatus.toUpperCase()];
            }
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
                initiateSearch();
            }
        };

        // Function to clear query text as well as results object.
        $scope.clearResults = function() {
            $scope.textInQueryBox = '';
            $scope.results = [];
            $scope.diaryData.totalSearchResults = 0;
            $scope.diaryData.hasOverlay = false;
        };

    }]);