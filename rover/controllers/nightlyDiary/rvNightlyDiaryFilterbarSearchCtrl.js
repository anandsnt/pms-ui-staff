angular.module('sntRover')
.controller('rvNightlyDiaryFilterbarSearchController',
    [   '$scope',
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
        ){

        BaseCtrl.call(this, $scope);
        
        // Variable initialisations go inside init function.
        var init = function(){
            $scope.textInQueryBox = "";
            $scope.totalSearchResults = 0;
            $scope.results = [];
        };

        init();

        // Scroller options for search-results view.
        var scrollerOptions = {
            tap: true,
            preventDefault: false,
            deceleration: 0.0001,
            shrinkScrollbars: 'clip'
        };

        $scope.setScroller('result_showing_area', scrollerOptions);

        var refreshScroller = function() {
            $scope.refreshScroller('result_showing_area');
        };

        // Get full name of each guest.
        $scope.getGuestName = function(firstName, lastName) {
            return lastName.toUpperCase() + " " + firstName.toUpperCase();
        };

        // CSS class for icons corresponding to each reservation status gets returned.
        $scope.getReservationClass = function(reservationStatus) {
            var classes = {
                "CHECKING_IN": 'check-in',
                "PRE_CHECKIN": 'pre-check-in',
                "RESERVED": 'arrival',
                "CANCELED": 'cancel',
                "CHECKED_OUT": 'departed',
                "CHECKING_OUT": 'check-out',
                "CHECKEDIN": 'inhouse',
                "NOSHOW": 'guest-no-show',
                "NOSHOW_CURRENT": 'guest-no-show'
            };
            if (reservationStatus.toUpperCase() in classes) {
                return classes[reservationStatus.toUpperCase()];
            }
        };

        //Watches the query text box to get the list of text for highlight.
        $scope.$watch('textInQueryBox', function(newVal) {
            $scope.searchWords = [];
            if(newVal.length >= 2) {
                if (newVal.indexOf(',') != -1) {
                    $scope.searchWords = newVal.split(',');
                } else if (newVal.indexOf(' ') != -1) {
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
            $scope.totalSearchResults = 0;
        };

        // Success callback for search results fetch from service.
        var successCallBackofDataFetch = function(data) {
            $scope.$emit('hideLoader');
            $scope.results = data.results;
            $scope.totalSearchResults = data.total_count;
            $scope.$parent.myScroll['result_showing_area'].scrollTo(0, 0, 0);
            refreshScroller();
        };

        var failureCallBackofDataFetch = function(error) {
            console.log(error);
        };

        var initiateSearch = function () {
            var params = {};
            params.query = $scope.textInQueryBox.trim();
            $scope.invokeApi(RVNightlyDiarySearchSrv.fetchSearchResults, params, successCallBackofDataFetch, failureCallBackofDataFetch);
        };
}]);