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
                
                /*
                 *  Handle delete button click
                 *  @param {String} ['closed', 'close_arrival' etc.]
                 *  @param {Number | null} [ value of 'min_length_of_stay', 'max_length_of_stay' etc.]
                 *  @param {Number | null} [ index of clicked item in 'min_length_of_stay', 'max_length_of_stay' etc.]
                 */
                $scope.clickedOnRemove = function( key, value, index ) {
                    let restrictions = {};
                    restrictions[key] = value ? value : $scope.restrictionObj.listData[key].value;

                    let params = {
                        from_date: $scope.ngDialogData.date,
                        to_date: $scope.ngDialogData.date,
                        restrictions
                    };

                    const deleteSuccessCallback = () => {
                        $scope.$parent.errorMessage = '';
                        if (value && index) {
                            delete $scope.restrictionObj.listData[key][index];
                        }
                        else {
                            delete $scope.restrictionObj.listData[key];
                        }
                    };

                    const deleteFailureCallback = (errorMessage) => {
                        $scope.$parent.errorMessage = errorMessage;
                    };

                    let options = {
                        params: params,
                        successCallBack: deleteSuccessCallback,
                        failureCallBack: deleteFailureCallback
                    };

                    $scope.callAPI(hierarchySrv.deleteRestrictions, options);
                };

                setscroller();
                refreshScroller();
            }
    ]);
