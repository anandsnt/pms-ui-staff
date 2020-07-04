angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionsListCtrl', [
        '$scope',
        'rvRateManagerHierarchyRestrictionsSrv',
        'rvRateManagerUtilitySrv',
        '$timeout',
        'rvRateManagerEventConstants',
        function(
            $scope,
            hierarchySrv,
            hierarchyUtils,
            $timeout,
            rvRateManagerEventConstants) {
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
                                $scope.restrictionObj.noticeLabel = '';
                                $scope.restrictionObj.setOnCount = 0;
                                $scope.restrictionObj.enableEditRestrictions = true;
                                break;
                            case 'RoomType':
                                $scope.restrictionObj.listData = response.room_type[0].restrictions;
                                $scope.restrictionObj.noticeLabel = 'ALL ROOM TYPES';
                                $scope.restrictionObj.setOnCount = response.room_types_count;
                                // TODO : Remove while implementing ADD, EDIT stories
                                $scope.header.disableNewRestriction = false;
                                $scope.restrictionObj.enableEditRestrictions = false;
                                break;
                            case 'RateType':
                                $scope.restrictionObj.listData = response.rate_type[0].restrictions;
                                $scope.restrictionObj.noticeLabel = 'ALL RATE TYPES';
                                $scope.restrictionObj.setOnCount = response.rate_types_count;
                                // TODO : Remove while implementing ADD, EDIT stories
                                $scope.header.disableNewRestriction = false;
                                $scope.restrictionObj.enableEditRestrictions = true;
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
                $scope.clickedOnListItem = function(key, index) {
                    if ($scope.restrictionObj.enableEditRestrictions) {
                        let clickedItem = {};

                        $scope.popUpView = 'EDIT';
                        $scope.selectedRestriction = _.find(hierarchyUtils.restrictionColorAndIconMapping, 
                                                            function(item) { return item.key  === key; }
                                                    );
                        $scope.selectedRestriction.activeGroupList = [];
                        if ($scope.selectedRestriction.type === 'number') {
                            // min_length_of_stay, min_stay_through etc.
                            clickedItem = $scope.restrictionObj.listData[key][index];
                            $scope.selectedRestriction.value = clickedItem.value;
                            $scope.selectedRestriction.setOnValuesList = clickedItem.set_on_values;
                            $scope.selectedRestriction.activeGroupList = $scope.restrictionObj.listData[key];
                            $scope.selectedRestriction.activeGroupIndex = index;
                        }
                        else {
                            // closed, closed_arrival and closed_departure.
                            clickedItem = $scope.restrictionObj.listData[key];
                            $scope.selectedRestriction.value = null;
                            $scope.selectedRestriction.setOnValuesList = clickedItem.set_on_values || [];
                            $scope.selectedRestriction.activeGroupList.push(clickedItem);
                            $scope.selectedRestriction.activeGroupIndex = 0;
                        }
                        $scope.restrictionObj.isRepeatOnDates = false;
                        $scope.selectedRestriction.activeGroupKey = key;
                        $scope.$broadcast('INIT_SET_ON_SEARCH');
                        // Handle ON ALL checkbox selection.
                        if (clickedItem.set_on_values.length === $scope.restrictionObj.setOnCount) {
                            $scope.restrictionObj.isSetOnAllActive = true;
                        }
                        else {
                            $scope.restrictionObj.isSetOnAllActive = false;
                        }
                    }
                };

                /*  
                 *  @param {Object} [restriction object needed to be deleted]
                 *  @param {Array} [Ids of set on values to be deleted]
                 */
                const callRemoveAPI = (restrictions, setOnIdList) => {
                    let params = {
                        from_date: $scope.ngDialogData.date,
                        to_date: $scope.ngDialogData.date,
                        restrictions
                    };
                    let apiMethod = hierarchySrv.saveHouseRestrictions;

                    if (setOnIdList.length > 0) {
                        switch ($scope.ngDialogData.hierarchyLevel) {
                            case 'RoomType':
                                params.room_type_ids = setOnIdList;
                                apiMethod = hierarchySrv.saveRoomTypeRestrictions;
                                break;
                            case 'RateType':
                                params.rate_type_ids = setOnIdList;
                                apiMethod = hierarchySrv.saveRateTypeRestrictions;
                                break;

                            default:
                            break;
                        }
                    }
                    
                    if ($scope.restrictionObj.isRepeatOnDates) {
                        let selectedWeekDays = hierarchyUtils.getSelectedWeekDays($scope.restrictionObj.daysList);

                        if (selectedWeekDays.length > 0) {
                            params.weekdays = selectedWeekDays;
                        }
                        params.to_date = $scope.restrictionObj.untilDate;
                    }

                    const deleteSuccessCallback = () => {
                        fetchRestrictionList();
                        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
                    };

                    let options = {
                        params: params,
                        successCallBack: deleteSuccessCallback
                    };

                    $scope.callAPI(apiMethod, options);
                };

                /*
                 *  Handle delete button click on each item on LIST screen.
                 *  @param {String} ['closed', 'close_arrival' etc.]
                 *  @param {Boolean | null} [value will be false or null]
                 *  @param {Array | undefined} [set on list values]
                 */
                $scope.clickedOnRemove = function(key, value, setOnValuesList) {
                    let restrictions = {};
                    let setOnIdList = [];
                    
                    restrictions[key] = value;
                    if (setOnValuesList) {
                        setOnIdList = _.pluck(setOnValuesList, 'id');
                    }
                    callRemoveAPI(restrictions, setOnIdList);
                };

                // Process Remove action on EDIT screen.
                const processRemoveOnDates = () => {
                    let key = $scope.selectedRestriction.key;
                    let value = ($scope.selectedRestriction.type === 'number') ? null : false;
                    let restrictions = {};
                    let setOnIdList = [];

                    if ($scope.selectedRestriction.setOnValuesList) {
                        setOnIdList = _.pluck($scope.selectedRestriction.setOnValuesList, 'id');
                    }

                    restrictions[key] = value;
                    callRemoveAPI(restrictions, setOnIdList);
                };

                setscroller();
                fetchRestrictionList();

                $scope.addListener('RELOAD_RESTRICTIONS_LIST', fetchRestrictionList);
                $scope.addListener('CLICKED_REMOVE_ON_DATES', processRemoveOnDates);
            }
    ]);
