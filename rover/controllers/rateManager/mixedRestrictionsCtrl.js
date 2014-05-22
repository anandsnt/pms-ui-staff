sntRover.controller('MixedRestrictionsCtrl', ['$q', '$scope', 'ngDialog',
    function ($q, $scope, ngDialog) {

        $scope.init = function(){
            $scope.options = {};
            $scope.options.daysEntered = '';
        };

        /**
        * Click handle for 'Set restriction' button
        * Updates the data modal in parent with the enable status 
        * Update the data modal with the days entered in the box 
        */
        $scope.updateRestrictionBtnClicked = function(id){
            $scope.data.restrictionTypes[id].isRestrictionEnabled = true;
            if($scope.data.restrictionTypes[id].days !== undefined){
                $scope.data.restrictionTypes[id].days = parseInt($scope.options.daysEntered);
            }
            //Call parent method to save the restriction
            $scope.saveRestriction();
        };

        /**
        * Click handle for 'Remove restriction' button
        * Updates the data modal in parent with the disable status 
        * Updates the data modal in parent with days as empty
        */
        $scope.removeRestrictionBtnClicked = function(id){
            $scope.data.restrictionTypes[id].isRestrictionEnabled = false;
            if($scope.data.restrictionTypes[id].days !== undefined){
                $scope.data.restrictionTypes[id].days = '';
            }
            //Call parent method to save the restriction
            $scope.saveRestriction();
        };

        $scope.cancelButtonClicked = function(id){
            ngDialog.close();
        };
              
        $scope.init();
    }
]);