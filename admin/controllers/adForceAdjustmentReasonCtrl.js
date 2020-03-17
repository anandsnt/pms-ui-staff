admin.controller('ADForceAdjustmentReason', [
    '$rootScope',
    '$scope',
    'adForceAdjustmentReasonSrv',
    '$stateParams',
    '$state',
    'ngDialog',
    'adjustmentReasonsData',
    function($rootScope, $scope, adForceAdjustmentReasonSrv, $stateParams, $state, ngDialog, adjustmentReasonsData) {

        $scope.adjustmentReasons = [];
        $scope.errorMessage = '';
        $scope.warningMessage = "";
        $scope.showAddReasonButton = false;
        $scope.adjustmentReasonsData = angular.copy(adjustmentReasonsData);
        $scope.isForceAdjustmentOn = $scope.adjustmentReasonsData.force_adjustment_reason_enabled;
        $scope.forceAdjustmentReasons = $scope.adjustmentReasonsData.force_adjustment_reasons;

        $scope.clearWarningMessage = function () {
			$scope.warningMessage = '';
		};

        $scope.addReason = function () {
            var reasonArray = {};
            $scope.warningMessage = "";
            if ($scope.description) {
                $scope.showAddReasonButton = true;
                reasonArray.value = $scope.description;
                $scope.forceAdjustmentReasons.push(reasonArray);
                $scope.description = "";
            }  else {
                $scope.showAddReasonButton = true;
            }
        };

        $scope.forceAdjToggle = function (index) {
            var successCallbackSave = function(data) {
                $scope.data = data;
                $scope.$emit('hideLoader');
                },
                failureCallbackSave = function(errorMessage) {
                    $scope.errorMessage = errorMessage;
                    $scope.$emit('hideLoader');
                },
                postData = {
                    'force_adjustment_reason_enabled': !$scope.isForceAdjustmentOn },
                options = {
                    params: postData,
                    successCallBack: successCallbackSave,
                    failureCallBack: failureCallbackSave
                };
            $scope.callAPI(adForceAdjustmentReasonSrv.toggleAction, options);
        }

        $scope.removeReason = function (index) {
            if (!index && index !== 0) {
                $scope.showAddReasonButton = false;
            } else if ($scope.forceAdjustmentReasons[index].id) {
                var successCallbackSave = function(data) {
                    $scope.data = data;
                    $scope.$emit('hideLoader');
                    },
                    // Failure callback
                    failureCallbackSave = function(errorMessage) {
                        $scope.errorMessage = errorMessage;
                        $scope.$emit('hideLoader');
                    },
                    options = {
                        params: {
                            'id': $scope.forceAdjustmentReasons[index].id
                        },
                        successCallBack: successCallbackSave,
                        failureCallBack: failureCallbackSave
                    };
                $scope.callAPI(adForceAdjustmentReasonSrv.removeReasons, options);
                $scope.forceAdjustmentReasons.splice(index, 1);
            }  else {
                $scope.forceAdjustmentReasons.splice(index, 1);
            }
        }

        $scope.clickedSave = function() {
            angular.forEach($scope.forceAdjustmentReasons, function(item, index) {
                $scope.adjustmentReasons.push(item.value);
            });
            if ($scope.description) {
                $scope.adjustmentReasons.push($scope.description);
            }
            var successCallbackSave = function(data) {
                $scope.data = data;
                $scope.description = "";
                $scope.adjustmentReasons = [];
                $scope.showAddReasonButton = false;
                $scope.forceAdjustmentReasons = $scope.data.force_adjustment_reasons;
                $scope.$emit('hideLoader');
                },
                // Failure callback
                failureCallbackSave = function(errorMessage) {
                    $scope.adjustmentReasons = [];
                    $scope.errorMessage = errorMessage;
                    $scope.$emit('hideLoader');
                },
                postData = {
                    'adjustment_reasons': $scope.adjustmentReasons },
                options = {
                    params: postData,
                    successCallBack: successCallbackSave,
                    failureCallBack: failureCallbackSave
                };
            if ($scope.forceAdjustmentReasons.length !==0 || $scope.adjustmentReasons.length !==0) {
                $scope.callAPI(adForceAdjustmentReasonSrv.saveReasons, options);
            } else {
                $scope.warningMessage = 'Please add adjustment reason';
            }
        }

    }]);