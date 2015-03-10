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
    $scope.updateReportFilter = function(){
        $scope.updateReportFilter = true;
        $scope.updateReport();
    }

    $scope.updateReport = function(){
        var callback = function(data) {
                $scope.activityLogData = data.results;
                if ($scope.nextAction) {
                    $scope.start = $scope.start + $scope.perPage;
                }
                if ($scope.prevAction) {
                    $scope.start = $scope.start - $scope.perPage;
                }
                $scope.end = $scope.start + $scope.activityLogData.length - 1;
                $scope.$emit('hideLoader');
        }
        var params = {};
        params.id=$scope.$parent.reservation.reservation_card.reservation_id;
        if($scope.updateReportFilter){
            params.from_date = $filter('date')($scope.fromDate, 'yyyy-MM-dd');
            params.to_date = $filter('date')($scope.toDate, 'yyyy-MM-dd');
        }
        params.sort_order = $scope.sort_order;
        params.sort_field = $scope.sort_field ;
        $scope.invokeApi(RVActivityLogSrv.filterActivityLog, params, callback);
    }

    /*
    * Sorting
    */    
    $scope.sortByUserName = function(){
        $scope.sort_field ="USERNAME";
        if($scope.sortOrderOfUserASC){
            $scope.sortOrderOfUserDSC = true;
            $scope.sortOrderOfUserASC = false;
            $scope.sort_order="desc";
        }
        else{
            $scope.sortOrderOfUserASC = true;
            $scope.sortOrderOfUserDSC = false;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    $scope.sortByDate = function(){
        $scope.sort_field ="DATE";
        if($scope.sortOrderOfDateASC){
            $scope.sortOrderOfDateDSC = true;
            $scope.sortOrderOfDateASC = false;
            $scope.sort_order="desc";
        }
        else{
            $scope.sortOrderOfDateASC = true;
             $scope.sortOrderOfDateDSC = false;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    $scope.sortByAction = function(){
        $scope.sort_field ="ACTION";
        if($scope.sortOrderOfActionASC){
            $scope.sortOrderOfActionDSC = true;
            $scope.sortOrderOfActionASC = false;
            $scope.sort_order="desc";
        }
        else{
            $scope.sortOrderOfActionASC = true;
            $scope.sortOrderOfActionDSC = false;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    }

    /*
    * Pagination
    */
    $scope.initPaginationParams = function() {
        $scope.start = 1;
        $scope.perPage = RVActivityLogSrv.perPage;
        $scope.end = $scope.start + $scope.activityLogData.length - 1;
        $scope.nextAction = false;
        $scope.prevAction = false;
    }

    $scope.loadNextSet = function() {
        RVActivityLogSrv.page++;
        $scope.nextAction = true;
        $scope.prevAction = false;
        $scope.updateReport();
    };

    $scope.loadPrevSet = function() {
        RVActivityLogSrv.page--;
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
        if (RVActivityLogSrv.page == 1) {
            isDisabled = true;
        }
        return isDisabled;
    };

    
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
        $scope.activityLogData = activityLogResponse.results;
        $scope.activeUserList = activeUserList;

        //Filter
        $scope.updateReportFilter = false;
        $scope.reportUpdateVisible = false;
        $scope.reportUpdateWidth = resizableMinWidth;
        $scope.fromDate = $filter('date')($rootScope.businessDate, 'dd/MM/yyyy');
        $scope.toDate = $filter('date')($rootScope.businessDate, 'dd/MM/yyyy');

        //Paginaton
        $scope.totalResults = activityLogResponse.total_count;
        $scope.initPaginationParams();

        //Sorting
        $scope.sortOrderOfUserASC = false;
        $scope.sortOrderOfDateASC = false;
        $scope.sortOrderOfActionASC = false;
        $scope.sortOrderOfUserDSC = false;
        $scope.sortOrderOfDateDSC = false;
        $scope.sortOrderOfActionDSC = false;

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
	};
	$scope.init();

}]);