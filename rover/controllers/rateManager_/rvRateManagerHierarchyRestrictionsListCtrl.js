angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionsListCtrl', [
        '$scope',
        'rvRateManagerHierarchyRestrictionsSrv',
        function(
            $scope,
            hierarchySrv) {
                BaseCtrl.call(this, $scope);

                const setscroller = () => {
                    $scope.setScroller('hierarchyPopupListScroll');
                };

                const refreshScroller = function() {
                    $scope.refreshScroller('hierarchyPopupListScroll');
                };

                const checkEmptyOrListView = function( listData ) {
                    let isEmptyList = _.isEmpty(listData);
                    let view = isEmptyList ? 'EMPTY' : 'LIST';

                    return view;
                };

                const fetchRestrictionList = () => {
                    const fetchRestrictionsListSuccessCallback = ( response ) => {
                        $scope.errorMessage = '';
                        switch ($scope.ngDialogData.hierarchyLevel) {
                            case 'House':
                                $scope.restrictionObj.listData = response.house[0].restrictions;
                                break;

                            default:
                            break;
                        }
                        refreshScroller();
                        $scope.popUpView = checkEmptyOrListView($scope.restrictionObj.listData);
                    };
                    const fetchRestrictionsFailureCallback = (errorMessage) => {
                        $scope.errorMessage = errorMessage;
                    };

                    let params = {
                        'from_date': $scope.ngDialogData.date,
                        'to_date': $scope.ngDialogData.date,
                        'levels[]': $scope.ngDialogData.hierarchyLevel
                    };
                    let options = {
                        params: params,
                        onSuccess: fetchRestrictionsListSuccessCallback,
                        failureCallBack: fetchRestrictionsFailureCallback
                    };

                    $scope.callAPI(hierarchySrv.fetchHierarchyRestrictions, options);
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
                        $scope.errorMessage = '';
                        if (value && index) {
                            delete $scope.restrictionObj.listData[key][index];
                        }
                        else {
                            delete $scope.restrictionObj.listData[key];
                        }
                    };

                    const deleteFailureCallback = (errorMessage) => {
                        $scope.errorMessage = errorMessage;
                    };

                    let options = {
                        params: params,
                        successCallBack: deleteSuccessCallback,
                        failureCallBack: deleteFailureCallback
                    };

                    $scope.callAPI(hierarchySrv.deleteRestrictions, options);
                };

                setscroller();
                fetchRestrictionList();

                $scope.addListener('RELOAD_RESTRICTIONS_LIST', fetchRestrictionList);
            }
    ]);
