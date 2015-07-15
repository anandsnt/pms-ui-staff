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
            var currentSelected = $scope.data.restrictionTypes[id];
            currentSelected.isRestrictionEnabled = true;
            currentSelected.hasChanged = true;
            currentSelected.isMixed = false;

            if($scope.options.daysEntered !== undefined && $scope.options.daysEntered !== null){
                currentSelected.days = $scope.options.daysEntered == "" ? "" : parseInt($scope.options.daysEntered);
            }
            collapseCurrentSelectedView(currentSelected);

        };

        /**
        * Click handle for 'Remove restriction' button
        * Updates the data modal in parent with the disable status
        * Updates the data modal in parent with days as empty
        */
        $scope.removeRestrictionBtnClicked = function(id){
            var currentSelected = $scope.data.restrictionTypes[id];
            currentSelected.isRestrictionEnabled = false;
            currentSelected.hasChanged = true;
            currentSelected.isMixed = false;

            if($scope.options.daysEntered !== undefined && $scope.options.daysEntered !== null){
                currentSelected.days = '';
            }
            collapseCurrentSelectedView(currentSelected);
        };

        $scope.cancelButtonClicked = function(id){
            collapseCurrentSelectedView($scope.data.restrictionTypes[id]);
        };

        /**
        * Collapses the selected restriction edit view
        */
        var collapseCurrentSelectedView = function(currentSelected) {
            $scope.data.showEditView = false;
            currentSelected.showEdit = false;
            $(".ngdialog-content").removeClass("data-entry");
            $scope.options.daysEntered = '';
            $scope.updatePopupWidth();


        };

        $scope.init();
    }
]);