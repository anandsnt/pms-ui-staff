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
                
                $scope.clickedOnRemove = function( key, value, index ) {
                    console.log(key);
                    console.log(value);

                    let restrictionObj = {};
                    restrictionObj[key] = value ? value : restrictionObj.listData[key].value;

                    console.log(restrictionObj);

                    var params = {
                        from_date: $scope.ngDialogData.date,
                        to_date: $scope.ngDialogData.date,
                        restrictionObj
                    }, 
                    deleteSuccessCallback = () => {
                        if (value) {
                            delete restrictionObj.listData[key][index];
                        }
                        else {
                            delete restrictionObj.listData[key];
                        }
                    }, 
                    options = {
                        params: params,
                        onSuccess: deleteSuccessCallback
                    };

                    $scope.callAPI(hierarchySrv.deleteRestrictions, options);
                };

                setscroller();
                refreshScroller();
            }
    ]);
