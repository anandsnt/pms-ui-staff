sntRover.directive('outsideClickHandler', function($window){
  return {
    
	    link: function(scope, element){
	
	    var w = angular.element($window);
	    w.bind('click', function(e){
	      if(element[0].contains(e.target)){
	
	      }
	      else{
	        scope.$broadcast("OUTSIDECLICKED");
	      }
	      
	    });
	  }
  };
});