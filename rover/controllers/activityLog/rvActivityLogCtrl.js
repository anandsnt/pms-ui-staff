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

    /**
     * Event propogated by ngrepeatend directive
     * we used to hide activity indicator & refresh scroller
     */
    $scope.$on('NG_REPEAT_COMPLETED_RENDERING', function(event) {
        setTimeout(function() {
            $scope.refreshScroller('report_content');
        }, 100);
    });

    /*
    * SideBar
    */
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

    var setDatePickerOptions = function(){
        //I just changed this to a function, dont knw who written this
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
    };
    
    $scope.isOldValue = function(value){
        if(value =="" || typeof value == "undefined" || value == null){
            return false;
        }
        else{
            return true;
        }
    }
    $scope.updateReportFilter = function(){
        $scope.isUpdateReportFilter = true;
        $scope.initPaginationParams();
        $scope.initSort();
        $scope.updateReport();
    }

    $scope.updateReport = function(){
        var callback = function(data) {
                $scope.totalResults = data.total_count;
                $scope.activityLogData = data.results;
                if ($scope.nextAction) {
                    $scope.start = $scope.start + $scope.perPage;
                    $scope.nextAction = false;
                    $scope.initSort();
                }
                if ($scope.prevAction) {
                    $scope.start = $scope.start - $scope.perPage;
                    $scope.prevAction = false;
                    $scope.initSort();
                }
                $scope.end = $scope.start + $scope.activityLogData.length - 1;
                $scope.$emit('hideLoader');
        }
        var params = {
                id: $scope.$parent.reservation.reservation_card.reservation_id,
                page: $scope.page,
                per_page: $scope.perPage
        };
        if($scope.isUpdateReportFilter){
            params['from_date'] = $filter('date')($scope.fromDate, 'yyyy-MM-dd');
            params['to_date'] =$filter('date')($scope.toDate, 'yyyy-MM-dd');
            if($scope.user_id)
                params['user_id'] = $scope.user_id;
        }
        params['sort_order'] = $scope.sort_order;
        params['sort_field'] = $scope.sort_field;
        $scope.invokeApi(RVActivityLogSrv.filterActivityLog, params, callback);
    }

    /*
    * Sorting
    */
    $scope.initSort =function(){
        $scope.sortOrderOfUserASC = false;
        $scope.sortOrderOfDateASC = false;
        $scope.sortOrderOfActionASC = false;
        $scope.sortOrderOfUserDSC = false;
        $scope.sortOrderOfDateDSC = false;
        $scope.sortOrderOfActionDSC = false;
    }

    $scope.sortByUserName = function(){
        $scope.sort_field ="USERNAME";
        if($scope.sortOrderOfUserASC){
            $scope.initSort();
            $scope.sortOrderOfUserDSC = true;
            $scope.sort_order="desc";
        }
        else{
            $scope.initSort();
            $scope.sortOrderOfUserASC = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    $scope.sortByDate = function(){
        $scope.sort_field ="DATE";
        if($scope.sortOrderOfDateASC){
            $scope.initSort();
            $scope.sortOrderOfDateDSC = true;
            $scope.sort_order="desc";
        }
        else{
            $scope.initSort();
            $scope.sortOrderOfDateASC = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    $scope.sortByAction = function(){
        $scope.sort_field ="ACTION";
        if($scope.sortOrderOfActionASC){
            $scope.initSort();
            $scope.sortOrderOfActionDSC = true;
            $scope.sort_order="desc";
        }
        else{
            $scope.initSort();
            $scope.sortOrderOfActionASC = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    /*
    * Pagination
    */
    $scope.initPaginationParams = function() {
        if($scope.activityLogData.total_count==0){
             $scope.start = 0;
             $scope.end =0;
        }else{
        $scope.start = 1;
        $scope.end = $scope.start + $scope.activityLogData.length - 1;
        }
        $scope.page = 1;
        $scope.perPage = 50;
        $scope.nextAction = false;
        $scope.prevAction = false;
    }

    $scope.loadNextSet = function() {
        $scope.page++;
        $scope.nextAction = true;
        $scope.prevAction = false;
        $scope.updateReport();
    };

    $scope.loadPrevSet = function() {
        $scope.page--;
        $scope.nextAction = false;
        $scope.prevAction = true;
        $scope.updateReport();
    };

    $scope.isNextButtonDisabled = function() {
        var isDisabled = false;
        if ($scope.end >= $scope.totalResults) {
            isDisabled = true;
        }
        return isDisabled;
    };

    $scope.isPrevButtonDisabled = function() {
        var isDisabled = false;
        if ($scope.page == 1) {
            isDisabled = true;
        }
        return isDisabled;
    };



    function split(val) {
        return val.split(/,\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }
    
    var initializeAutoCompletion = function(){
        //forming auto complte source object
        var activeUserAutoCompleteObj = [];
        _.each($scope.activeUserList, function(user) {
            activeUserAutoCompleteObj.push({
                label: user.email,
                value: user.id
            });
        });

        var userAutoCompleteCommon = {
            source: function(request, response) {
                // delegate back to autocomplete, but extract the last term
                response($.ui.autocomplete.filter(activeUserAutoCompleteObj, extractLast(request.term)));
            },
            select: function(event, ui) {
                $scope.user_id = ui.item.value;
                var uiValue = split(this.value);
                uiValue.pop();
                uiValue.push(ui.item.label);
                uiValue.push("");
                //this.value = uiValue.join(", ");
                this.value = ui.item.label;
                return false;
            },
            close: function(event, ui) {
                var uiValues = split(this.value);
                var modelVal = [];

                _.each($scope.activeUserAutoCompleteObj, function(user) {
                    var match = _.find(uiValues, function(email) {
                        return email == user.label;
                    });

                    if (!!match) {
                        modelVal.push(user.value);
                    };
                });

            },
            focus: function(event, ui) {
                return false;
            }
        }
        $scope.listUserAutoCompleteOptions = angular.extend({
            position: {
                my: 'left bottom',
                at: 'left top',
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

    }

    
    /*
    * function to refresh scroller
    * will refresh left filter scroller
    */
    var refreshScroller = function() {
        $scope.refreshScroller ('report-update');
    };
    $scope.clearToDate = function()
    {
        $scope.toDate ="";
     }
    $scope.clearFromDate = function()
    {
       $scope.fromDate = "";
      
    }
    $scope.userChanged = function(){
        if($scope.userEmail==''){
           $scope.user_id=0;
        }
    }
    $scope.userEmail='';
	$scope.init = function(){
        //setting the header caption
		$scope.$emit('HeaderChanged', $filter('translate')('ACTIVITY_LOG_TITLE'));
        
        $scope.errorMessage = '';
        $scope.activityLogData = activityLogResponse.results;
        $scope.activityLogData.total_count = activityLogResponse.total_count;
        $scope.activeUserList = activeUserList;
       
        //Filter
        $scope.isUpdateReportFilter = false;
        $scope.reportUpdateVisible = false;
        $scope.reportUpdateWidth = resizableMinWidth;
        $scope.fromDate ='';
        $scope.toDate ='';
        $scope.user_id = 0;

        //Paginaton
        $scope.totalResults = activityLogResponse.total_count;
        $scope.initPaginationParams();

        //Sorting
        $scope.initSort();

        //setting date picker options
        setDatePickerOptions();

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

        $scope.setScroller('report_content');
        
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

        initializeAutoCompletion();
     
	};
	$scope.init();

}]);