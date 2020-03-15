admin.controller('ADForceAdjustmentReason', [
    '$rootScope',
    '$scope',
    'adForceAdjustmentReasonSrv',
    '$stateParams',
    '$state',
    'ngDialog',
    'adjustmentReasonsData',
    function($rootScope, $scope, adForceAdjustmentReasonSrv, $stateParams, $state, ngDialog, adjustmentReasonsData) {

        $scope.adjustmentReasonsData = angular.copy(adjustmentReasonsData);
        $scope.isForceAdjustmentOn = true;
        $scope.forceAdjustmentReasons = [
            { reason: "John Hammond", Country: "United States" },
            { reason: "Mudassar Khan", Country: "India" },
            { reason: "Suzanne Mathews", Country: "France" },
            { reason: "Robert Schidner", Country: "Russia" }
            ];

        $scope.addReason = function () {
            var reasonArray = {};
            reasonArray.reason = $scope.reason;
            $scope.forceAdjustmentReasons.push(reasonArray);
            $scope.reason = "";
        };

        $scope.removeReason = function (index) {
            var name = $scope.forceAdjustmentReasons[index].reason;
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
				'is_force_adjustment_on': $scope.isForceAdjustmentOn,
				'reasons_array': $scope.forceAdjustmentReasons }
            // option object
            options = {
                params: postData,
                successCallBack: successCallbackSave,
                failureCallBack: failureCallbackSave
            };
    
            $scope.callAPI(adForceAdjustmentReasonSrv.saveDefaults, options);
        }

    }]);