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
        $scope.adjustmentReasonsData = angular.copy(adjustmentReasonsData);
        $scope.isForceAdjustmentOn = $scope.adjustmentReasonsData.force_adjustment_reason_enabled;
        $scope.forceAdjustmentReasons = $scope.adjustmentReasonsData.force_adjustment_reasons;

        $scope.addReason = function () {
            var reasonArray = {};
            reasonArray.value = $scope.description;
            $scope.adjustmentReasons.push(reasonArray.value);
            $scope.forceAdjustmentReasons.push(reasonArray);
            $scope.description = "";
        };

        $scope.forceAdjToggle = function (index) {
            var successCallbackSave = function(data) {
                $scope.data = data;
                $scope.$emit('hideLoader');
            },
            // Failure callback
            failureCallbackSave = function(errorMessage) {
                $scope.errorMessage = errorMessage;
                $scope.$emit('hideLoader');
            },
            postData = {
				'force_adjustment_reason_enabled': $scope.isForceAdjustmentOn }
            // option object
            options = {
                params: postData,
                successCallBack: successCallbackSave,
                failureCallBack: failureCallbackSave
            };
            $scope.callAPI(adForceAdjustmentReasonSrv.toggleAction, options);
        }

        $scope.removeReason = function (index) {
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
        }

        $scope.clickedSave = function() {
            var successCallbackSave = function(data) {
                $scope.data = data;
                $scope.$emit('hideLoader');
            },
            // Failure callback
            failureCallbackSave = function(errorMessage) {
                $scope.errorMessage = errorMessage;
                $scope.$emit('hideLoader');
            },
            postData = {
				'adjustment_reasons': $scope.adjustmentReasons }
            // option object
            options = {
                params: postData,
                successCallBack: successCallbackSave,
                failureCallBack: failureCallbackSave
            };
            console.log($scope.forceAdjustmentReasons);
            $scope.callAPI(adForceAdjustmentReasonSrv.saveReasons, options);
        }

    }]);