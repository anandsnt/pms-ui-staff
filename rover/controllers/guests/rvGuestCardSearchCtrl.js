angular.module('sntRover').controller('guestCardSearchController', 
[
  '$scope',
  'RVGuestCardsSrv',
  '$stateParams',
  'ngDialog',
  '$timeout',
  '$state',
   function($scope, RVGuestCardsSrv, $stateParams, ngDialog, $timeout, $state) {

        BaseCtrl.call(this, $scope);

        var GUEST_CARD_SCROLL = "guest_card_scroll",
            debounceSearchDelay = 600, // // Delay the function execution by this much ms
            GUEST_CARD_SEARCH_PAGINATION_ID = "guest_card_search";
        
        
        // Refresh the guest card search scroller
        var refreshScroller = function() {
            $timeout(function() {
                $scope.refreshScroller(GUEST_CARD_SCROLL);
            }, 300);
        };

        /**
         * Filtering/request data from service in change event of query box
         */
        $scope.queryEntered = _.debounce(function() {
            if ($scope.textInQueryBox === "") {
                $scope.results = [];
            } else {
                displayFilteredResults();
            }
            var queryText = $scope.textInQueryBox;
            
            $scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
        }, debounceSearchDelay);

        // Clear search results
        $scope.clearResults = function() {
            $scope.textInQueryBox = "";
            $scope.results = [];
        };
        
        var onSearchSuccess = function (data) {
                $scope.results = data.results;
                $scope.totalResultCount = data.total_count;             

                setTimeout(function() {
                    $scope.$broadcast('updatePagination', GUEST_CARD_SEARCH_PAGINATION_ID );
                    refreshScroller();
                }, 500);
            },
            onSearchFailure = function () {
                $scope.results = [];
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
                 $scope.results = [];
                // we have changed data, so we are refreshing the scrollerbar
                refreshScroller();
            } else {
                $scope.search();                
            }
        };

        // Click on add new btn navigates to an empty guest card page
        $scope.addNewCard = function() {
            $state.go('rover.guestcarddetails');
        };
        

        $scope.getGuestName = function(firstName, lastName) {           
            return lastName + ", " + firstName;
        };

        /**
         * Watches the query text box to get the list of text for highlight
        */
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

        // Initialize the controller variables
        var init = function () {
            $scope.heading = "Find Guests";
            // model used in query textbox, we will be using this across
            $scope.textInQueryBox = "";
            $scope.$emit("updateRoverLeftMenu", "guests");
            $scope.results = [];

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
        

        init();
    }
]);
