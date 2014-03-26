admin.directive('adTextbox', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
	        value: '=value',
	        name : '@name',
            label: '@label',
	        placeholder : '@placeholder',
	        required : '@required',
	        label_required: '@label_required'
	    },
    	templateUrl: '../../assets/directives/textBox/adTextbox.html' 
    };

});