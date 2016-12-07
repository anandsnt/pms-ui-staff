admin.directive('adTextarea', function($timeout) {

    return {
    	restrict: 'E',
        replace: 'true',
      	scope: {
	        value: '=value',
	        name: '@name',
            label: '@label',
	        placeholder: '@placeholder',
	        required: '@required',
            id: '@id',
            divClass: '@divClass',
            textAreaClass: '@textAreaClass',
            rows: '@rows',
            required: '=required',
            maxlength: '@maxlength',
            disabled: '=disabled',
            ngHide: '=hide'
	    },
    	templateUrl: '/assets/directives/textArea/adTextArea.html'

	   };

});