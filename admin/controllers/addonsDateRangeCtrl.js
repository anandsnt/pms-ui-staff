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
                $scope.datePickerDate = new Date($scope.parentScope.singleAddon.begin_date);

                // today should be business date, currently not avaliable
                $scope.fromDate = dateFilter( new Date(), 'yyyy-MM-dd' );
            } else {
                $scope.datePickerDate = new Date($scope.parentScope.singleAddon.end_date);

                var begin = new Date( $scope.parentScope.singleAddon.begin_date );
                $scope.fromDate = dateFilter(begin, 'yyyy-MM-dd');
            }

            $scope.updateClicked = function() {

                // emit choosen date back
                $scope.$emit('datepicker.update', $scope.datePickerDate);
                ngDialog.close();
           };

            $scope.cancelClicked = function() {
                ngDialog.close();
            };
        }
    ]
);