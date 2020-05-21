angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionsPopupCtrl', [
        '$scope',
        '$rootScope',
        'rvRateManagerEventConstants',
        'ngDialog',
        'rvRateManagerUtilitySrv',
        'rvRateManagerHierarchyRestrictionsSrv',
        '$timeout',
        function(
            $scope,
            $rootScope,
            rvRateManagerEventConstants,
            ngDialog,
            hierarchyUtils,
            hierarchySrv,
            $timeout) {
                BaseCtrl.call(this, $scope);

                var setscroller = () => {
                    $scope.setScroller('hierarchyPopupFormScroll');
                };

                var refreshScroller = function() {
                    $scope.refreshScroller('hierarchyPopupFormScroll');
                };

                const checkEmptyOrListView = function( listData ) {
                    let isEmptyList = _.isEmpty(listData);
                    let view = isEmptyList ? 'EMPTY' : 'LIST';

                    return view;
                };

                /**
                 * Function for initializing of dialogue variables
                 */
                var initializeScopeVariables = () => {
                    $scope.header = {
                        date: '',
                        hierarchyType: '',
                        disableNewRestriction: false
                    };

                    $scope.popUpView = 'LIST';
                    $scope.selectedRestriction = {};
                    $scope.restrictionStylePack = [];
                    $scope.restrictionObj = {
                        isRepeatOnDates: false,
                        daysList: hierarchyUtils.repeatOnDatesList,
                        cellDate: $scope.ngDialogData.date,
                        untilDate: '',
                        listData: $scope.ngDialogData.listData
                    };
                },
                initialiseFirstScreen = () => {
                    // as part of CICO-75894 we are always showing the first screen as empty.
                    // the below code must be changed when the story to view restrictions is taken up.
                    // There may be code, but for now, the following one line will do
                    $scope.popUpView = checkEmptyOrListView($scope.restrictionObj.listData);
                };

                $scope.initiateNewRestrictionForm = () => {
                    // trigger Restriction setting window
                    $scope.popUpView = 'NEW';
                    $scope.restrictionStylePack = angular.copy(hierarchyUtils.restrictionColorAndIconMapping);
                    $scope.showRestrictionSelection = false;
                };

                var setHouseRestrictionDataForPopup = () => {
                    $scope.header.hierarchyType = $scope.ngDialogData.hierarchyLevel;
                    $scope.header.date = moment($scope.ngDialogData.date).format('dddd, MMMM DD');
                    $scope.header.disableNewRestriction = $rootScope.businessDate > $scope.ngDialogData.date;
                };

                $scope.showPlaceholder = () => {
                    return _.isEmpty($scope.selectedRestriction);
                };

                $scope.showNights = () => {
                   return !$scope.showPlaceholder() && $scope.selectedRestriction.type === 'number';
                };

                $scope.toggleRestrictionSelection = () => {
                    $scope.showRestrictionSelection = !$scope.showRestrictionSelection;
                    refreshScroller();
                };

                $scope.restrictionSelected = (restriction) => {
                    if (!_.isEmpty($scope.selectedRestriction)) {
                        $scope.selectedRestriction.value = null;
                    }
                    $scope.selectedRestriction = restriction;
                    $scope.toggleRestrictionSelection();
                    $scope.$broadcast('SCROLL_REFRESH_REPEAT_ON_DATES');
                };

                // Check repeat on dates fields are valid.
                let isRepeatOnDatesValid = () => {
                    return ($scope.restrictionObj && $scope.restrictionObj.isRepeatOnDates && $scope.restrictionObj.untilDate === '');
                };

                $scope.validateForm = () => {
                    var formValid;

                    if ($scope.showPlaceholder() || isRepeatOnDatesValid()) {
                        formValid = false;
                    }
                    else {
                        // CICO-75894
                        if ($scope.selectedRestriction.type === "boolean") {
                            formValid = true;
                        }
                        else if ($scope.selectedRestriction.type === 'number') {
                            // Allow zero and positive values
                            formValid = /^[1-9]\d*$/.test($scope.selectedRestriction.value);
                        }
                        else {
                            formValid = false;
                        }
                    }
                    return formValid;
                };

                // Utility method to pick up selected week days for API.
                let getSelectedWeekDays = function() {
                    let weekDays = [];

                    _.each($scope.restrictionObj.daysList, function( day ) {
                        if (day.isChecked) {
                            weekDays.push(day.value);
                        }
                    });

                    return weekDays;
                };

                $scope.setHouseHierarchyRestriction = () => {
                    var restrictions = {};

                    restrictions[$scope.selectedRestriction.key] = $scope.selectedRestriction.type === 'number' ? Math.round($scope.selectedRestriction.value) : true;
                    var params = {
                        from_date: $scope.ngDialogData.date,
                        to_date: $scope.ngDialogData.date,
                        restrictions 
                    }, houseRestrictionSuccessCallback = () => {
                        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
                        $scope.closeDialog();
                    }, options = {
                        params: params,
                        onSuccess: houseRestrictionSuccessCallback
                    };
                
                    if ($scope.restrictionObj.isRepeatOnDates) {
                        let selectedWeekDays = getSelectedWeekDays();

                        if (selectedWeekDays.length > 0) {
                            options.params.weekdays = selectedWeekDays;
                        }
                        options.params.to_date = $scope.restrictionObj.untilDate;
                    }

                    $scope.callAPI(hierarchySrv.saveHouseRestrictions, options);
                };

                $scope.backToInitialScreen = () => {
                    $scope.selectedRestriction = {};
                    initialiseFirstScreen();
                };
                /*
                * To close dialog box
                */
                $scope.closeDialog = function() {
                    $rootScope.modalClosing = true;
                    $timeout(function () {
                        ngDialog.close();
                        $rootScope.modalClosing = false;
                        window.scrollTo(0, 0);
                        document.getElementById("rate-manager").scrollTop = 0;
                        document.getElementsByClassName("pinnedLeft-list")[0].scrollTop = 0;
                    }, 700);
                };

                // Handle click on Repeat on dates checkbox.
                $scope.clickedOnRepeatOnDates = function() {
                    $scope.restrictionObj.isRepeatOnDates = !$scope.restrictionObj.isRepeatOnDates;
                    $scope.$broadcast('CLICKED_REPEAT_ON_DATES');
                };

                // Set the label name for SET or SET Dates button.
                $scope.getSetButtonLabel = function() {
                    let label = 'Set';

                    if ($scope.restrictionObj.isRepeatOnDates) {
                        label = 'Set on date(s)';
                    }

                    return label;
                };

                var initController = () => {
                    initializeScopeVariables();
                    setscroller();
                    refreshScroller();

                    switch ($scope.ngDialogData.hierarchyLevel) {
                        case 'House':
                            setHouseRestrictionDataForPopup();
                            break;

                        default:
                            break;
                    }
                };

                initController();
            }
    ]);
