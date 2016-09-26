admin.controller('ADNotificationCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADNotificationsListSrv','ngTableParams', '$filter', 'ngDialog', function($scope, $rootScope,$state, $stateParams, ADNotificationsListSrv, ngTableParams, $filter, ngDialog){
    BaseCtrl.call(this, $scope);    

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        onSelect: function(date, context) {            
            $scope.notification.activates_at =  $filter('date')(tzIndependentDate(date), 'yyyy-MM-dd');
            //Selected date
            $scope.datePickerDate = new Date(date);
            ngDialog.close();
        }
    };
    
    var init = function() {
        $scope.notification = {};
        if(!!$stateParams.id)
        {   //Editing Notification
            $scope.notification.id = $stateParams.id;
            fetchNotification($scope.notification.id);

        }else{//Adding new Notification            
            $scope.notification.action_type="LINK";
            //default value
            $scope.notification.pms_type = "BOTH";
        }    
    };
    // returns no of days
    var getDuration = function(activates_at, expires_at){
        var activates_at = new Date(activates_at);
        var expires_at = new Date(expires_at);
        var timeDiff = Math.abs(expires_at.getTime() - activates_at.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return (diffDays-1);
    };

    var fetchNotification = function(id){
        var fetchSuccess = function(data){
            $scope.notification.message = data.message;
            $scope.notification.activates_at = $filter('date')(tzIndependentDate(data.activates_at), 'yyyy-MM-dd');
            $scope.notification.duration = getDuration(data.activates_at,$filter('date')(tzIndependentDate(data.expires_at), 'yyyy-MM-dd'));
            $scope.notification.pms_type = data.pms_type;
            $scope.notification.action_source = data.action_source;
            $scope.$emit('hideLoader');
        };
        var fetchFailed = function(err){
            $scope.errorMessage = err;
            $scope.$emit('hideLoader');
        }
        $scope.invokeApi(ADNotificationsListSrv.fetchNotification, id, fetchSuccess, fetchFailed);
    }
    //return a date string in the format of yyyy-MM-dd 00:00:00 (API expects this format)
    var formatActivatesAtDate = function(date){        
        return date + " 00:00:00";
    };
    //return a date string in the format of yyyy-MM-dd 23:59:59 (API expects this format)
    var formatExpiresAtDate = function(activates_at, duration){
        if(duration !=0){       
            var activates_at = new Date(activates_at);
            var expires_at = new Date(activates_at.getTime() + (duration*1000 * 60 * 60 * 24));
            expires_at = $filter('date')(tzIndependentDate(expires_at), 'yyyy-MM-dd') +" 23:59:59";
            return expires_at;
        }else{
            return null;
        }
    };
    // return params for api.
    var getParams = function(notification){
        params = {
            hotel_uuid: null,
            message: notification.message,
            activates_at: (!!notification.activates_at)?formatActivatesAtDate(notification.activates_at):null,
            expires_at: (!!notification.activates_at)?formatExpiresAtDate(notification.activates_at, notification.duration):null,
            action_type: "LINK",
            action_source: notification.action_source,
            pms_type: notification.pms_type,
            is_by_user: true,
            user_uuids: []
        };
        return params;
    };

    $scope.popupCalendar = function() {
        ngDialog.open({
            template: '/assets/partials/rates/addonsDateRangeCalenderPopup.html',
            className: 'ngdialog-theme-default single-date-picker',
            closeByDocument: true,
            scope: $scope
        });
    };
    $scope.back = function(){
       $state.go('admin.notifications');
    };
    //save Notification
    $scope.save = function(notification){
        var saveFailed = function(err){
            $scope.errorMessage = err;
            $scope.$emit('hideLoader');
        }       
        if(!!notification.id){
            var params = {
                id : $scope.notification.id,
                params : getParams(notification)
            }
            $scope.invokeApi(ADNotificationsListSrv.updateNotification, params, $scope.back, saveFailed);        
        }else{
            var params = getParams(notification);
            $scope.invokeApi(ADNotificationsListSrv.createNotification, params, $scope.back, saveFailed);
        }
    };
    //Starts Here
    init();


}]);