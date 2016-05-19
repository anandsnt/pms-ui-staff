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
            label:'@label',
            labelInDropDown: '@labelInDropDown',
            list:'=list',
            name:'@name',
            selectedId:'=selectedId',
            labelClass:'@labelClass',
            options: '=',
            ngHide: '@hide',
            onChange: '='
	    },
        link: function ($scope, $element, $attr)
        {
            if(typeof $scope.options !== 'undefined'){
                if($scope.options.hasOwnProperty('showOptionsIf')) {
                    $scope.showOptionsIf = $scope.options.showOptionsIf;
                }
            }else{
                $scope.showOptionsIf = function(index){
                     return true;
                };
            }
        },
    	templateUrl: '/assets/directives/selectBox/adDropdownbox.html'
    };

});