angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionsListCtrl', [
        '$scope',
        'rvRateManagerHierarchyRestrictionsSrv',
        'rvRateManagerUtilitySrv',
        '$timeout',
        function(
            $scope,
            hierarchySrv,
            hierarchyUtils,
            $timeout) {
                BaseCtrl.call(this, $scope);

                const setscroller = () => {
                    $scope.setScroller('hierarchyPopupListScroll');
                };

                const refreshScroller = function() {
                    $timeout(function () {
                        $scope.refreshScroller('hierarchyPopupListScroll');
                    }, 500);
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
                        $scope.popUpView = checkEmptyOrListView($scope.restrictionObj.listData);
                        refreshScroller();
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
                 *  Handle list item click
                 *  @param {String} ['closed', 'close_arrival' etc.]
                 *  @param {Number | null} [ index of clicked item in 'min_length_of_stay', 'max_length_of_stay' etc.]
                 */
                $scope.clickedOnListItem = function(key, index ) {
                    let clickedItem = index ? $scope.restrictionObj.listData[key][index] : $scope.restrictionObj.listData[key];

                    $scope.popUpView = 'EDIT';
                    $scope.selectedRestriction = _.find(hierarchyUtils.restrictionColorAndIconMapping, 
                                                        function(item) { return item.key  === key; }
                                                );
                    $scope.selectedRestriction.value = clickedItem.value || clickedItem[0].value;
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

                const processRemoveOnDates = () => {
                    console.log($scope.selectedRestriction);
                    console.log($scope.restrictionObj);

                    
                };

                setscroller();
                fetchRestrictionList();

                $scope.addListener('RELOAD_RESTRICTIONS_LIST', fetchRestrictionList);
                $scope.addListener('CLICKED_REMOVE_ON_DATES', processRemoveOnDates);
            }
    ]);
