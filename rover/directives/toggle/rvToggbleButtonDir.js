sntRover.directive('rvToggleButton', function($timeout) {

    return {
    	restrict: 'E',
        replace: 'true',
      	scope: {
      		label: '@label',
            isChecked: '=isChecked',
            divClass: '@divClass',
            label: '@label'
	    },

    	templateUrl: '../../assets/directives/toggle/rvToggleButton.html'
    };

});