sntZestStation.directive('clearField', ['$timeout', function($timeout) {

    return {
        restrict: 'A',
        scope: {
            delay: '@delay',
            ngModel: '=ngModel',
            fieldToClear: '@clearField'
        },
        link: function(scope, element, attrs){
            console.info('clearfield is working');
            //we are setting delay to 2sec. if it is undefined
            if(typeof scope.delay === "undefined"){
                scope.delay = 2000;
            }
            element.bind('click touchstart', function(event){
                console.log('clearing field: ');
                console.log(scope);
            });
        }
    };

}]);