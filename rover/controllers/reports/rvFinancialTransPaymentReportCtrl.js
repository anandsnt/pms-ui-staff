angular.module('sntRover').controller('RVFinancialTransPaymentReportCtrl', [
    '$scope',
    '$rootScope', 
    '$timeout', 
    function($scope, $rootScope, $timeout) {
        BaseCtrl.call(this, $scope);

        var detailsCtrlScope = $scope.$parent,
			mainCtrlScope    = detailsCtrlScope.$parent,
            results = [];

        // Handle Expand/Collapse of Level1 
        $scope.clickedFirstLevel = function(index1) {
            var toggleItem = results[index1];
            toggleItem.active = !toggleItem.active;
        };

        // To hide/show arrow button for Level1 
        $scope.checkHasArrowFirstLevel = function(index) {
            var hasArrow = false,
            item = results[index];

            if ((typeof item.credit_cards !== 'undefined') && (item.credit_cards.length > 0)) {
                hasArrow = true;
            }
            else if (item.number > 0) {
                hasArrow = true;
            }
            return hasArrow;
        };

        // To hide/show arrow button for Level2 
        $scope.checkHasArrowSecondLevel = function(index1, index2) {
            var hasArrow = false,
            item = results[index1].credit_cards[index2];

            if (item.number > 0) {
                hasArrow = true;
            }
            return hasArrow;
        };

        // Handle Expand/Collapse of Level2  Credit card section
        $scope.clickedSecondLevel = function(index1, index2) {
            var toggleItem = results[index1].credit_cards[index2];
            toggleItem.active = !toggleItem.active;
        };

        var init = function() {
            results = mainCtrlScope.results;            
        };

        init();


    }]);