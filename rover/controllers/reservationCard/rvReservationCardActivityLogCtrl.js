sntRover.controller('rvReservationCardActivityLogCtrl', ['$scope', '$filter', '$rootScope', '$state',
    function($scope, $filter, $rootScope , $state) {
       $scope.activityLog = "";

       var init = function(){
            
            var hideLog = true;
            $scope.activityLog = {
                hideDetails: hideLog
            }
        }
        $scope.showDetails = function(){
            $state.go('rover.reservation.staycard.activitylog');
        }
        init();
    }
]);