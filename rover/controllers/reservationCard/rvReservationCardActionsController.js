sntRover.controller('rvReservationCardActionsController', ['$scope', '$filter', '$rootScope', 'ngDialog', 'rvActionTasksSrv','$state',
    function($scope, $filter, $rootScope, ngDialog, rvActionTasksSrv, $state) {
        $scope.reservationNotes = "";
        /*
         *To save the reservation note and update the ui accordingly
         */
        $scope.errorMessage = '';
        $scope.actions = {};
        $scope.newAction = {};
        $scope.actions.totalCount = 0;
        $scope.actions.arrivalDateString = '';
        $scope.actions.departureDateString = '';
        
        $scope.selectedAction = {};
        $scope.selectedAction.created_by = 'StayNtouch';
        $scope.selectedAction.created_by_null = false;
        $scope.selectedAction.created_at;
        $scope.selectedAction.created_at_time;
        $scope.selectedAction.created_by;
        $scope.selectedAction.description;
        $scope.selectedAction.department;
        $scope.selectedAction.id;
        $scope.selectedAction.assigned;
        $scope.selectedAction.due_at_date;
        
        
        $scope.departmentSelect = {};
        $scope.departmentSelect.selected;
        
        
        $scope.selectedActionMessage = '';
        $scope.selectedDepartment = '';
        
        var init = function() {
            $scope.setScroller("rvActionListScroller");
            $scope.populateTimeFieldValue();
            var hideActions = true;
            if ($scope.reservationData.reservation_card.notes.reservation_notes.length > 0) {
                hideActions = false;
            }

            $scope.reservationActionsState = {
                hideDetails: hideActions
            };

            $scope.setScroller('reservationActions');
            $scope.fetchActionsCount();
        };

        var refreshScroller = function() {
            $scope.refreshScroller('reservationActions');
        };
        $scope.setActionsHeaderInfo = function(){
            var arDate = $scope.$parent.reservationData.reservation_card.arrival_date,
                    arTime = $scope.$parent.reservationData.reservation_card.arrival_time;
            var arDay = $scope.getDateFromDate(arDate);
            arDay = arDay.toLowerCase();

            var deDate = $scope.$parent.reservationData.reservation_card.departure_date,
                    deTime = $scope.$parent.reservationData.reservation_card.departure_time;
            var deDay = $scope.getDateFromDate(deDate);
            deDay = deDay.toLowerCase();
          
            $scope.actions.arrivalDateString = arDay.substring(0,1).toUpperCase()+arDay.substring(1,3)+' '+arDate+' '+arTime;
            $scope.actions.departureDateString = deDay.substring(0,1).toUpperCase()+deDay.substring(1,3)+' '+deDate+' '+deTime;  
        };
        
        $scope.fetchActionsCount = function(){
            var onSuccess = function(data){
                $scope.$parent.$emit('hideLoader');
                var totalActionsFound = data.data.action_count;
                $scope.actions.totalCount = totalActionsFound;
                $scope.setActionsHeaderInfo();
            };
            var onFailure = function(data){
                $scope.$parent.$emit('hideLoader');
                $scope.setActionsHeaderInfo();
            };
            
            var data = {id:$scope.$parent.reservationData.reservation_card.reservation_id};
            $scope.invokeApi(rvActionTasksSrv.getTasksCount, data, onSuccess, onFailure);
        };
        $scope.departments = [];
        $scope.fetchDepartments = function(){
            var onSuccess = function(data){
                $scope.$parent.$emit('hideLoader');
                $scope.departments = data.data.departments;
                $scope.departmentsCount = $scope.departments.length;
            };
            var onFailure = function(data){
                $scope.departmentsCount = 0;
                $scope.$parent.$emit('hideLoader');
            };
            
            var data = {id:$scope.$parent.reservationData.reservation_card.reservation_id};
            $scope.invokeApi(rvActionTasksSrv.fetchDepartments, data, onSuccess, onFailure);
        };
        $scope.selectAction = function(a){
            var action = a;
            $scope.selectedAction = action;
            $scope.setRightPane('selected');
        };
        $scope.setRightPane = function(toView){
            //selected, new, assign, comment
            $scope.actionSelected = toView;
            
        };
        $scope.clearNewAction = function(){
            $scope.newAction.notes = '';
            $scope.newAction.department = {};
            $scope.newAction.time_due = '';
            $scope.newAction.date_due = '';
            $scope.newAction.hasDate = false;
            
        };
        $scope.clearErrorMessage = function () {
                $scope.errorMessage = [];
        };
        $scope.postAction = function(){
            var onSuccess = function(){
                $scope.$parent.$emit('hideLoader');
                $scope.fetchActionsList();
                $scope.refreshScroller("rvActionListScroller");
            };
            var onFailure = function(data){
                if (data[0]){
                    $scope.errorMessage = data[0];
                }
                $scope.$parent.$emit('hideLoader');
            };
            //reservation_id=1616903&action_task[description]=test
            var params = {
                'reservation_id':$scope.$parent.reservationData.reservation_card.reservation_id,
                'action_task': {
                    'description': $scope.newAction.notes
                }
            };
            if ($scope.newAction.department){
                if ($scope.newAction.department.value){
                    params['assigned_to'] = $scope.newAction.department.value;
                }
            }
            
            if ($scope.newAction.date_due){
                var coreTime;
                var hours, mins;
                if (!$scope.newAction.time_due){
                    coreTime = null;
                        hours = '00';
                        mins = '00';
                } else if ($scope.newAction.time_due.core_time){
                     coreTime = $scope.newAction.time_due.core_time;
                        hours = coreTime[0]+''+coreTime[1];
                        mins = coreTime[2]+''+coreTime[3];
                        var d = new Date($scope.newAction.date_due);
                        d.setHours(hours);
                        d.setMinutes(mins);
                        d.setSeconds(00);
                        params['time_due'] = d.valueOf();
                }
                var myDate = new Date($scope.newAction.date_due+' '+hours+':'+mins+':00');
                params['due_at'] = myDate.valueOf();
            }
            
            $scope.invokeApi(rvActionTasksSrv.postNewAction, params, onSuccess, onFailure);
        };
        
        
        $scope.dateOptions = {
             changeYear: true,
             changeMonth: true,
             minDate: tzIndependentDate($rootScope.businessDate),
             yearRange: "0:+10",
             onSelect: function(date, dateObj) {
                 if ($scope.dateSelection !== null){
                     if ($scope.dateSelection === 'select'){
                         $scope.selectedAction.due_at_date = date;
                         $scope.selectedAction.hasDate = true;
                         if ($scope.usingCalendar){
                             $scope.updateAction();
                         }
                         $scope.closeSelectedCalendar();
                         
                     } else {
                         $scope.newAction.hasDate = true;
                         $scope.newAction.date_due = date;
                         //this one has a save / post button
                         $scope.closeNewCalendar();
                     };
                 }
            }
        };
        $scope.onTimeChange = function(){
            $scope.updateAction();
        };
        $scope.updateAction = function(){
            var onSuccess = function(data){
                $scope.$parent.$emit('hideLoader');
                $scope.fetchActionsList();
                $scope.refreshScroller("rvActionListScroller");
            };
            var onFailure = function(data){
                if (data[0]){
                    $scope.errorMessage = 'Internal Error Occured';
                }
                $scope.$parent.$emit('hideLoader');
                
            };
            
            //reservation_id=1616903&action_task[description]=test
            var params = {
                'reservation_id':$scope.$parent.reservationData.reservation_card.reservation_id,
                'action_task':{
                    'id':$scope.selectedAction.id
                }
            };
            
            if ($scope.selectedAction.due_at_date){
                var coreTime;
                var hours, mins;
                if (!$scope.selectedAction.time_due){
                    coreTime = null;
                        hours = '00';
                        mins = '00';
                       /// params['time_due'] = null;
                } else if ($scope.selectedAction.time_due.core_time){
                     coreTime = $scope.selectedAction.time_due.core_time;
                        hours = coreTime[0]+''+coreTime[1];
                        mins = coreTime[2]+''+coreTime[3];
                        var d = new Date($scope.selectedAction.due_at_date);
                        d.setHours(hours);
                        d.setMinutes(mins);
                        d.setSeconds(00);
                        params['time_due'] = d.valueOf();
                }
                var myDate = new Date($scope.selectedAction.due_at_date+' '+hours+':'+mins+':00');
                params['due_at'] = myDate.valueOf();
                
                $scope.invokeApi(rvActionTasksSrv.updateNewAction, params, onSuccess, onFailure);
            }
            
        };
        
        $scope.showCalendar = function() {
            ngDialog.open({ 
                template: '/assets/partials/reservationCard/Actions/rvReservationCardActionsCalendar.html' });
        };
        
        $scope.usingCalendar = false;
        $scope.showSelectCalendar = function(){
            $scope.usingCalendar = true;
            $scope.dateSelection = 'select';
            $scope.selectCalendarShow = true;
        };
        
        $scope.closeSelectedCalendar = function(){
        $scope.usingCalendar = false;
            $scope.dateSelection = null;
            $scope.selectCalendarShow = false;
        };
        
        $scope.showNewCalendar = function(){
            $scope.dateSelection = 'new';
            $scope.newCalendarShow = true;
            $scope.usingCalendar = true;
        };
        
        $scope.closeNewCalendar = function(){
            $scope.dateSelection = null;
            $scope.newCalendarShow = false;
            $scope.usingCalendar = false;
        };
        
        
        $scope.initNewAction = function(){
            $scope.setRightPane('new');
            //$scope.selectedAction.id = -1;//de-select the selected action
            
        };
        $scope.getDefaultDueDate = function(){
            return new Date();
        };
        $scope.cancelNewAction = function(){
            //switch back to selected view of lastSelected
            //just change the view to selected
            $scope.setRightPane('selected');
            $scope.clearNewAction();
        };
        $scope.cancelAssign = function(){
            //switch back to selected view of lastSelected
            //just change the view to selected
            $scope.setRightPane('selected');
            $scope.departmentSelect = {};
        };
        
        
        $scope.actionSelected = 'selected';
        $scope.fetchActionsList = function(){
            $scope.fetchDepartments();//store this to use in assignments of department
            var onSuccess = function(data){
                var list = data.data;
                for (var x in list){
                    if (list[x].assigned_to !== null){
                        list[x].assigned = true;
                    } else {
                        list[x].assigned = false;
                    }
                    if (list[x].due_at){
                        list[x].due_at_time = getTimeFromDateStr(list[x].due_at);
                        list[x].due_at_date = getFormattedDate(list[x].due_at);
                    } else {
                        list[x].hasDate = false;
                    }
                    if (list[x].created_at){
                        list[x].created_at_time = getTimeFromDateStr(list[x].created_at);
                        list[x].created_at_date = getFormattedDate(list[x].created_at);
                    }
                }
                $scope.actions = list;
                $scope.fetchActionsCount();
                $scope.setActionsHeaderInfo();
                $scope.setDefaultActionSelected(0);
                $scope.$parent.$emit('hideLoader');
                //$scope.refreshActionsList();
            };
            var onFailure = function(data){
                $scope.$parent.$emit('hideLoader');
                $scope.setActionsHeaderInfo();
            };
            
            var data = {id:$scope.$parent.reservationData.reservation_card.reservation_id};
            $scope.invokeApi(rvActionTasksSrv.getActionsTasksList, data, onSuccess, onFailure);
        };
        var getTimeFromDateStr = function(d){
            var date = new Date(d);
            return formatTime(date.valueOf());
        };
        $scope.setDefaultActionSelected = function(index){
            if (!index){
                index = 0;
            }
            setTimeout(function(){
                if ($scope.actions[index]){
                     $scope.selectAction($scope.actions[index]);//first action selected by default
                 }
            },100);
        };
        var getFormattedDate = function(d){
            if (d){
                var dateStr = d.split('T');
                var month, day, year;
                var formatDate = dateStr[0].split('-');
                year = formatDate[0],
                        month = formatDate[1],
                        day = formatDate[2];
                
                return month+'-'+day+'-'+year;
            }
            
        };
        $scope.getDateFromDate = function(d){
            var day = new Date(d);
            var dayString = day.getDay();
            switch (day.getDay()){
                case 0:
                    return $filter('translate')('SUNDAY');
                    break;
                        
                case 1:
                    return $filter('translate')('MONDAY');
                    break;
                        
                case 2:
                    return $filter('translate')('TUESDAY');
                    break;
                        
                case 3:
                    return $filter('translate')('WEDNESDAY');
                    break;
                        
                case 4:
                    return $filter('translate')('THURSDAY');
                    break;
                        
                case 5:
                    return $filter('translate')('FRIDAY');
                    break;
                        
                case 6:
                    return $filter('translate')('SATURDAY');
                    break;
                        
            }
            
            return dayString;
        };
        function closeDialog() {
            $scope.fetchActionsCount();
            ngDialog.close();
        }

        var formatTime = function(timeInMs) {
            var dt = new Date(timeInMs * 1000);

            var hours = dt.getHours();
            var minutes = dt.getMinutes();
            var seconds = dt.getSeconds();

            if (hours < 10) 
             hours = '0' + hours;

            if (minutes < 10) 
             minutes = '0' + minutes;

            if (seconds < 10) 
             seconds = '0' + seconds;
            return getFormattedTime(hours+''+minutes);
      //      return hours + ":" + minutes + ":" + seconds;
        };
        var getFormattedTime = function (fourDigitTime){
            var hours24 = parseInt(fourDigitTime.substring(0,2));
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? 'PM' : ' AM';
            var minutes = fourDigitTime.substring(2);

            return hours + ':' + minutes + amPm;
        };
        $scope.populateTimeFieldValue = function(){
             var getFormattedTime = function (fourDigitTime){
                var hours24 = parseInt(fourDigitTime.substring(0,2));
                var hours = ((hours24 + 11) % 12) + 1;
                var amPm = hours24 > 11 ? 'PM' : ' AM';
                var minutes = fourDigitTime.substring(2);

                return hours + ':' + minutes + amPm;
            };
            $scope.timeFieldValue = [];
            for (var x in $scope.timeFieldValues){
                $scope.timeFieldValue.push({
                    'value':getFormattedTime($scope.timeFieldValues[x]),
                    'core_time':$scope.timeFieldValues[x]
                });
            }
        };
        $scope.timeFieldValue = [];
        $scope.timeFieldValues = ['0000','0015','0030','0045','0100',
                                    '0115','0130','0145','0200',
                                    '0215','0230','0245','0300',
                                    '0315','0330','0345','0400',
                                    '0415','0430','0445','0500',
                                    '0515','0530','0545','0600',
                                    '0615','0630','0645','0700',
                                    '0715','0730','0745','0800',
                                    '0815','0830','0845','0900',
                                    '0915','0930','0945','1000',
                                    '1015','1030','1045','1100',
                                    '1115','1130','1145','1200',
                                    '1215','1230','1245','1300',
                                    '1315','1330','1345','1400',
                                    '1415','1430','1445','1500',
                                    '1515','1530','1545','1600',
                                    '1615','1630','1645','1700',
                                    '1715','1730','1745','1800',
                                    '1815','1830','1845','1900',
                                    '1915','1930','1945','2000',
                                    '2015','2030','2045','2100',
                                    '2115','2130','2145','2200',
                                    '2215','2230','2245','2300',
                                    '2315','2330','2345'
        ];
        
        $scope.openActionsPopup = function() {
            $scope.fetchActionsList();
            ngDialog.open({
                template: '/assets/partials/reservationCard/Actions/rvReservationCardActionsPopup.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                preCloseCallback:function(){
                    $scope.fetchActionsCount();
                }
            });
        };
        $scope.departmentSelect = {};
        $scope.assignDepartment = function(){
            var params = $scope.getBaseParams();
            if ($scope.departmentSelect.selected){
                params.department = $scope.departmentSelect.selected.value;
                params.action_task.id  = $scope.selectedAction.id;
                
                var onSuccess = function(){
                    //switch back to selected
                    $scope.actionSelected = 'selected';
                };
                var onFailure = function(data){
                    //show failed msg, so user can try again-?
                    if (data[0]){
                        $scope.errorMessage = 'Internal Error Occured';
                    }
                    $scope.$parent.$emit('hideLoader');
                };

                $scope.invokeApi(rvActionTasksSrv.updateNewAction, params, onSuccess, onFailure);
            }
        };
        
        $scope.completeAction = function(){
            //mark the selected action as complete, notify the api
            
        };
        
        $scope.assignAction = function(){
            $scope.actionSelected = 'assign';
        };
        
        $scope.reassignAction = function(){
            $scope.departmentSelect.selected = {
                name: $scope.selectedAction.assigned_to.name,
                value: $scope.selectedAction.assigned_to.id
            };
            $scope.actionSelected = 'assign';
        };
        
        $scope.getBaseParams = function(){
            var params = {
                'reservation_id':$scope.$parent.reservationData.reservation_card.reservation_id,
                'action_task':{}
            };
            return params;
        };
        
        
        
        
        init();
    }
]);