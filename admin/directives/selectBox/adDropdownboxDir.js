admin.directive('adDropdown', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            divStyle: '@divStyle',
	        selboxStyle : '@selboxStyle',
            required: '@required',
            id: '@id',
            labelInDropDown: '@labelInDropDown',
            list:'@list'

	    },
    	templateUrl: '../../assets/directives/checkBox/adCheckbox.html' 
    };

});