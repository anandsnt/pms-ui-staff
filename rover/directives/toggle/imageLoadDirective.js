sntRover.directive('imageLoad', function () {
    return {
    	scope:{
    		imageLoaded : '&'
    	},
        link: function(scope, element, attrs) {

            element.bind("load" , function(e){
            		try{
            			scope.imageLoaded();
            		}
            		catch(err){

                    };

                });
            }

    };
});