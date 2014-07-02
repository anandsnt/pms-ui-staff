function BaseCtrl($scope){	

    
	$scope.fetchedCompleted = function(data){
		$scope.$emit('hideLoader');
	};

	$scope.clearErrorMessage = function(){
		$scope.errorMessage = '';
		$scope.successMessage = '';
	};
	$scope.clearErrorMessage();
	$scope.showErrorMessage = function(errorMessage){
		
	};
	
	// function that converts a null value to a desired string.
	// if no replace value is passed, it returns an empty string
	$scope.escapeNull = function(value, replaceWith){
  		var newValue = "";
  		if((typeof replaceWith != "undefined") && (replaceWith != null)){
  			newValue = replaceWith;
  		}
  		var valueToReturn = ((value == null || typeof value == 'undefined' ) ? newValue : value);
  		return valueToReturn;
	};

	$scope.fetchedFailed = function(errorMessage){
		$scope.$emit('hideLoader');
		if($scope.hasOwnProperty("errorMessage")){ 	
			$scope.errorMessage = errorMessage;
			$scope.successMessage = '';
		}
		else {
			$scope.$emit("showErrorMessage", errorMessage);
		}
	};


	$scope.invokeApi = function(serviceApi, params, successCallback, failureCallback, loaderType){
		//loaderType options are "BLOCKER", "NONE"
		if(typeof loaderType === 'undefined')
			loaderType = 'BLOCKER';
		if(loaderType.toUpperCase() == 'BLOCKER')
			$scope.$emit('showLoader');

		successCallback = (typeof successCallback ==='undefined') ? $scope.fetchedCompleted : successCallback;
		failureCallback = (typeof failureCallback ==='undefined') ? $scope.fetchedFailed : failureCallback;
		
		return serviceApi(params).then(successCallback, failureCallback);
		
	};

    /**
    * function to get day against a date
    * if you give today's date it will return 'Today', Tomorrow will return against tomorrow's date
    * for others, it will return week day (Sunday, Monday..) 
    */

    $scope.getSimplifiedDayName = function(date){
    	var returnText = "";  	
        try{
            var passedDate = new Date(date);
            var currentDate = new Date();
			var timeDiff = (passedDate.getTime() - currentDate.getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			if(diffDays == 0){
				returnText = "Today";
			}
			else if(diffDays == 1){
				returnText = "Tomorrow";
			}
			else {
				var weekday = new Array(7);
			    weekday[0] = "Sunday";
			    weekday[1] = "Monday";
			    weekday[2] = "Tuesday";
			    weekday[3] = "Wednesday";
			    weekday[4] = "Thursday";
			    weekday[5] = "Friday";
			    weekday[6] = "Saturday";  
			    returnText = weekday[passedDate.getDay()];
			}
			return returnText;
        }
        catch(e){
        	return date;
        }
        console.log(returnText);
    };

    /*
	    this is the default scroller options used by controllers
		this can be modified through setScroller function
    */
    $scope.defaultScrollerOptions = {
    	snap: false,
		scrollbars: 'custom',
		vScroll: true,
		vScrollbar: true,
		hideScrollbar: false,
		click: true,
		tap: true
    };

    /*
    	function to handle scroll related things
    	@param1: string as key 
    	@param2: object as scroller options
    */
    $scope.setScroller = function (key, scrollerOptions){
    	//here is using a angular function to extend
    	angular.extend (scrollerOptions, $scope.defaultScrollerOptions);
    	//checking whether scroll options object is already initilised in parent controller
    	//if so we need add a key, otherwise initialise and add
    	var isScrollOptionsDefinedInParent = false;
    	if (typeof $scope.$parent !== 'undefined' && 
    		typeof $scope.$parent.myScrollOptions !== 'undefined') {    		    		
    		isScrollOptionsDefinedInParent = isEmpty ($scope.$parent.myScrollOptions);
    	}

    	if (isScrollOptionsDefinedInParent) {
    		$scope.$parent.myScrollOptions.key = scrollerOptions;
    	}
    	else {
    		$scope.$parent.myScrollOptions = {
    			key: scrollerOptions
    		}
    	}    	
    }

    /*
    	function to refresh the scroller 
    	@param1: string as key 
    */
    $scope.refreshScroller = function (key){
    	$scope.$parent.myScroll[key].refresh();
    }


}