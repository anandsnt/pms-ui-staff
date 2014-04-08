admin.directive('adToggleButton', function($timeout) {

    return {
    	restrict: 'E',
        replace: 'true',
      	scope: {
            isChecked: '=isChecked',
            divClass: '@divClass',
            label: '@label'
	    },
        
    	templateUrl: '../../assets/directives/toggle/adToggleButton.html' 
    };

});