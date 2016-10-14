angular.module('enterPress', []).directive('enterPress', function($timeout, $parse) {  
    return {
        restrict: 'AE',
        link: function(scope, element, attrs, opt) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    event.preventDefault();
                    
                    setTimeout(function(){
                        scope.$apply(function (){
                            scope.$eval(attrs.enterPress);
                        });
                    },50);
                }
            });
        }
    };
});