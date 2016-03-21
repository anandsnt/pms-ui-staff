angular.module('enterPress', []).directive('enterPress', function($timeout, $parse) {  
    return {
        restrict: 'AE',
        link: function(scope, element, attrs, opt) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    
                    if (initScreenKeyboardListener){
                        var keyboard = new initScreenKeyboardListener();
                        keyboard.blurHandler();
                        $('input:visible').getkeyboard().accept(); 
                    }
                    
                    scope.$apply(function (){
                        scope.$eval(attrs.enterPress);
                    });
                    //blur focus another object to drop keypad in touch devices 
                    $(element).blur();
                    event.preventDefault();
                }
            });
        }
    };
});