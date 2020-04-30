angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionsPopupCtrl', [
        '$scope',
        '$rootScope',
        'rvRateManagerPopUpConstants',
        'rvUtilSrv',
        '$filter',
        'rvRateManagerCoreSrv',
        'rvRateManagerEventConstants',
        'ngDialog',
        'rvRateManagerUtilitySrv',
        'rvRateManagerHierarchyRestrictionsSrv',
        function($scope,
            $rootScope,
            rvRateManagerPopUpConstants,
            util,
            $filter,
            rvRateManagerCoreSrv,
            rvRateManagerEventConstants,
            ngDialog,
            hierarchyUtils,
            hierarchySrv) {
                BaseCtrl.call(this, $scope);

                /**
                 * Function for initializing of dialogue variables
                 */
                var initializeScopeVariables = () => {;
                    $scope.header = {
                        date: '',
                        hierarchyType: ''
                    };
                    $scope.selectedRestriction = {};
                    $scope.restrictionStylePack = hierarchyUtils.restrictionColorAndIconMapping;
                    $scope.restrictionFormTitle = '';
                    $scope.showInitialScreen = true;
                    // Can remove the below line when working on the view and edit parts of house restrictions
                    // This is only for CICO-75894, which does not list the existing restrictions
                    $scope.noActiveHierarchyRestrictionsForDate = true;
                    // -----
                }, initialiseFirstScreen = () => {
                    // as part of CICO-75894 we are always showing the first screen as empty.
                    // the below code must be changed when the story to view restrictions is taken up.
                    // There may be code, but for now, the following one line will do
                    $scope.showInitialScreen = true;
                    $scope.noActiveHierarchyRestrictionsForDate = true;
                    $scope.newHierarchyRestriction = false;
                };

                $scope.initiateNewRestrictionForm = () => {
                    // trigger Restriction setting window
                    $scope.showInitialScreen = false;
                    $scope.newHierarchyRestriction = true;
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
                            $scope.selectedRestriction.value
                        ) || $scope.selectedRestriction.type === "boolean";
                    }
                    return formValid;
                };

                $scope.setHouseHierarchyRestriction = () => {
                    var restrictions = {};

                    restrictions[$scope.selectedRestriction.key] = $scope.selectedRestriction.type === 'number' ? $scope.selectedRestriction.value : true;
                    var params = {
                        from_date: $scope.ngDialogData.date,
                        to_date: $scope.ngDialogData.date,
                        restrictions 
                    }, houseRestrictionSuccessCallback = (response) => {            
                        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS, dataFromPopupToParent);
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
                    document.activeElement.blur();
                    $scope.$emit('hideLoader');
        
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
