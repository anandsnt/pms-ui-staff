sntRover.controller('RVReservationSettingsCtrl', ['$scope', 'RVReservationBaseSearchSrv', '$state',
    function($scope, RVReservationBaseSearchSrv, $state) {

        $scope.reservationSettingsVisible = false;

        var resizableMinWidth = 30;
        var resizableMaxWidth = 260;
        $scope.reservationSettingsWidth = resizableMinWidth;
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

        $scope.stayDatesClicked = function(){
            var fromState = $state.current.name; 
            if(fromState == 'rover.reservation.staycard.mainCard.roomType'){
                fromState = 'rover.reservation.search';
            }

            $state.go('rover.reservation.staycard.mainCard.roomType', {
                from_date: $scope.reservationData.arrivalDate,
                to_date: $scope.reservationData.departureDate,
                view: "CALENDAR",
                fromState: fromState
            });
        };
    }
]);