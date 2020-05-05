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
                        hierarchyType: '',
                        disableNewRestriction: false
                    };
                    // The below variable can have one of four values: EMPTY/LIST/NEW/EDIT
                    $scope.popUpView = '';
                    $scope.selectedRestriction = {};
                    $scope.restrictionStylePack = hierarchyUtils.restrictionColorAndIconMapping;
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
                };

                $scope.restrictionSelected = (restriction) => {
                    if (!_.isEmpty($scope.selectedRestriction)) {
                        $scope.selectedRestriction.value = null;
                    }
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
