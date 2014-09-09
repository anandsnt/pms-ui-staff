sntRover.directive('forceDecimalZeroDir', ['$interval', function($timeout) {
    return {
        link: function(scope, element, attrs) {
            var attrVal, timer, dec, exec;

            exec = function(val) {
                attrVal = attrs.value;
                if ( !!attrVal ) {
                    dec = attrs.value.split( '.' )[1];

                    if ( angular.isDefined(dec) ) {
                        if ( dec !== '00' && dec * 1 < 10 ) {
                            attrVal += '0';
                        };
                    } else {
                        attrVal += '.00';
                    };

                    element.val( attrVal );
                }
            }

            timer = $timeout(function() {
                exec();
            }, 100);
        }
    };
}]);