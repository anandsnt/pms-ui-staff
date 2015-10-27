sntRover.controller('rvReservationCardActionsController', ['$scope', '$filter', '$rootScope', 'ngDialog', 'rvActionTasksSrv', 'RVReservationCardSrv','$state',
    function($scope, $filter, $rootScope, ngDialog, rvActionTasksSrv, RVReservationCardSrv, $state) {
        $scope.reservationNotes = "";
        /*
         *To save the reservation note and update the ui accordingly
         */
        $scope.errorMessage = '';
        $scope.actionsCount = 'none';//none, pending, all-completed
        $scope.actions = {};
        $scope.newAction = {};
        $scope.actions.totalCount = 0;
        $scope.actions.arrivalDateString = '';
        $scope.actions.departureDateString = '';

        $scope.selectedAction = {};
        $scope.selectedAction.created_by_null = false;
        $scope.selectedAction.created_at;
        $scope.selectedAction.created_at_time;
        $scope.selectedAction.created_by;
        $scope.selectedAction.description;
        $scope.selectedAction.department;
        $scope.selectedAction.id;
        $scope.selectedAction.assigned;
        $scope.selectedAction.due_at_date;
        $scope.selectedAction.due_at_time;
        $scope.openingPopup = false;

        $scope.hotel_time = "4:00 A.M";
        $scope.departmentSelect = {};
        $scope.departmentSelect.selected;


        $scope.selectedActionMessage = '';
        $scope.selectedDepartment = '';
        $scope.actionsSyncing = false;
        
        $scope.reservationId = '';
        $scope.isStandAlone = true;
        
        $scope.editingDescriptionInline = false;
        
        var init = function() {
            if ($rootScope.isStandAlone){
                $scope.isStandAlone = true;
            } else {
                $scope.isStandAlone = false;
            }
            
            if ($scope.$parent.reservationData.reservation_card.reservation_id){
                $scope.reservationId = $scope.$parent.reservationData.reservation_card.reservation_id;
            }
            $scope.populateTimeFieldValue();
            $scope.setScroller("rvActionListScroller");

           //initially use the count from the staycard init request for reservation details
           var setActionsCount = function(){
               $scope.setInitialActionsCount(RVReservationCardSrv.lastFetchData.data);
           };
            $scope.$watch('RVReservationCardSrv.data',  setActionsCount);
            $scope.setUpData();
            
            if (!$scope.isStandAlone){
                $scope.syncActions($scope.reservationId);
            }
        };
        $scope.lastSavedDescription = '';
        $scope.updateActionDescription = function(description_old, description_new){
            var params = {
                'reservation_id':$scope.$parent.reservationData.reservation_card.reservation_id,
                'action_task':{
                    'id':$scope.selectedAction.id
                }
            };
            
            params.action_task.description = description_new;
            
            var onSuccess = function(response){
                        $scope.lastSavedDescription = response.data.description;
                        $scope.savingDescription = false;
                        $scope.$emit('hideLoader');
            };
            var onFailure = function(response){
                        $scope.savingDescription = false;
                        $scope.$emit('hideLoader');
            };
            if ($scope.savingDescription){
                if ($scope.lastSavedDescription !== description_new){
                    if (description_new && description_new !== ''){
                        $scope.invokeApi(rvActionTasksSrv.updateNewAction, params, onSuccess, onFailure);
                    } else {
                      $scope.selectedAction.description = $scope.lastSavedDescription;  
                      $scope.editingDescriptionValue = $scope.lastSavedDescription;  
                    }
                } 
            }
        };
        $scope.savingDescription = false;
        
        
        $scope.stopEditClick = function(ent){
            if (!$scope.starting || ent){//ent = enter on keyboard hit, user was in txt input and hits enter, forcing a save request
                setTimeout(function(){
                    $scope.editingDescriptionInline = false;

                    if (!$scope.isStandAlone){
                        if ($scope.lastSavedDescription !== $scope.selectedAction.description){
                            ///push up
                            if (!$scope.savingDescription){
                                $scope.savingDescription = true;
                                $scope.updateActionDescription($scope.editingDescriptionValue, $scope.selectedAction.description);
                            }
                        }
                    }
                },250);
            } else {
                 $scope.startEditDescription();   
            }   

        };
        
        $scope.starting = false;
        $scope.startEditDescription = function(){
            $scope.starting = true;
            if (!$scope.isStandAlone){
                if ($scope.isTrace($scope.selectedAction.action_task_type)){//only overlay traces for now (sprint 37) CICO-17112
                    $scope.editingDescriptionInline = true;
                }
                $scope.starting = false;
                $scope.editingDescriptionValue = $scope.selectedAction.description;
            } else {
                $scope.starting = false;
                $scope.editingDescriptionInline = false;
            }
        };
        
        $scope.actionsSyncd = false;
        $scope.syncActions = function(id){
            /*
             * method to sync action count for the staycard
             * this reaches out to 
             */
            var onSuccess = function(data){
              $scope.actions.totalCount = data.total_count;
              $scope.actions.pendingCount = data.pending_count;
              $scope.actionsSyncd = true;
              $scope.$emit('hideLoader');
            };
            var onFailure = function(response){
                
              $scope.actionsSyncd = true;
            };
            $scope.invokeApi(rvActionTasksSrv.syncActionCount, id, onSuccess, onFailure);
        };

        $scope.setInitialActionsCount = function(data){
            if (data){
                $scope.actions.totalCount = data.action_count;
                $scope.actions.pendingCount = data.pending_action_count;
                var pending = $scope.actions.pendingCount, total = $scope.actions.totalCount;

                if (total === 0){
                    $scope.actionsCount = 'none';//none, pending, all-completed
                } else if (total > 0 && pending === 0){
                    $scope.actionsCount = 'all-completed';
                } else if (total > 0 && total === pending) {
                    $scope.actionsCount = 'only-pending';
                } else {
                    $scope.actionsCount = 'pending';
                }
            }
        };

        var refreshScroller = function() {
            $scope.refreshScroller('rvActionListScroller');
        };
        $scope.hasArrivalDate = false;
        $scope.hasDepartureDate = false;

        $scope.getArDeDateStr = function(dateStr, timeStr){
            if (!dateStr){
                dateStr = ' ';
            }
            if (!timeStr){
                timeStr = ' ';
            }
            var aDay = $scope.getDateFromDate(dateStr), aDayString = ' ';
            if (aDay){
                aDay = aDay.toLowerCase();
                aDayString = aDay.substring(0,1).toUpperCase()+aDay.substring(1,3)+' ';
            }
            //make sure timestring include '0' if < 10, ie. 09, 08, etc instead of 9, 8...
            if (timeStr !== ' '){
                var timeSpl = timeStr.split(':');
                var hour = timeSpl[0];
                var hourInt = parseInt(hour);
                if (hour < 10){
                    timeStr = '0'+hourInt+':'+timeSpl[1];
                }
            }
            if (dateStr){
                return aDayString+$scope.flipDateFormat(dateStr)+'  '+timeStr;
            } else {
                return timeStr;
            }
        };


        $scope.setActionsHeaderInfo = function(){
            var arDate = $scope.reservationData.reservation_card.arrival_date,
                    arTime = $scope.reservationData.reservation_card.arrival_time;

            var arrivalDayString = $scope.getArDeDateStr(arDate, arTime);
            if (!arrivalDayString){
                $scope.hasArrivalDate = false;
            } else {
                $scope.hasArrivalDate = true;
            }

            var deDate = $scope.reservationData.reservation_card.departure_date,
                    deTime = $scope.reservationData.reservation_card.departure_time;

            var departureDayString = $scope.getArDeDateStr(deDate, deTime);
            if (!departureDayString){
                $scope.hasDepartureDate = false;
            } else {
                $scope.hasDepartureDate = true;
            }
            $scope.actions.arrivalDateString = arrivalDayString;
            $scope.actions.departureDateString = departureDayString;
        };

        $scope.flipDateFormat = function(str){
            //take 2015-04-10  |   yr / mo / day and >>> month, day, yr (04-10-2015)
          if (str){
              var spl = str.split('-');
              var year = spl[0], month = spl[1], day = spl[2];
              return month+'-'+day+'-'+year;
          }


        };

        $scope.fetchActionsCount = function(){
            var onSuccess = function(data){
                $scope.$parent.$emit('hideLoader');

                $scope.actions.totalCount = data.data.action_count;
                $scope.actions.pendingCount = data.data.pending_action_count;
                if ($scope.actions.totalCount === 0){
                    $scope.actionSelected = 'new';
                }
                
                var pending = $scope.actions.pendingCount, total = $scope.actions.totalCount;

                if (total === 0 && pending === 0){
                    $scope.actionsCount = 'none';//none, pending, all-completed
                } else if (total > 0 && pending === 0){
                    $scope.actionsCount = 'all-completed';
                } else if (total > 0 && total === pending) {
                    $scope.actionsCount = 'only-pending';
                } else {
                    $scope.actionsCount = 'pending';
                }
                $scope.$apply();
            };
            var onFailure = function(data){
                $scope.$parent.$emit('hideLoader');
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
            $scope.lastSavedDescription = action.description;
            
            $scope.setRightPane('selected');
            $scope.clearAssignSection();
        };
        $scope.setRightPane = function(toView){
            //selected, new, assign, comment
            $scope.actionSelected = toView;
            $scope.$apply();
        };
        $scope.clearNewAction = function(){
            $scope.closeSelectedCalendar();
            $scope.closeNewCalendar();
            $scope.newAction.notes = '';
            $scope.newAction.department = {};
            $scope.newAction.time_due = '';
            var nd = new Date();
            var fmObj = $scope.getDateObj(getFormattedDate(nd.valueOf())+'', '-');
            $scope.actionsSelectedDate = fmObj.year+'-'+fmObj.month+'-'+fmObj.day;
            $scope.newAction.hasDate = false;
            $scope.setFreshDate();

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
                var splitChar = $scope.newAction.date_due[2];
                var dateObj = new Date($scope.getBasicDateInMilli($scope.newAction.date_due, splitChar));
                var coreTime, hours, mins;
                     coreTime = $scope.newAction.time_due.core_time;
                        hours = parseInt(coreTime[0]+''+coreTime[1]);
                        mins = parseInt(coreTime[2]+''+coreTime[3]);

                dateObj.setHours(parseInt(hours));
                //verify this is the correct hours to set using core_time
                dateObj.setMinutes(parseInt(mins));
                dateObj.setSeconds(0);
                var dueAtStr = dateObj.toISOString();
                var dueAtNoTimeZone = dueAtStr.split('.');
                params['due_at'] = dueAtNoTimeZone[0];
                //params['time_due'] = dateObj.valueOf();
            }

            $scope.invokeApi(rvActionTasksSrv.postNewAction, params, onSuccess, onFailure);
        };

        $scope.reformatDateOption = function(d, spl, newSpl){
            //expecting ie. 01/09/2015 (month, day, yr)
            var spl = d.split(spl);
            var month = spl[0], day = spl[1], year = spl[2];
            return month+newSpl+day+newSpl+year;
        };


	$scope.setUpData = function() {
            var businessDate = tzIndependentDate($rootScope.businessDate);
                var nd = new Date(businessDate);
                var day = ("0" + nd.getDate()).slice(-2);
                var month = ("0" + (nd.getMonth() + 1)).slice(-2);
                var fromDateStr = nd.getFullYear()+'-'+month+'-'+day;
                $scope.fromDate = fromDateStr;
        };

        $scope.setFreshDate = function(){
            var nd = new Date();
            var fmObj = $scope.getDateObj(getFormattedDate(nd.valueOf())+'', '-');
            $scope.newAction.hasDate = true;
            $scope.newAction.date_due = fmObj.month+'-'+fmObj.day+'-'+fmObj.year;
            if (!$scope.newAction.time_due){
                $scope.newAction.time_due = $scope.timeFieldValue[0];
            }
        };

        $scope.actionsDateOptions = {
             firstDay: 1,
             changeYear: true,
             changeMonth: true,
             minDate: tzIndependentDate($rootScope.businessDate),
             yearRange: "0:+10",
             onSelect: function(date, dateObj) {
                 if ($scope.dateSelection !== null){
                     if ($scope.dateSelection === 'select'){
                         $scope.selectedAction.due_at_date = $scope.reformatDateOption(date, '/', '-');

                         $scope.selectedAction.hasDate = true;
                         if ($scope.usingCalendar){
                             $scope.updateAction();
                         }
                         $scope.closeSelectedCalendar();

                     } else {
                         $scope.newAction.hasDate = true;
                         $scope.newAction.date_due = $scope.reformatDateOption(date, '/', '-');
                         if (!$scope.newAction.time_due){
                             $scope.newAction.time_due = $scope.timeFieldValue[0];
                         }
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
            var onSuccess = function(){
                $scope.$parent.$emit('hideLoader');
                $scope.refreshActionList();
                $scope.refreshScroller("rvActionListScroller");
            };
            var onFailure = function(data){
                if (data[0]){
                    $scope.errorMessage = 'Internal Error Occured';
                }
                $scope.$parent.$emit('hideLoader');

            };


            var params = {
                'reservation_id':$scope.$parent.reservationData.reservation_card.reservation_id,
                'action_task':{
                    'id':$scope.selectedAction.id
                }
            };
            $scope.lastSelectedItemId = $scope.selectedAction.id;
            if (typeof $scope.selectedAction.due_at_date === typeof 'string' || typeof $scope.selectedAction.due_at_date === typeof 12345){
                var coreTime, hours, mins;
                     coreTime = $scope.selectedAction.due_at_time.core_time;
                        hours = parseInt(coreTime[0]+''+coreTime[1]);
                        mins = parseInt(coreTime[2]+''+coreTime[3]);

                //have to convert the date format string to read properly
                var splitChar = $scope.selectedAction.due_at_date[2];
                var dateObj = new Date($scope.getBasicDateInMilli($scope.selectedAction.due_at_date, splitChar));

                dateObj.setHours(parseInt(hours));
                //verify this is the correct hours to set using core_time
                dateObj.setMinutes(parseInt(mins));
                dateObj.setSeconds(0);

               // params['time_due'] = saveDate.valueOf()+"";
                var dueAtStr = dateObj.toISOString();
                var dueAtNoTimeZone = dueAtStr.split('.');
                params['due_at'] = dueAtNoTimeZone[0];

                $scope.invokeApi(rvActionTasksSrv.updateNewAction, params, onSuccess, onFailure);
            }

        };
        $scope.getBasicDateInMilli = function(d, charToSplit){
            //expecting date string ie: 02/15/2015
            if (typeof charToSplit !== typeof 'string'){
                charToSplit = '/';
            }
            var sp = d.split(charToSplit);
            var nd = new Date();
            nd.setFullYear(sp[2]);
            nd.setMonth(sp[0]-1);
            nd.setDate(sp[1]);

            return nd.valueOf();
        };
        $scope.showCalendar = function() {
            ngDialog.open({
                template: '/assets/partials/reservationCard/Actions/rvReservationCardActionsCalendar.html' });
        };

        $scope.usingCalendar = false;
        $scope.getDateObj = function(dateStr, delim){
            var year, month, day;
            var spl = dateStr.split(delim);
            day = spl[1]; month = spl[0]; year = spl[2];

            return {day:day,month:month,year:year};
        };
        $scope.showSelectCalendar = function(){
            //to ensure same day due to utc hour, set utc hour to 0100
            //if newAction = set start date to today, otherwise set it to the selectedAction due date
            var fmObj = $scope.getDateObj($scope.selectedAction.due_at_date, '-');
            $scope.actionsSelectedDate = fmObj.year+'-'+fmObj.month+'-'+fmObj.day;
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
            $scope.clearNewAction();
            $scope.setRightPane('new');


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
            $scope.clearAssignSection();
        };


        $scope.actionSelected = 'selected';
        var getTimeObj = function(timeVal){
            var forTime = getTimeFromDateMilli(timeVal);
            for (var i in $scope.timeFieldValue){
                if ($scope.timeFieldValue[i].value === forTime){
                    return $scope.timeFieldValue[i];
                }
            }
        };
        $scope.lastSelectedItemId = '';
        $scope.refreshActionList = function(del, selected){
            $scope.fetchDepartments();//store this to use in assignments of department
            var onSuccess = function(data){
                $scope.hotel_time = $scope.convertMilTime(data.business_date_time);
                var list = data.data;
                //if doing a refresh, dont replace the actions array, since it will cause the UI to flash
                //and look like a bug, instead go through the objects and update them

                var matchObj;
                for (var x in list){
                    if (list[x].assigned_to !== null){
                        list[x].assigned = true;
                    } else {
                        list[x].assigned = false;
                    }
                    if (typeof list[x].time_due === typeof 'string'){
                        matchObj = getTimeObj(list[x].time_due);
                        list[x].due_at_time = matchObj;
                    } else {
                        list[x].due_at_time = $scope.timeFieldValue[0];
                    }
                    if (typeof list[x].due_at === typeof 'string'){
                        list[x].due_at_date = getFormattedDate(list[x].due_at);
                        list[x].hasDate = true;
                    } else {
                        list[x].hasDate = false;
                    }

                    if (list[x].created_at){
                        list[x].created_at_time = getTimeFromDateStr(list[x].created_at, 'created_at_time');
                        list[x].created_at_date = getStrParsedFormattedDate(list[x].created_at);
                    }
                    if (list[x].action_status === "COMPLETED"){
                        list[x].isCompleted = true;
                        list[x].date_completed = getFormattedDate(list[x].completed_at);
                        list[x].time_completed = getCompletedTimeFromDateMilli(list[x].completed_at);
                    }
                    
                }



                var inActions = false;
                var listItem, actionItem;

                if (list.length >= $scope.actions.length){
                    for (var x in list){
                        listItem = list[x];

                        inActions = false;
                        for (var i in $scope.actions){
                            actionItem = $scope.actions[i];
                            if (actionItem.id === listItem.id){
                                if ($scope.isStandAlone){
                                    $scope.actions[i] = listItem;
                                    inActions = true;
                                } else if (!$scope.isStandAlone){
                                    if (del === 'delete'){//flag to delete an item (overlay)
                                        if (selected.id === listItem.id){
                                            inActions = true;//skips 
                                        }
                                    } else {
                                        $scope.actions[i] = listItem;
                                        inActions = true;
                                    }
                                }
                            }
                        }
                        if (!inActions){
                            $scope.actions.push(listItem);
                        }
                    }
                }
                
                //hide the element that was deleted; and refresh the scroller,
                //this also sets focus to the first item in the list
                for (var xi in $scope.actions){
                    if ($scope.actions[xi].id === selected.id){
                        $scope.actions[xi].is_deleted = true;
                        refreshScroller();
                    }
                }
                
                
                $scope.fetchActionsCount();
                $scope.setActionsHeaderInfo();
                var isStandAlone = $scope.isStandAlone;
                if ($scope.lastSelectedItemId){
                    for (var a in $scope.actions){
                        if (isStandAlone){
                            if ($scope.lastSelectedItemId === $scope.actions[a].id){
                                $scope.selectAction($scope.actions[a]);
                            }
                        } else if (!$scope.isStandAlone){
                            //overlay has some alerts which can get deleted; these are just hidden from view until the next full refresh / api call is done
                            //since the action object still exists, upon deleting an action, select the next (visible) action starting at the index (0)
                            if ($scope.lastSelectedItemId === $scope.actions[a].id && !del){
                                $scope.selectAction($scope.actions[a]);
                            } else {
                                if (!$scope.actions[0].is_deleted){
                                    $scope.selectAction($scope.actions[0]);
                                } else {
                                    if (!$scope.actions[a].is_deleted){
                                        $scope.selectAction($scope.actions[a]);
                                    } else {
                                        for (var i in $scope.actions){//select next non-deleted action
                                            if (!$scope.actions[i].is_deleted){
                                                $scope.selectAction($scope.actions[i]);
                                                $scope.$parent.$emit('hideLoader');
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                } else {
                    $scope.setDefaultActionSelected(0);
                }
                $scope.$parent.$emit('hideLoader');
            };
            var onFailure = function(data){
                $scope.$parent.$emit('hideLoader');
            };

            var data = {id:$scope.$parent.reservationData.reservation_card.reservation_id};
            $scope.invokeApi(rvActionTasksSrv.getActionsTasksList, data, onSuccess, onFailure);

        };
        
        
        $scope.isDeletePending = function(id, a){
            for (var i in a){
                if (a[i] === id){
                    return true;
                }
            } return false;
        };
        
        $scope.convertMilTime = function(milStr){
          //converts "16:10:00" into "04:10 PM"
            var str = milStr.split(' ');
            var strArray = str[1].split(':');
            var hour = strArray[0], min = strArray[1];
            return getFormattedTime(hour+''+min);
        };
        $scope.capped = function(str){
            if (str){
                var s = str.toLowerCase();
                s[0].toUpperCase();
            }
            return s;
        };
        
        $scope.eitherString = function(str, val){
            if (val){
                if (str === val){
                    return true;
                } else if (str === val.toUpperCase()){
                    return true;
                } else if (str === val.toLowerCase()){
                    return true;
                } else if (str === $scope.capped(val)){
                    return true;
                } else return false;
            } else return false;
        };
        
        $scope.isAlert = function(v){
           var str = 'ALERT';
           if ($scope.eitherString(str, v)){//checks all cases upper/lower/first letter cap
               return true;
           } else return false;
        };
        $scope.isRequest = function(v){
           var str = 'REQUEST';
           if ($scope.eitherString(str, v)){//checks all cases upper/lower/first letter cap
               return true;
           } else return false;
        };
        $scope.isTrace = function(v){
           var str = 'TRACE';
           if ($scope.eitherString(str, v)){//checks all cases upper/lower/first letter cap
               return true;
           } else return false;
        };

        $scope.fetchActionsList = function(){
            $scope.fetchDepartments();//store this to use in assignments of department
            var onSuccess = function(data){
                $scope.hotel_time = $scope.convertMilTime(data.business_date_time);

                var list = data.data;
                var matchObj;
                for (var x in list){
                    if (list[x].assigned_to !== null){
                        list[x].assigned = true;
                    } else {
                        list[x].assigned = false;
                    }
                    if (typeof list[x].time_due === typeof 'string'){
                        matchObj = getTimeObj(list[x].time_due);
                        list[x].due_at_time = matchObj;

                    } else {
                        list[x].due_at_time = $scope.timeFieldValue[0];
                    }
                    if (typeof list[x].due_at === typeof 'string'){
                        list[x].due_at_date = getFormattedDate(list[x].due_at, 'due_at_date');
                        list[x].hasDate = true;
                    } else {
                        list[x].hasDate = false;
                    }

                    if (list[x].action_status === "COMPLETED"){
                        list[x].isCompleted = true;
                        list[x].date_completed = getFormattedDate(list[x].completed_at, 'date_completed');
                        list[x].time_completed = getCompletedTimeFromDateMilli(list[x].completed_at, 'time_completed');
                    }


                    if (list[x].created_at){
                        list[x].created_at_time = getTimeFromDateStr(list[x].created_at, 'created_at_time');
                        list[x].created_at_date = getStrParsedFormattedDate(list[x].created_at);
                    }
                    
                }
                $scope.actions = list;

                $scope.fetchActionsCount();
                $scope.setActionsHeaderInfo();
                $scope.setDefaultActionSelected(0);

                if ($scope.openingPopup){
                    setTimeout(function(){
                        $scope.initPopup();
                        $scope.$parent.$emit('hideLoader');
                    },400);
                }
                $scope.openingPopup = false;
            };
            var onFailure = function(data){
                $scope.$parent.$emit('hideLoader');
                $scope.setActionsHeaderInfo();
            };

            var data = {id:$scope.$parent.reservationData.reservation_card.reservation_id};
            $scope.invokeApi(rvActionTasksSrv.getActionsTasksList, data, onSuccess, onFailure);
        };

        var getTimeFromDateStr = function(d, via){
            var date = new Date(d);
            return formatTime(date.valueOf(), via);
        };
        var getCompletedTimeFromDateMilli = function(d, via){
            if (typeof d === typeof 'string'){
                return formatUserTime(parseInt(d), via);
            } else if (typeof d === typeof 12345){
                return formatUserTime(d, via);
            }
        };
        var getTimeFromDateMilli = function(d){
            if (typeof d === typeof 'string'){
                return formatTime(parseInt(d));
            } else if (typeof d === typeof 12345){
                return formatTime(d);
            }
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
        var getFormattedDate = function(d, via){
            var fullDate, day, month, year;
            if (typeof d === typeof 'string'){
                var dateInMilli = parseInt(d);
                fullDate = new Date(dateInMilli);

            } else if (typeof d === typeof 12345){
                fullDate = new Date(d);
            }
            day = fullDate.getDate();
            month = fullDate.getMonth()+1;
            year = fullDate.getFullYear();

            if (day < 10) {
             day = '0' + day;
            }
            if (month < 10) {
             month = '0' + month;
            }
            return month+'-'+day+'-'+year;
        };
        var getStrParsedFormattedDate = function(d){
            if (d){
                var dateStr = d.split('T');
                var month, day, year;
                var formatDate = dateStr[0].split('-');
                year = formatDate[0];
                month = formatDate[1];
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
        $scope.actionSelected = 'selected';
            ngDialog.close();
        }

        var formatUserTime = function(timeInMs, via) {
            var dt = new Date(timeInMs);
            var hours = dt.getHours();
            var minutes = dt.getMinutes();
            var seconds = dt.getSeconds();

            if (hours < 10) {
             hours = '0' + hours;
            }
            if (minutes < 10) {
             minutes = '0' + minutes;
            }
            if (seconds < 10) {
             seconds = '0' + seconds;
            }
            return getFormattedTime(hours+''+minutes);
        };
        var formatTime = function(timeInMs, via) {
            var dt = new Date(timeInMs);
            var hours, minutes,seconds;
            if (via === 'created_at_time'){
                     hours = dt.getHours();
                     minutes = dt.getMinutes();
                     seconds = dt.getSeconds();
             } else {
                     hours = dt.getHours();
                     minutes = dt.getMinutes();
                     seconds = dt.getSeconds();
             }

            if (hours < 10) {
             hours = '0' + hours;
            }
            if (minutes < 10) {
             minutes = '0' + minutes;
            }
            if (seconds < 10) {
             seconds = '0' + seconds;
            }
            return getFormattedTime(hours+''+minutes);

        };
        var getFormattedTime = function (fourDigitTime){
            var hours24 = parseInt(fourDigitTime.substring(0,2));
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? ' PM' : ' AM';
            var minutes = fourDigitTime.substring(2);
            if (typeof hours === typeof 2){
                if (hours < 10){
                    hours = '0'+hours;
                }
            }

            return hours + ':' + minutes + amPm;
        };
        $scope.populateTimeFieldValue = function(){
             var getFormattedTime = function (fourDigitTime){
                var hours24 = parseInt(fourDigitTime.substring(0,2));
                var hours = ((hours24 + 11) % 12) + 1;
                var amPm = hours24 > 11 ? ' PM' : ' AM';
                var minutes = fourDigitTime.substring(2);
                if (parseInt(hours) < 10){
                    hours = '0'+hours;
                }
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
        $scope.initPopup = function(){
            ngDialog.open({
                template: '/assets/partials/reservationCard/Actions/rvReservationCardActionsPopup.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                preCloseCallback:function(){
                    $scope.fetchActionsCount();
                }
            });
        };
        $scope.openActionsPopup = function() {
            $scope.openingPopup = true;
            $scope.fetchActionsList();
        };
        $scope.clearAssignSection = function(){
            $scope.departmentSelect.selected = {};
            $scope.closeSelectedCalendar();
            $scope.closeNewCalendar();
        };

        $scope.departmentSelect = {};
        $scope.assignDepartment = function(){
            var params = $scope.getBaseParams();
            if ($scope.departmentSelect.selected){
                params['assigned_to'] = $scope.departmentSelect.selected.value;
                params.action_task.id  = $scope.selectedAction.id;

                var onSuccess = function(){
                    //switch back to selected
                    $scope.actionSelected = 'selected';
                    $scope.lastSelectedItemId = params.action_task.id;
                    $scope.refreshActionList();
                    $scope.clearAssignSection();
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

        $scope.completeAction = function(del, selected){
            //mark the selected action as complete, notify the api
            var params = $scope.getBaseParams();
                params.action_task.id  = $scope.selectedAction.id;
                params.is_complete = true;
                var onSuccess = function(){
                    $scope.actions.totalCount--;
                    $scope.lastSelectedItemId = params.action_task.id;
                    $scope.refreshActionList(del, selected);
                };
                var onFailure = function(data){
                    if (data[0]){
                        $scope.errorMessage = data[0];
                    }
                    $scope.$parent.$emit('hideLoader');
                };

                $scope.invokeApi(rvActionTasksSrv.completeAction, params, onSuccess, onFailure);
        };

        $scope.assignAction = function(){
            $scope.actionSelected = 'assign';
        };

        $scope.reassignAction = function(){
            $scope.actionSelected = 'assign';
        };

        $scope.getBaseParams = function(){
            var params = {
                'reservation_id':$scope.$parent.reservationData.reservation_card.reservation_id,
                'action_task':{}
            };
            return params;
        };

        $scope.sortActionsList = function(list){
            //take an actions list and sort it by due date,
            // - but also put "completed" items @ the bottom
            // step 1. make two lists, (completed, not completed)
            // step 2. sort both lists
            // step 3. join lists, completed After not completed
            var completed = [], not_completed = [];
            for (var x in list){
                if (list[x].date_completed){
                    completed.push(list[x]);
                } else {
                    not_completed.push(list[x]);
                }
            };





        };


        init();
    }
]);