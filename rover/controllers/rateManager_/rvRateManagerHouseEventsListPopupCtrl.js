sntRover.controller('rvRateManagerHouseEventsListPopupCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    'rvRateManagerCoreSrv',
    'ngDialog',
    '$filter',
    function($scope, $rootScope, $timeout, rvRateManagerCoreSrv, ngDialog, $filter) {

        BaseCtrl.call(this, $scope);

        var EVENTS_LIST_SCROLLER = 'events-list-scroller';
    
        var setScroller = function () {
                var scrollerOptions = {
                    tap: true,
                    preventDefault: false
                };

                $scope.setScroller(EVENTS_LIST_SCROLLER, scrollerOptions);
            },
            refreshScroller = function () {
                $timeout(() => {
                    $scope.refreshScroller(EVENTS_LIST_SCROLLER);
                }, 100);
            
            },
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
            
                $scope.callAPI(rvRateManagerCoreSrv.fetchHouseEventsByDate, options);
            };
        
    // Close the dialog
        $scope.closeDialog = () => {
            document.activeElement.blur();

            $rootScope.modalClosing = true;
            $timeout(() => {
                ngDialog.close();
                $rootScope.modalClosing = false;
                window.scrollTo(0, 0);
                document.getElementById('rate-manager').scrollTop = 0;
                document.getElementsByClassName('pinnedLeft-list')[0].scrollTop = 0;
                $scope.$apply();
            }, 700);
        };
    
    
        var init = () => {
            $scope.displayDate = $filter('date')(new tzIndependentDate($scope.selectedEventDisplayDate), 'EEEE, dd MMMM yyyy');
            setScroller();
            fetchHouseEventsList();
        };

        init();
    }]);