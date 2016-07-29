var admin = angular.module('admin',
	['ui.sortable',
	'ui.router',
	'ng-iscroll',
	'ngDragDrop',
	'ngTable',
	'ngDialog',
	'ngSanitize',
	'pascalprecht.translate',
	'adminModuleOne',
	'adminModuleTwo',
	'adminInterfacesRouter',
    'adminToolsRouter',
	'ui.date',
	'qtip2',
	'sharedHttpInterceptor',
	'orientationInputBlurModule',
	'multi-select',
	'fauxMultiSelectModule',
	'eventReachedRootModule',
	'ngClassWithoutAnimation',
	'documentTouchMovePrevent',
	'divTouchMoveStopPropogate',
	'ui.utils',
    'uiColorpicker',
    'onScroll',
    'limitInputRange']);

//adding shared http interceptor, which is handling our webservice errors & in future our authentication if needed
admin.config(function($httpProvider) {
    $httpProvider.interceptors.push('sharedHttpInterceptor');
});

admin.run(['$rootScope', '$state', '$stateParams', '$location', function($rootScope, $state, $stateParams, $location) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.previousStateParam = fromParams.menu;

        // spiting state names
    });
}]);


// function to add zeros(0) infront of a number, like 09 for 9 or 007 for 7
function getLengthChangedNumber(lengthWanted, number) {

    if (typeof number === 'number') {
        number = number.toString();
    }
    var numberOfZerosToAppend = lengthWanted - number.length;
    //if numberOfZerosToAppend is zero or less, nothing to do
    if (numberOfZerosToAppend <= 0) {
        return number;
    }
    var zeros = "";
    for (var i = 1; i <= numberOfZerosToAppend; i++) {
        zeros += "0";
    }
    return (zeros + number);
}

//range function as filter
//usage examples
admin.filter('makeRange', function() {
    return function(input) {
        var lowBound, highBound;
        var step = 1;
        //in some cases we need 0 or combination of 0 to the front
        var appendingString = "";
        var minLengthWanted = 0;
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
            case 4:
                lowBound = parseInt(input[0]);
                highBound = parseInt(input[1]);
                step = parseInt(input[2]);
                minLengthWanted = parseInt(input[3]);
                break;
            default:
                return input;
        }
        var result = [];
        var number = "";
        for (var i = lowBound; i <= highBound; i += step) {
            number = getLengthChangedNumber(minLengthWanted, i);
            result.push(number);
        }
        return result;
    };
});

admin.controller('rootController', ['$scope',
    function($scope) {

    }
]);
