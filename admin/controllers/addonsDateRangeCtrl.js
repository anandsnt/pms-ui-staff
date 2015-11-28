admin.controller('addonsDatesRangeCtrl',
    [
        '$scope',
        '$rootScope',
        '$filter',
        'ngDialog',
        function($scope, $rootScope, $filter, ngDialog) {

            // quick reference to the underlaying page $scope
            $scope.parentScope = $scope.$parent; // CICO-22499 Shoddy Fix -- If time permits ;) Visit again

            BaseCtrl.call(this, $scope);

            // link everthing
            $scope.dateNeeded = $scope.parentScope.dateNeeded;
            if ( $scope.parentScope.dateNeeded === 'From' ) {
                $scope.datePickerDate = $scope.parentScope.singleAddon.begin_date;
            } else {
                $scope.datePickerDate = $scope.parentScope.singleAddon.end_date;
            }

            $scope.dateOptions = {
                changeYear: true,
                changeMonth: true,
                minDate: tzIndependentDate($rootScope.businessDate),
                onSelect: function(dateText, inst) {
                     // emit choosen date back
                    $scope.$emit('datepicker.update', $scope.datePickerDate);
                    ngDialog.close();
             }
            };


            $scope.cancelClicked = function() {
                ngDialog.close();
            };

            $scope.resetDate =  function(){
                 // emit choosen date back
                $scope.$emit('datepicker.reset', $scope.datePickerDate);
                ngDialog.close();
            };
        }
    ]
);