admin.directive('adCheckbox', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            label: '@label',
	        required : '@required',
            isChecked: '@isChecked'
	    },
    	templateUrl: '../../assets/partials/directives/adCheckbox.html' 
    };

});