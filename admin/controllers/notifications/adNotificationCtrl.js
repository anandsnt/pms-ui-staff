admin.controller('ADNotificationCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADServiceProviderSrv','ngTableParams', '$filter', 'ngDialog', function($scope, $state,$rootScope, $stateParams, ADServiceProviderSrv, ngTableParams, $filter, ngDialog){
    BaseCtrl.call(this, $scope);    

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        onSelect: function(date, context) {
            $scope.notification.activates_at =  $filter('date')(tzIndependentDate(date), 'MM-dd-yyyy');
            ngDialog.close();
        }
    };

    var init = function() {
    $scope.notification = {};
    $scope.notification.action_type="LINK";
    };

    $scope.popupCalendar = function() {
            ngDialog.open({
                template: '/assets/partials/rates/addonsDateRangeCalenderPopup.html',
                controller: '',
                className: 'ngdialog-theme-default single-date-picker',
                closeByDocument: true,
                scope: $scope
            });
        };


    $scope.back = function(){
        //TODO
    };
    $scope.save = function(notification){
        console.log(notification);
    }

    init();


}]);