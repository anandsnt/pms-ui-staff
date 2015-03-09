sntRover.controller('rvReservationCardActivityLogCtrl', ['$scope', '$filter','$stateParams', '$rootScope', '$state',
    function($scope, $filter,$stateParams, $rootScope , $state) {
       $scope.activityLog = "";
      
       var init = function(){
            
            var hideLog = true;
            $scope.activityLog = {
                hideDetails: hideLog
            }
        }
        $scope.showDetails = function(){
            $state.go('rover.reservation.staycard.activitylog',{
                id: $stateParams.id
            });
        }
        init();
    }
]);