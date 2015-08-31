sntRover.controller('rvReservationCardActivityLogCtrl',
    ['$scope', '$filter','$stateParams', '$rootScope', '$state', '$timeout',
    function($scope, $filter,$stateParams, $rootScope , $state, $timeout) {
       $scope.activityLog = "";

       var init = function(){

            var hideLog = true;
            $scope.activityLog = {
                hideDetails: hideLog
            };
        };

        $scope.toggleActivityLogDetails = function() {
            $scope.activityLog.hideDetails = !$scope.activityLog.hideDetails;
            $scope.refreshScroller('resultDetails');
            $timeout(function(){
                $scope.$parent.myScroll['resultDetails'].scrollTo($scope.$parent.myScroll['resultDetails'].maxScrollX,
                    $scope.$parent.myScroll['resultDetails'].maxScrollY, 500);
            }, 500);

        };

        $scope.showDetails = function(){
            $state.go('rover.reservation.staycard.activitylog',{
                id: $stateParams.id
            });
        };
        init();
    }
]);