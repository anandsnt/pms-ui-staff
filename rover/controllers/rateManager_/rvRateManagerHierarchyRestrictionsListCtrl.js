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

                const setscroller = () => {
                    $scope.setScroller('hierarchyPopupListScroll');
                };

                const refreshScroller = function() {
                    $scope.refreshScroller('hierarchyPopupListScroll');
                };

                $scope.clickedOnRemove = function( key, value, index ) {
                    let restrictions = {};
                    restrictions[key] = value ? value : $scope.restrictionObj.listData[key].value;

                    let params = {
                        from_date: $scope.ngDialogData.date,
                        to_date: $scope.ngDialogData.date,
                        restrictions
                    };

                    const deleteSuccessCallback = () => {
                        if (value && index) {
                            delete $scope.restrictionObj.listData[key][index];
                        }
                        else {
                            delete $scope.restrictionObj.listData[key];
                        }
                    };

                    let options = {
                        params: params,
                        onSuccess: deleteSuccessCallback
                    };

                    $scope.callAPI(hierarchySrv.deleteRestrictions, options);
                };

                setscroller();
                refreshScroller();
            }
    ]);
