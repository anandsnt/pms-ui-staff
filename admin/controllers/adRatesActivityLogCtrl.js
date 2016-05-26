admin.controller('ADRatesActivityLogCtrl',['$scope', '$rootScope', '$state','$stateParams', 'ADRateActivityLogSrv', 'ngTableParams', '$filter',
    function($scope, $rootScope, $state, $stateParams, ADRateActivityLogSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);


        $scope.init = function(){
        $scope.showActivityLog = false;
        $scope.activityLogData = {};
        $scope.fromDate = $rootScope.businessDate;
        $scope.toDate = $rootScope.businessDate;
        $scope.user_id = 0;
        $scope.getRateLog = function(){
            $scope.showActivityLog = true;
            $scope.$emit('showLoader');
            var rateId = $stateParams.rateId;
            var callback = function(response){
                $scope.activityLogData = response;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADRateActivityLogSrv.fetchRateLog, {'id':rateId},callback);
        };
        $scope.toggleActivityLogFilterON = false;
        $scope.toggleActivityLogFilter = function(){
            $scope.toggleActivityLogFilterON = !$scope.toggleActivityLogFilterON;
            if ($scope.toggleActivityLogFilterON){
                initializeAutoCompletion();
            }
        };
        $scope.toggleActivityLog = function(){
            if ($scope.detailsMenu !== 'adRateActivityLog'){
                $scope.detailsMenu = 'adRateActivityLog';
                $scope.getRateLog();
            } else {
                $scope.detailsMenu = '';
                $scope.toggleActivityLogFilterON = false;
            }
        };
        $scope.isOldValue = function(value){
            if(value === "" || typeof value === "undefined" || value === null){
                return false;
            }
            else{
                return true;
            }
        };


    var setDatePickerOptions = function(){
        //I just changed this to a function, dont knw who written this
        var datePickerCommon = {
            dateFormat: $rootScope.jqDateFormat,
            numberOfMonths: 1,
            changeYear: true,
            changeMonth: true,
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

            onSelect: function(value) {
                $scope.untilDateOptions.minDate = value;
            }
        }, datePickerCommon);
        $scope.untilDateOptions = angular.extend({

            onSelect: function(value) {
                $scope.fromDateOptions.maxDate = value;
            }
        }, datePickerCommon);
    };

    //setting date picker options
    setDatePickerOptions();

    $scope.updateReportFilter = function(){
        $scope.isUpdateReportFilter = true;
        $scope.initPaginationParams();
        $scope.initSort();
        $scope.updateReport();
    };
    $scope.initPaginationParams = function() {
        if($scope.activityLogData.total_count === 0){
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
    };
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
        };
        var params = {
                id: $stateParams.rateId,
                page: $scope.start,
                per_page: 50
        };
        if($scope.isUpdateReportFilter){
            $scope.fromDate = $('#activity-range-from').val();
            $scope.toDate = $('#activity-range-to').val();
            if ($scope.fromDate !== ''){
                params['from_date'] = $filter('date')(new Date($scope.fromDate), 'yyyy-MM-dd');
            }
            if ($scope.toDate !== ''){
                params['to_date'] =$filter('date')(new Date($scope.toDate), 'yyyy-MM-dd');
            }




        }
        params['sort_order'] = $scope.sort_order;
        params['sort_field'] = $scope.sort_field;

        $scope.invokeApi(ADRateActivityLogSrv.filterActivityLog, params, callback);
    };

    $scope.userChanged = function(){
        if($scope.userEmail === ''){
           $scope.user_id=0;
        }
    };
    $scope.userEmail='';
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
    };

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
    };

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
    };

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

                this.value = ui.item.label;
                return false;
            },
            close: function(event, ui) {
                var uiValues = split(this.value);
                var modelVal = [];

                _.each($scope.activeUserAutoCompleteObj, function(user) {
                    var match = _.find(uiValues, function(email) {
                        return email === user.label;
                    });

                    if (!!match) {
                        modelVal.push(user.value);
                    };
                });

            },
            focus: function(event, ui) {
                return false;
            }
        };
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

    };
            initializeAutoCompletion();
        };
        $scope.init();


}]);