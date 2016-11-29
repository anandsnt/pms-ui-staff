angular.module('sntRover')
.controller('rvNightlyDiaryRoomNumberSearchController', 
    [   '$scope',
        '$filter',
        'RVNightlyDiaryRoomNumberSearchSrv',
        function(
            $scope,
            $filter,
            RVNightlyDiaryRoomNumberSearchSrv
        ) {
            var init = function() {
                BaseCtrl.call(this, $scope);
                $scope.diaryData.textInQueryBox = '';
                $scope.diaryData.showSearchResultsArea = false;
                $scope.diaryData.roomNumberSearchResults = [];
                $scope.setScroller('result_showing_area', scrollerOptions);
                refreshScroller();
            };
            // Scroller options for search-results view.
            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                deceleration: 0.0001,
                shrinkScrollbars: 'clip'
            };
            // success callback of fetching search results
            var successCallbackFunction = function(data) {
                $scope.$emit('hideLoader');
                // $scope.diaryData is defined in (parent controller)rvNightlyDiaryController
                $scope.diaryData.roomNumberSearchResults = data.rooms;
                refreshScroller();
            };
            var refreshScroller = function() {
                $scope.refreshScroller('result_showing_area');
            };
            // failure callback of fetching search results
            var failureCallbackFunction = function(error) {
                $scope.errorMessage = error;
            };
            // function to perform filtering on search.     
            var displayFilteredResults = function() {
                var params = {};

                params.query = $scope.diaryData.textInQueryBox.trim();
                $scope.invokeApi(RVNightlyDiaryRoomNumberSearchSrv.fetchRoomSearchResults, params, successCallbackFunction, failureCallbackFunction);
            };

            init();
            // clear query box on clicking close button
            $scope.clearResults = function() {
                $scope.diaryData.textInQueryBox = '';
                $scope.diaryData.showSearchResultsArea = false;
            };

            // function to perform filtering data, on change-event of query box
            $scope.queryEntered = function() {
                if ($scope.diaryData.textInQueryBox === '' || $scope.diaryData.textInQueryBox.length < 2) {
                    $scope.diaryData.showSearchResultsArea = false;
                    $scope.diaryData.roomNumberSearchResults = [];
                }
                else {
                    $scope.diaryData.showSearchResultsArea = true;
                    displayFilteredResults();
                }
            };
            $scope.$on('CLOSE_SEARCH_RESULT', function() {
               $scope.diaryData.showSearchResultsArea = false;
            });
        }]);