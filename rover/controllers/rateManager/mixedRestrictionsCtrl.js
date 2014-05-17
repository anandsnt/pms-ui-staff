sntRover.controller('MixedRestrictionsCtrl', ['$q', '$scope', 'ngDialog',
    function ($q, $scope, ngDialog) {

        $scope.init = function(){
            $scope.daysEntered = 5;
        };

        $scope.updateRestrictionBtnClicked = function(id){
            console.log($scope.daysEntered);
            ngDialog.close();

            /*$scope.data.restrictionTypes[id].showEdit = false;
            $scope.data.restrictionTypes[id].days = $scope.daysEntered;
            $scope.data.restrictionTypes[id].isRestrictionEnabled = true;
            $scope.$parent.showRestrictionDayUpdate = false;*/
        };

        $scope.removeRestrictionBtnClicked = function(id){
            /*$scope.data.restrictionTypes[id].showEdit = false;
            $scope.data.restrictionTypes[id].isRestrictionEnabled = false;
            $scope.$parent.showRestrictionDayUpdate = false;*/

        };

        $scope.cancelButtonClicked = function(id){
        };
              
        $scope.init();
    }
]);