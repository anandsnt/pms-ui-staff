admin.directive('adDropdown', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            divStyle: '@divStyle',
	        selboxStyle : '@selboxStyle',
            divClass: '@divClass',
            selboxClass : '@selboxClass',            
            required: '@required',
            id: '@id',
            labelInDropDown: '@labelInDropDown',
            list:'=list',
            name:'@name',
            selectedId:'=selectedId'
	    },
    	templateUrl: '../../assets/directives/selectBox/adDropdownbox.html' 
    };

});