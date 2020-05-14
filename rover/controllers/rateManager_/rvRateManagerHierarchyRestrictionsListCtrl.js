angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionsListCtrl', [
        '$scope',
        'rvRateManagerHierarchyRestrictionsSrv',
        '$timeout',
        function(
            $scope,
            hierarchySrv,
            $timeout) {
                BaseCtrl.call(this, $scope);

                var setscroller = () => {
                    $scope.setScroller('hierarchyPopupListScroll');
                };

                var refreshScroller = function() {
                    $scope.refreshScroller('hierarchyPopupListScroll');
                };

                refreshScroller();

                let fetchRestrictionsListData = function() {
                    let params = {
                        'from_date': $scope.ngDialogData.date,
                        'to_date': $scope.ngDialogData.date,
                        'levels[]': $scope.ngDialogData.hierarchyLevel
                    };
                    let fetchRestrictionsListSuccessCallback = () => {
                        
                    };
                    let options = {
                        params: params,
                        onSuccess: fetchRestrictionsListSuccessCallback
                    };

                    $scope.callAPI(hierarchySrv.fetchRestrictionsListData, options);
                };
            }
    ]);
