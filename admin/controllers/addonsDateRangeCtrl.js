admin.controller('addonsDatesRangeCtrl',
    [
        '$scope',
        '$rootScope',
        '$filter',
        'ngDialog',
        function($scope, $rootScope, $filter, ngDialog) {

            // quick reference to the underlaying page $scope
            $scope.parentScope = $scope.$parent.$parent;

            BaseCtrl.call(this, $scope);

            // link everthing
            $scope.dateNeeded = $scope.parentScope.dateNeeded;

            if ( $scope.parentScope.dateNeeded === 'From' ) {
                $scope.datePickerDate = $scope.parentScope.singleAddon.begin_date
                // from date should be from business date
                $scope.minDate = $rootScope.businessDate;
            } else {
                $scope.datePickerDate = $scope.parentScope.singleAddon.end_date;
                $scope.minDate = $scope.parentScope.singleAddon.begin_date;
            }

            $scope.dateOptions = {
                changeYear: true,
                changeMonth: true,
                minDate: tzIndependentDate($scope.minDate),
                onSelect: function(dateText, inst) {
                     // emit choosen date back
                    $scope.$emit('datepicker.update', $scope.datePickerDate);
                    ngDialog.close();
             }
            }


            $scope.cancelClicked = function() {
                ngDialog.close();
            };

            $scope.resetDate =  function(){
                 // emit choosen date back
                $scope.$emit('datepicker.reset', $scope.datePickerDate);
                ngDialog.close();
            }
        }
    ]
);