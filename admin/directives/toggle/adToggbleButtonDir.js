admin.directive('adToggleButton', function($timeout) {

    return {
    	restrict: 'E',
        replace: 'true',
      	scope: {
      		label: '@label',
            isChecked: '=isChecked',
            divClass: '@divClass'
	    },
        
    	templateUrl: '../../assets/directives/toggle/adToggleButton.html' 
    };

});