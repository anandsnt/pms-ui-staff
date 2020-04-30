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
        function($scope,
            $rootScope,
            rvRateManagerPopUpConstants,
            util,
            $filter,
            rvRateManagerCoreSrv,
            rvRateManagerEventConstants,
            ngDialog,
            hierarchyUtils) {
                BaseCtrl.call(this, $scope);

                /**
                 * Function for initializing of dialogue variables
                 */
                var initializeScopeVariables = () => {;
                    $scope.header = {
                        date: '',
                        hierarchyType: ''
                    };
                    $scope.selectedRestrictions = [];
                    $scope.showInitialScreen = true;
                    $scope.restrictionStylePack = hierarchyUtils.restrictionColorAndIconMapping;
                    $scope.restrictionFormTitle = '';
                };

                $scope.setRestrcition = () => {
                    // trigger Restriction setting window
                    $scope.showInitialScreen = false;
                    $scope.newHierarchyRestriction = true;
                };

                var setHouseRestrictionDataForPopup = () => {
                    $scope.header.hierarchyType = $scope.ngDialogData.hierarchyLevel;
                    $scope.header.date = moment($scope.ngDialogData.date).format('dddd, MMMM DD');
                    checkForActiveRestrictions($scope.ngDialogData);
                };

                var checkForActiveRestrictions = (data) => {
                    $scope.selectedRestrictions = hierarchyUtils.generateOldGetApiResponseFormat(data.restrictions);

                    if ($scope.selectedRestrictions.length !== 0) {
                        $scope.noActiveHierarchyRestrictionsForDate = false;
                    } else {
                        $scope.noActiveHierarchyRestrictionsForDate = true;
                    }
                    populateResctrictionStylePack(data.restrictions);
                };

                var populateResctrictionStylePack = (restrictions) => {
                    $scope.restrictionStylePack.forEach(restriction => {
                        restriction.value = restrictions[restriction.key];
                    });
                };

                $scope.restrictionSelected = (restriction) => {
                    console.log(restriction);
                    $scope.selectedRestrictions.push(restriction);
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
