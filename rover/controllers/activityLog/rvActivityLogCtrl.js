sntRover.controller('RVActivityLogCtrl',[
	'$scope',
	'$rootScope',
	'$filter', 
    'activityLogResponse',
    '$state',
	function($scope, $rootScope, $filter, activityLogResponse, $state){
	
	BaseCtrl.call(this, $scope);
    console.log("RVActivityLogCtrllllllllll");
    console.log($rootScope);
    // var businessDate = $rootScope.businessDate;
    // var userName = $rootScope.userName;
    // console.log(businessDate);

    // we are hardcoding the min.width & max.width
    var resizableMinWidth = 30;
    var resizableMaxWidth = 260;


	/**
	* function to go back to reservation details
	*/
	$scope.backToStayCard = function(){
		
        console.log($scope.$parent.reservation.reservation_card.reservation_id);
        console.log($scope.$parent.reservation.reservation_card.confirmation_num);
		$state.go("rover.reservation.staycard.reservationcard.reservationdetails", 
            {
                id:$scope.$parent.reservation.reservation_card.reservation_id, 
                confirmationId:$scope.$parent.reservation.reservation_card.confirmation_num,
                isRefresh:true
            });
		
	};

	$scope.clickedOnReportUpdate = function($event) {
        if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-e")[0])) {
            if ($scope.reportUpdateVisible) {
                $scope.reportUpdateWidth = resizableMinWidth;
                $scope.reportUpdateVisible = false;
            } else {
                $scope.reportUpdateVisible = true;
                $scope.reportUpdateWidth = resizableMaxWidth;
            }
        }
    };

    $scope.$on('closeSidebar', function() {
        $scope.reportUpdateWidth = resizableMinWidth;
        $scope.reportUpdateVisible = false;
    });

    var datePickerCommon = {
        dateFormat: $rootScope.jqDateFormat,
        numberOfMonths: 1,
        changeYear: true,
        changeMonth: true,
        beforeShow: function(input, inst) {
            $('#ui-datepicker-div');
            $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
        },
        onClose: function(value) {
            $('#ui-datepicker-div');
            $('#ui-datepicker-overlay').remove();
        }
    };

    $scope.fromDateOptions = angular.extend({
        maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
        onSelect: function(value) {
            $scope.untilDateOptions.minDate = value;
        }
    }, datePickerCommon);
    $scope.untilDateOptions = angular.extend({
        maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
        onSelect: function(value) {
            $scope.fromDateOptions.maxDate = value;
        }
    }, datePickerCommon);

    $scope.isOldValue = function(value){
        if(value==="")
            return false;
        else
            return true;
    }

    /*
    * function to refresh scroller
    * will refresh left filter scroller
    */
    var refreshScroller = function() {
        $scope.refreshScroller ('report-update');
    };


	$scope.init = function(){
        //setting the header caption
		$scope.$emit('HeaderChanged', $filter('translate')('ACTIVITY_LOG_TITLE'));
        
        $scope.errorMessage = '';

        $scope.reportUpdateVisible = false;

        $scope.reportUpdateWidth = resizableMinWidth;

        $scope.activityLogData = activityLogResponse.results;



        // set a back button on header
        $rootScope.setPrevState = {
            title: $filter('translate')('STAY_CARD'),
            callback: 'backToStayCard',
            scope: $scope
        };        
        
        //setting title        
        var title = $filter('translate')('ACTIVITY_LOG_TITLE');
        $scope.setTitle(title);

        //left side filter scrollbar
        $scope.setScroller('report-update');        
        
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

        //accordion options, will add/remove class on toggling
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
                refreshScroller();
            }

        };        
	};
	$scope.init();

}]);