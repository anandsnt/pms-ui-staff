admin.directive('adTextarea', function($timeout) {

    return {
    	restrict: 'E',
        replace: 'true',
      	scope: {
	        value: '=value',
	        name : '@name',
            label: '@label',
	        placeholder : '@placeholder',
	        required : '@required',
            id : '@id',
            divClass: '@divClass',
            textAreaClass: '@textAreaClass',
            rows: '@rows',
            required: '=required'
	    },
    	templateUrl: '../../assets/directives/textArea/adTextArea.html'  
	        
	   };

});