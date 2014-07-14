sntRover.directive('imageLoad', function () {       
    return {
    	scope:{
    		imageLoaded : '&'
    	},
        link: function(scope, element, attrs) {   

            element.bind("load" , function(e){ 
            		try{
                        console.log("inside imageLoaded directive");
            			scope.imageLoaded();
            		}
            		catch(err){};
					
                });
            }
        
    }
});