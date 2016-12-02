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
            description: '@description'
	    },

    	templateUrl: '/assets/directives/toggle/adToggleButton.html'
    };

});