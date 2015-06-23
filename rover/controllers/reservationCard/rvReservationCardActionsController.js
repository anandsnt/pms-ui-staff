sntRover.controller('rvReservationCardActionsController', ['$scope', '$filter', '$rootScope', 'ngDialog', 'rvActionTasksSrv','$state',
    function($scope, $filter, $rootScope, ngDialog, rvActionTasksSrv, $state) {
        $scope.reservationNotes = "";
        /*
         *To save the reservation note and update the ui accordingly
         */
        $scope.actions = {};
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
        $scope.selectedAction.id;
        
        $scope.selectedActionMessage = '';
        $scope.selectedDepartment = '';
        
        var init = function() {
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
                console.warn('failed to get actions count');
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
            };
            var onFailure = function(data){
                console.warn('failed to get departments');
                $scope.$parent.$emit('hideLoader');
            };
            
            var data = {id:$scope.$parent.reservationData.reservation_card.reservation_id};
            $scope.invokeApi(rvActionTasksSrv.fetchDepartments, data, onSuccess, onFailure);
        };
        $scope.selectAction = function(a){
            var action = a;
            $scope.selectedAction = action;
            $scope.actionSelected = true;
        };
        $scope.actionSelected = false;
        $scope.fetchActionsList = function(){
            $scope.fetchDepartments();//store this to use in assignments of department
            var onSuccess = function(data){
                var list = data.data;
                for (var x in list){
                    if (list[x].due_at){
                        list[x].due_at_time = getTimeFromDateStr(list[x].due_at);
                        list[x].due_at_date = getFormattedDate(list[x].due_at);
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

        $scope.navigateToGroup = function(event) {
            if ($rootScope.isStandAlone && !!$scope.reservationData.reservation_card.group_id) {
                // Navigate to Groups
                $state.go('rover.groups.config', {
                    id: $scope.reservationData.reservation_card.group_id,
                    activeTab: "SUMMARY"
                });
            } else {
                event.preventDefault();
            }
        }

        $scope.saveReservationNote = function() {
            if (!$scope.$parent.isNewsPaperPreferenceAvailable()) {
                if (!$rootScope.isStandAlone) {
                    $scope.reservationnote = "";
                    $scope.$parent.showFeatureNotAvailableMessage();
                    return;
                }

            }
            var successCallBackReservationNote = function(data) {
                if (!data.is_already_existing) {
                    $scope.reservationnote = "";
                    data.topic = "GENERAL"; //$filter('translate')('DEFAULT_NOTE_TOPIC');
                    $scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice(0, 0, data);
                    $scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
                    refreshScroller();
                }
                $scope.$parent.$emit('hideLoader');
            };

            var params = {};
            params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
            params.text = $scope.reservationnote;
            params.note_topic = 1;
            $scope.invokeApi($scope.$parent.reservationCardSrv.saveReservationNote, params, successCallBackReservationNote);
        };

        /*
         *To delete the reservation note and update the ui accordingly
         */
        $scope.deleteReservationNote = function(index) {
            $scope.deletedNoteIndex = index;
            var successCallBackDeleteReservationNote = function(data) {
                $scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice($scope.deletedNoteIndex, 1);
                $scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
                $scope.$parent.$emit('hideLoader');
                refreshScroller();
            };

            var note_id = $scope.$parent.reservationData.reservation_card.notes.reservation_notes[index].note_id;
            $scope.invokeApi($scope.$parent.reservationCardSrv.deleteReservationNote, note_id, successCallBackDeleteReservationNote);
        };
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
        init();
    }
]);