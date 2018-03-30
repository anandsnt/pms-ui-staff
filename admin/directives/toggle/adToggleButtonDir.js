admin.directive('adToggleButton', function() {

    return {
    	restrict: 'E',
        replace: 'true',
      	scope: {
            negativeLogic: '=?', // This flag can be used in cases where the negated value is stored in the server
      		label: '@label',
            isChecked: '=isChecked',
            divClass: '@divClass',
            buttonClass: '@buttonClass',
            label: '@label',
            isDisabled: '=isDisabled',
            isHide: '=isHide',
            description: '@description',
            onUpdate: '=',
            params: '='
	    },

    	templateUrl: '/assets/directives/toggle/adToggleButton.html',
        controller: function($scope) {
            $scope.handler = function () {
             $scope.onUpdate($scope.params, $scope.isChecked);
            };
        }
    };

});
