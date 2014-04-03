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
            id : '@id',
            styleclass: '@styleclass',
            inputtype: '@inputtype'
	    },
    	templateUrl: '../../assets/directives/textBox/adTextbox.html'  
	        
	   };

});