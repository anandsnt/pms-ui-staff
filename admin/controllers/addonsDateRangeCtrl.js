admin.controller('addonsDatesRangeCtrl',
    [
        '$scope',
        '$rootScope',
        '$filter',
        'dateFilter',
        'ngDialog',
        function($scope, $rootScope, $filter, dateFilter, ngDialog) {

            // quick reference to the underlaying page $scope
            $scope.parentScope = $scope.$parent.$parent;

            BaseCtrl.call(this, $scope);

            // link everthing
            $scope.dateNeeded = $scope.parentScope.dateNeeded;

            if ( $scope.parentScope.dateNeeded === 'From' ) {
                $scope.datePickerDate = dateFilter( new Date($scope.parentScope.singleAddon.begin_date), 'yyyy-MM-dd' );

                // from date should be from business date
                // and must be of the format 'yyyy-MM-dd'
                $scope.fromDate = dateFilter( new Date($scope.parentScope.businessDate), 'yyyy-MM-dd' );
            } else {
                $scope.datePickerDate = dateFilter( new Date($scope.parentScope.singleAddon.end_date), 'yyyy-MM-dd' );

                $scope.fromDate = dateFilter(new Date($scope.parentScope.singleAddon.begin_date), 'yyyy-MM-dd');
            }

            $scope.updateClicked = function() {

                // emit choosen date back
                $scope.$emit('datepicker.update', $scope.datePickerDate);
                ngDialog.close();
           };

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