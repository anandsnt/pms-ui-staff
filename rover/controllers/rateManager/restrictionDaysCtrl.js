sntRover.controller('RestrictionDaysCtrl', ['$q', '$scope', 'ngDialog',
    function ($q, $scope, ngDialog) {
        $scope.init = function(){
            console.log("innit");
           console.log(JSON.stringify($scope.data.restrictionTypes));
        };
              
        $scope.init();
    }
]);