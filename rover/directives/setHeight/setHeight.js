sntRover.directive('setHeight', function($timeout) {

    return {
    	restrict: 'A',
      scope: {
            heightToSet: '=heightToSet',
	    },
    	link: function(scope, element, attrs){
           scope.$watch('heightToSet', function(newVal, OldVal){
              element.css('height', scope.heightToSet);
           }, true);
        }
    };

});