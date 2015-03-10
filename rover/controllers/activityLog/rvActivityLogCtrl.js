sntRover.controller('RVActivityLogCtrl',[
	'$scope',
	'$rootScope',
	'$filter', 
    'activityLogResponse',
    'activeUserList',
    '$state',
    'RVActivityLogSrv',
	function($scope, $rootScope, $filter, activityLogResponse, activeUserList, $state, RVActivityLogSrv){
	
	BaseCtrl.call(this, $scope);
    
    $scope.businessDate = $rootScope.businessDate;
    // var userName = $rootScope.userName;
    // console.log(businessDate);

    // we are hardcoding the min.width & max.width
    var resizableMinWidth = 30;
    var resizableMaxWidth = 260;


	/**
	* function to go back to reservation details
	*/
	$scope.backToStayCard = function(){
		
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
        //maxDate: tzIndependentDate($rootScope.businessDate),
        yearRange: "-50:+50",
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
       // maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
        onSelect: function(value) {
            $scope.untilDateOptions.minDate = value;
        }
    }, datePickerCommon);
    $scope.untilDateOptions = angular.extend({
       // maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
        onSelect: function(value) {
            $scope.fromDateOptions.maxDate = value;
        }
    }, datePickerCommon);

    $scope.isOldValue = function(value){
        if(value =="" || typeof value == "undefined" || value == null){
            return false;
        }
        else{
            return true;
        }
    }

    $scope.updateReport = function(){
        var callback = function(data) {
                console.log(data);
                $scope.activityLogData = data.results;
                $scope.$emit('hideLoader');
        }
        var params = {};
        params.id=$scope.$parent.reservation.reservation_card.reservation_id;
        params.from_date = $filter('date')($scope.fromDate, 'yyyy-MM-dd');
        params.to_date = $filter('date')($scope.toDate, 'yyyy-MM-dd');
        params.sort_order = $scope.sort_order;
        params.sort_field = $scope.sort_field ;
        console.log(params);
        $scope.invokeApi(RVActivityLogSrv.filterActivityLog, params, callback);
    }

    
    $scope.sortByUserName = function(){
        $scope.sort_field ="USERNAME";
        if($scope.sortOrderOfUser){
            $scope.sortOrderOfUser = false;
            $scope.sort_order="desc";
        }
        else{
            $scope.sortOrderOfUser = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    $scope.sortByDate = function(){
        $scope.sort_field ="DATE";
        if($scope.sortOrderOfDate){
            $scope.sortOrderOfDate = false;
            $scope.sort_order="desc";
        }
        else{
            $scope.sortOrderOfDate = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    $scope.sortByAction = function(){
        $scope.sort_field ="ACTION";
        if($scope.sortOrderOfAction){
            $scope.sortOrderOfAction = false;
            $scope.sort_order="desc";
        }
        else{
            $scope.sortOrderOfAction = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    
    var activeUserAutoCompleteObj = [];
    _.each($scope.activeUserList, function(user) {
        activeUserAutoCompleteObj.push({
            label: user.email,
            value: user.id
        });
    });

    function split(val) {
        return val.split(/,\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }


    var thisReport;
    $scope.returnItem = function(item) {
        thisReport = item;
    };

    var userAutoCompleteCommon = {
        source: function(request, response) {
            // delegate back to autocomplete, but extract the last term
            response($.ui.autocomplete.filter(activeUserAutoCompleteObj, extractLast(request.term)));
        },
        select: function(event, ui) {
            var uiValue = split(this.value);
            uiValue.pop();
            uiValue.push(ui.item.label);
            uiValue.push("");

            this.value = uiValue.join(", ");
            setTimeout(function() {
                $scope.$apply(function() {
                    thisReport.uiChosenUsers = uiValue.join(", ");
                });
            }.bind(this), 100);
            return false;
        },
        close: function(event, ui) {
            var uiValues = split(this.value);
            var modelVal = [];

            _.each(activeUserAutoCompleteObj, function(user) {
                var match = _.find(uiValues, function(email) {
                    return email == user.label;
                });

                if (!!match) {
                    modelVal.push(user.value);
                };
            });

            setTimeout(function() {
                $scope.$apply(function() {
                    thisReport.chosenUsers = modelVal;
                });
            }.bind(this), 100);
        },
        focus: function(event, ui) {
            return false;
        }
    }
    $scope.listUserAutoCompleteOptions = angular.extend({
        position: {
            my: 'left top',
            at: 'left bottom',
            collision: 'flip'
        }
    }, userAutoCompleteCommon);
    $scope.detailsUserAutoCompleteOptions = angular.extend({
        position: {
            my: 'left bottom',
            at: 'right+20 bottom',
            collision: 'flip'
        }
    }, userAutoCompleteCommon);

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
        $scope.activeUserList = activeUserList;

        $scope.sortOrderOfUser = false;
        $scope.sortOrderOfDate = false;
        $scope.sortOrderOfAction = false;

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