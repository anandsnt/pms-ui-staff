 angular.module('touchPress', []).directive('touchPress', function($timeout, $parse) {
  return {
    restrict: 'AE',
    link: function(scope, element, attrs, opt) {
         element.bind('touchend', function(event) {
             try {
                if (element){
                    if (arguments[0].target.nodeName === 'INPUT'){
                        element.focus(); 
                    }
                }
             } catch(err){
                 
             }
             //bind any touch start event to the element
             if (typeof event === typeof {}){
                if (event.preventDefault){
                 //   event.preventDefault();
                }
                if (event.stopPropagation){
                    event.stopPropagation();
                }
                
            }
            scope.$apply(attrs['touchPress']);
      });
         
        scope.$on('$destroy', function() {
            element.unbind('touchend');
        })

    }
  };
});