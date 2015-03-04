sntRover.controller('rvReservationCardActivityLogCtrl', ['$scope', '$filter', '$rootScope',
    function($scope, $filter, $rootScope) {
       $scope.activityLog = "";

       var init = function(){
            
            var hideLog = true;
            $scope.activityLog = {
                hideDetails: hideLog
            }
        }
        init();
    }
]);