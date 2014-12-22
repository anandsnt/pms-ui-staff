sntRover.controller('RVReservationSettingsCtrl', ['$scope', 'RVReservationBaseSearchSrv', '$state', '$stateParams',
    function($scope, RVReservationBaseSearchSrv, $state, $stateParams) {
        $scope.reservationSettingsVisible = false;

        var resizableMinWidth = 30;
        var resizableMaxWidth = 260;
        $scope.reservationSettingsWidth = resizableMinWidth;
        $scope.isHourly = ( $stateParams.reservation == 'HOURLY' ) ? true : false;
        /**
         * scroller options
         */
        $scope.resizableOptions = {
            minWidth: resizableMinWidth,
            maxWidth: resizableMaxWidth,
            handles: 'e',
            resize: function(event, ui) {

            },
            stop: function(event, ui) {
                preventClicking = true;
                $scope.eventTimestamp = event.timeStamp;
            }
        }

        //scroller options
        $scope.$parent.myScrollOptions = {
            'reservation-settings': {
                snap: false,
                scrollbars: true,
                vScroll: true,
                vScrollbar: true,
                hideScrollbar: false,
                click: true,
                bounce: false,
                scrollbars: 'custom'
            }
        };

        $scope.refreshScroll = function(){
            $scope.$parent.myScroll['reservation-settings'].refresh();
        };

        $scope.accordionInitiallyNotCollapsedOptions = {
            header: 'a.toggle',
            heightStyle: 'content',
            collapsible: true,
            activate: function(event, ui) {
                if (isEmpty(ui.newHeader) && isEmpty(ui.newPanel)) { //means accordion was previously collapsed, activating..
                    ui.oldHeader.removeClass('active');
                } else if (isEmpty(ui.oldHeader)) { //means activating..
                    ui.newHeader.addClass('active');
                }
                $scope.$parent.myScroll['reservation-settings'].refresh();
            }

        };

        $scope.accordionInitiallyCollapsedOptions = {
            header: 'a.toggle',
            collapsible: true,
            heightStyle: 'content',
            active: false,
            activate: function(event, ui) {
                if (isEmpty(ui.newHeader) && isEmpty(ui.newPanel)) { //means accordion was previously collapsed, activating..
                    ui.oldHeader.removeClass('active');
                } else if (isEmpty(ui.oldHeader)) { //means activating..
                    ui.newHeader.addClass('active');
                }
                $scope.$parent.myScroll['reservation-settings'].refresh();
            }

        };

        /**
         * function to execute click on Guest card
         */
        $scope.clickedOnReservationSettings = function($event) {
            if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-e")[0])) {
                if ($scope.reservationSettingsVisible) {
                    $scope.reservationSettingsWidth = resizableMinWidth;
                    $scope.reservationSettingsVisible = false;
                } else {
                    $scope.reservationSettingsVisible = true;
                    $scope.reservationSettingsWidth = resizableMaxWidth;
                }
            }
        };
        
        $scope.$on('closeSidebar', function(){
            $scope.reservationSettingsWidth = resizableMinWidth;
            $scope.reservationSettingsVisible = false;
        });

        $scope.$on('GETREFRESHACCORDIAN', function() { 
            setTimeout($scope.refreshScroll, 3000);
        });
    }
]);