angular.module('sntRover').controller('guestCardSearchController', 
[
  '$scope',
  'RVGuestCardsSrv',
  '$stateParams',
  'ngDialog',
  '$timeout',
  '$state',
  '$filter',  
   function($scope, RVGuestCardsSrv, $stateParams, ngDialog, $timeout, $state, $filter) {

        BaseCtrl.call(this, $scope);

        var GUEST_CARD_SCROLL = "guest_card_scroll",
            DEBOUNCE_SEARCH_DELAY = 600, // // Delay the function execution by this much ms
            GUEST_CARD_SEARCH_PAGINATION_ID = "guest_card_search";        
        
        // Refresh the guest card search scroller
        var refreshScroller = function() {
            if ( $scope.myScroll && $scope.myScroll.hasOwnProperty(GUEST_CARD_SCROLL) ) {
                $scope.myScroll[GUEST_CARD_SCROLL].scrollTo(0, 0, 100);
            }

            $timeout(function() {
                $scope.refreshScroller(GUEST_CARD_SCROLL);
            }, 300);
        };

        /**
         * Make the search string highlighted
         * @param {string} query string
         * @return {undefined}
         */
        var setHighlightedQueryText = function (newVal) {
            $scope.searchWords = [];
            
            if (newVal.indexOf(',') !== -1) {
                $scope.searchWords = newVal.split(',');
            } else if (newVal.indexOf(' ') !== -1) {
                $scope.searchWords = newVal.split(' ');
            } else {
                $scope.searchWords.push(newVal);
            }            
        };

        /**
         * Filtering/request data from service in change event of query box
         */
        $scope.queryEntered = _.debounce(function() {
            if ($scope.textInQueryBox === "") {
                $scope.guestSearch.results = []; 
                $scope.$apply();                               
            } else {
                displayFilteredResults();
            }
            var queryText = $scope.textInQueryBox;
            
            $scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
            setHighlightedQueryText($scope.textInQueryBox);
        }, DEBOUNCE_SEARCH_DELAY);

        // Clear search results
        $scope.clearResults = function() {
            $scope.textInQueryBox = "";
            $scope.guestSearch.results = [];
        };
        
        /**
         * Function which get invoked on success
         * @param {Object} data response data
         * @return {undefined}
         */
        var onSearchSuccess = function (data) {
                $scope.guestSearch.results = data.results;
                $scope.totalResultCount = data.total_count;             

                setTimeout(function() {
                    $scope.$broadcast('updatePagination', GUEST_CARD_SEARCH_PAGINATION_ID );
                    refreshScroller();
                }, 500);
            },
            onSearchFailure = function () {
                $scope.guestSearch.results = [];
            },
            getRequestParams = function (pageNo) {
                var params = {
                    query: $scope.textInQueryBox.trim(),
                    per_page: RVGuestCardsSrv.PER_PAGE_COUNT,
                    page: pageNo || 1
                };

                return params;
            };

        // Perform guest card search for the given params
        $scope.search = function (pageNo) {  
            var options = {
                params: getRequestParams(pageNo),
                successCallBack: onSearchSuccess,
                failureCallBack: onSearchFailure
            };

            $scope.callAPI(RVGuestCardsSrv.fetchGuests, options);
        };        

        /**
         * function to perform filering on results.
         * if not fouund in the data, it will request for webservice
         */
        var displayFilteredResults = function() {
            if (!$scope.textInQueryBox.length) {
                 $scope.guestSearch.results = [];
                // we have changed data, so we are refreshing the scrollerbar
                refreshScroller();
            } else {
                $scope.search();                
            }
        };

        // Click on add new btn navigates to an empty guest card page
        $scope.addNewCard = function() {
            $state.go('rover.guest.details');
        }; 

        /**
         * Get guest name
         * @param {string} firstName
         * @param {string} lastName
         * @return {string} full name
         *
         */
        $scope.getGuestName = function(firstName, lastName) {           
            return lastName + ", " + firstName;
        };

        // Set title and heading
        var setTitleAndHeading = function () {
            var title = $filter('translate')('FIND_GUESTS'); 
            
            $scope.heading = title;
            $scope.setTitle (title);            
        };
        
        // Initialize the controller variables
        var init = function () {
            setTitleAndHeading();
            // model used in query textbox, we will be using this across
            $scope.textInQueryBox = "";
            $scope.$emit("updateRoverLeftMenu", "guests");
            $scope.guestSearch = {
                results: []
            };
            $scope.totalResultCount = 0;

            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                deceleration: 0.0001,
                shrinkScrollbars: 'clip'
            };

            $scope.setScroller(GUEST_CARD_SCROLL, scrollerOptions);

            $scope.guestCardPagination = {
                id: GUEST_CARD_SEARCH_PAGINATION_ID,
                perPage: 50,
                api: $scope.search
            };

            // While coming back to search screen from DISCARD button
            if ($stateParams.textInQueryBox) {
                $scope.textInQueryBox = $stateParams.textInQueryBox;
                $scope.queryEntered();
            }
        };

        // Checks whether search results should be shown or not
        $scope.shouldHideSearchResults = function () {
            return $scope.guestSearch.results.length === 0 || $scope.textInQueryBox === "";
        }; 

        // Checks whether the pagination directive should be shown or not
        $scope.shouldHidePagination = function () {
            return ( ($scope.totalResultCount < $scope.guestCardPagination.perPage) && $scope.guestSearch.results.length > 0);
        };      

        init();
    }
]);
