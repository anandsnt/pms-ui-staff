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
            id : '@id'
	    },
        compile: function(element, attrs){
            console.log('in compile function');
            attrs.readonly = (typeof attrs.readonly == 'undefined' ) ? 'no': 'yes';
            attrs.required = (typeof attrs.required == 'undefined' ) ? 'no': 'yes';            
        },
    	templateUrl: '../../assets/partials/directives/adTextbox.html' 
    };

});