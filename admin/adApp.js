var admin = angular.module('admin',['ui.router', 'ng-iscroll']);

admin.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;	
}]);


//range function as filter
//usage examples 
admin.filter('makeRange', function() {
    return function(input) {
        var lowBound, highBound;
        var step = 1;
        switch (input.length) {
        case 1:
            lowBound = 0;
            highBound = parseInt(input[0]) - 1;
            break;
        case 2:
            lowBound = parseInt(input[0]);
            highBound = parseInt(input[1]);
            break;
        case 3:
            lowBound = parseInt(input[0]);
            highBound = parseInt(input[1]);
            step = parseInt(input[2]); 
            break;            
        default:
            return input;
        }
        var result = [];
        var number = "";
        for (var i = lowBound; i <= highBound; i+=step){
        	number = i > 9 ? "" + i: "0" + i;
            result.push(number);

        }
        return result;
    };
 });	

admin.controller('rootController', ['$rootScope','$scope','$attrs','$location', function($rootScope,$scope,$attrs, $location) {

	//store basic details as rootscope variables

	$rootScope.admin_role = $attrs.adminRole;

}]);

