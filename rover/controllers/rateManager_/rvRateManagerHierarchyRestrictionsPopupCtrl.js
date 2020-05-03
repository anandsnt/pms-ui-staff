angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionsPopupCtrl', [
        '$scope',
        '$rootScope',
        'rvRateManagerEventConstants',
        'ngDialog',
        'rvRateManagerUtilitySrv',
        'rvRateManagerHierarchyRestrictionsSrv',
        function(
            $scope,
            $rootScope,
            rvRateManagerEventConstants,
            ngDialog,
            hierarchyUtils,
            hierarchySrv) {
                BaseCtrl.call(this, $scope);

                /**
                 * Function for initializing of dialogue variables
                 */
                var initializeScopeVariables = () => {
                    $scope.header = {
                        date: '',
                        hierarchyType: ''
                    };
                    // The below variable can have one of four values: EMPTY/LIST/NEW/EDIT
                    $scope.popUpView = '';
                    $scope.selectedRestriction = {};
                    $scope.restrictionStylePack = hierarchyUtils.restrictionColorAndIconMapping;
                    $scope.restrictionObj = {
                        isRepeatOnDates: false,
                        daysList: hierarchyUtils.repeatOnDatesList,
                        untilDate: ''
                    };
                }, initialiseFirstScreen = () => {
                    // as part of CICO-75894 we are always showing the first screen as empty.
                    // the below code must be changed when the story to view restrictions is taken up.
                    // There may be code, but for now, the following one line will do
                    $scope.popUpView = 'EMPTY';
                };

                $scope.initiateNewRestrictionForm = () => {
                    // trigger Restriction setting window
                    $scope.popUpView = 'NEW';
                    $scope.showRestrictionSelection = false;
                };

                var setHouseRestrictionDataForPopup = () => {
                    $scope.header.hierarchyType = $scope.ngDialogData.hierarchyLevel;
                    $scope.header.date = moment($scope.ngDialogData.date).format('dddd, MMMM DD');
                };

                $scope.showPlaceholder = () => {
                    return _.isEmpty($scope.selectedRestriction);
                };

                $scope.showNights = () => {
                   return !$scope.showPlaceholder() && $scope.selectedRestriction.type === 'number';
                };

                $scope.toggleRestrictionSelection = () => {
                    $scope.showRestrictionSelection = !$scope.showRestrictionSelection;
                };

                $scope.restrictionSelected = (restriction) => {
                    $scope.selectedRestriction = restriction;
                    $scope.toggleRestrictionSelection();
                };

                $scope.validateForm = () => {
                    var formValid;

                    if ($scope.showPlaceholder()) {
                        formValid = false;
                    }
                    else {
                        // CICO-75894
                        formValid = (
                            $scope.selectedRestriction.type === 'number' &&
                            $scope.selectedRestriction.value &&
                            $scope.selectedRestriction.value > 0
                        ) || $scope.selectedRestriction.type === "boolean";
                    }
                    return formValid;
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
                    setTimeout(function() {
                    ngDialog.close();
                    $rootScope.modalClosing = false;
                    window.scrollTo(0, 0);
                    document.getElementById("rate-manager").scrollTop = 0;
                    document.getElementsByClassName("pinnedLeft-list")[0].scrollTop = 0;
                    $scope.$apply();
                    }, 700);
                };

                $scope.clickedOnRepeatOnDates = function() {
                    $scope.restrictionObj.isRepeatOnDates = !$scope.restrictionObj.isRepeatOnDates;
                };

                $scope.checkedEachDay = function( index ) {
                    $scope.restrictionObj.daysList[index] = !$scope.restrictionObj.daysList[index];
                };

                let checkAllDaysChecked = function() {
                    let isAllDaysChecked = true;
                    _.each($scope.restrictionObj.daysList, function( day ){
                        if (!day.isChecked) {
                            isAllDaysChecked = false;
                            return isAllDaysChecked;
                        }
                    });

                    return isAllDaysChecked;
                };

                let checkNoDaysChecked = function() {
                    let isNoDaysChecked = true;
                    _.each($scope.restrictionObj.daysList, function( day ){
                        if (day.isChecked) {
                            isNoDaysChecked = false;
                            return isNoDaysChecked;
                        }
                    });

                    return isNoDaysChecked;
                };

                $scope.generateButtonText = function() {
                    let text = 'Select All';

                    if (checkAllDaysChecked()) {
                        text = 'Clear All';
                    }
                    return text;
                };

                $scope.getButtonClass = function() {
                    let className = 'brand-text';

                    if (checkAllDaysChecked()) {
                        className = 'red-text';
                    }
                    return className;
                };

                var initController = () => {
                    initializeScopeVariables();
                    initialiseFirstScreen();

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
