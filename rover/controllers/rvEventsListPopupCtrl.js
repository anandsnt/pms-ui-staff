sntRover.controller('rvEventsListPopupCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    'rvEventsListSrv',
    'ngDialog',
    '$filter',
    function($scope, $rootScope, $timeout, rvEventsListSrv, ngDialog, $filter) {

        BaseCtrl.call(this, $scope);

        var EVENTS_LIST_SCROLLER = 'events-list-scroller';
        
        // Set scroller for the popup 
        var setScroller = function () {
                var scrollerOptions = {
                    tap: true,
                    preventDefault: false
                };

                $scope.setScroller(EVENTS_LIST_SCROLLER, scrollerOptions);
            },
            // Refresh scroller
            refreshScroller = function () {
                $timeout(() => {
                    $scope.refreshScroller(EVENTS_LIST_SCROLLER);
                }, 100);
            
            },
            // Fetch house events list for the given date
            fetchHouseEventsList = () => {
                var onHouseEventsFetchSuccess = (data) => {
                        $scope.eventsData = data;
                        refreshScroller();
                    },
                    onHouseEventsFetchFailure = () => {
                        $scope.eventsData = [];
                    },
                    options = {
                        onSuccess: onHouseEventsFetchSuccess,
                        onFailure: onHouseEventsFetchFailure,
                        params: {
                            date: $scope.selectedEventDisplayDate
                        }
                    };
            
                $scope.callAPI(rvEventsListSrv.fetchHouseEventsByDate, options);
            };
        
        // Close the dialog
        $scope.closeDialog = () => {
            ngDialog.close();
        };
    
        // Initialize the controller
        var init = () => {
            $scope.displayDate = $filter('date')(new tzIndependentDate($scope.selectedEventDisplayDate), 'EEEE, dd MMMM yyyy');
            setScroller();
            fetchHouseEventsList();
        };

        init();
    }]);