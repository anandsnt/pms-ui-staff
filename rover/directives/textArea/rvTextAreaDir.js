sntRover.directive('rvTextarea', function($timeout) {

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
            required: '=required',
            maxlength: '@maxlength'
	    },
    	templateUrl: '../../assets/directives/textArea/rvTextArea.html'

	   };

});