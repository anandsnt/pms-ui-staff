function BaseCtrl($scope, $vault, returnBack){	

	$scope.businessDate = "";

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
	
	//function that converts a null value to a desired string.
	//if no replace value is passed, it returns an empty string
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
		//scroll to top of the page where error message is shown
		if(angular.element( document.querySelector('.content')).find(".error_message").length) {
  			angular.element( document.querySelector('.content')).scrollTop(0);
		}; 
		if($scope.hasOwnProperty("errorMessage")){ 	
			$scope.errorMessage = errorMessage;
			$scope.successMessage = '';
		}
		else {
			$scope.$emit("showErrorMessage", errorMessage);
		}
		$scope.$broadcast("scrollToErrorMessage");
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

	//handle drag and drop events
	$scope.hideCurrentDragItem = function(ev, ui){ 
		$(ev.target).hide();
	 };

 	$scope.showCurrentDragItem = function(ev, ui){ 
		$(ev.target).show();
 	};

    /**
    * function to get day against a date
    * if you give today's date it will return 'Today', Tomorrow will return against tomorrow's date
    * for others, it will return week day (Sunday, Monday..) 
    */

    $scope.getSimplifiedDayName = function(date){
    	var returnText = "";  
        try{
            // var passedDate = new Date(date);
            // var currentDate = new Date($scope.businessDate);
            var passedDate = tzIndependentDate(date);
            var currentDate = tzIndependentDate($scope.businessDate);
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
    };

     /*
     * To set the title of each navigation
     */
    $scope.setTitle = function(title){
    	document.title = title;
    };

    $scope.goBack = function($rootScope, $state){
		
		if($rootScope.previousStateParam){
			$state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
		}
		else if($rootScope.previousState){
			$state.go($rootScope.previousState);
		}
		else 
		{
			$state.go('admin.dashboard', {menu : 0});
		}
	
	};

	/*
	    this is the default scroller options used by controllers
		this can be modified through setScroller function
    */
    $scope.timeOutForScrollerRefresh = 300;
    var defaultScrollerOptions = {
    	snap: false,
		scrollbars: 'custom',
		hideScrollbar: false,
		click: false,
		scrollX: false, 
		scrollY: true, 
		preventDefault: true,
		preventDefaultException:{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }
    };

    /*
    	function to handle scroll related things
    	@param1: string as key 
    	@param2: object as scroller options
    */
    $scope.setScroller = function (key, scrollerOptions){
    	if(typeof scrollerOptions === 'undefined'){
    		scrollerOptions = {};
    	}
    	//we are merging the settings provided in the function call with defaults
    	var tempScrollerOptions = angular.copy (defaultScrollerOptions);
    	angular.extend (tempScrollerOptions, scrollerOptions); //here is using a angular function to extend,
    	scrollerOptions = tempScrollerOptions;
    	//checking whether scroll options object is already initilised in parent controller
    	//if so we need add a key, otherwise initialise and add    
    	var isEmptyParentScrollerOptions = isEmptyObject ($scope.$parent.myScrollOptions);
    	
    	if (isEmptyParentScrollerOptions) { 
    		$scope.$parent.myScrollOptions = {}; 		
    	}
    	
    	$scope.$parent.myScrollOptions[key] = scrollerOptions; 

    	// set up handler to save scroller position
    	setTimeout(function() {

    		// if this state is loaded via 'Go back'
    		if ( returnBack && !!$vault.get(key) ) {
    			$scope.$parent.myScroll[key].scrollTo( 0, $vault.get(key), 0 );
    		};

    		// if $vault is provided and probeType is 2, setup scrollEnd listner
    		if ( $vault && $scope.$parent.myScrollOptions[key].probeType === 2 ) {
	    		$scope.$parent.myScroll[key].on('scrollEnd', function() {
	    			$vault.set( key, this.y );
	    		});
	    	};
    	}, 1300);
    };

    /*
    	function to refresh the scroller 
    	@param1: string as key 
    */
    $scope.refreshScroller = function (key){
    	setTimeout(function(){
    		if( !!$scope.$parent.myScroll && key in $scope.$parent.myScroll )
    			$scope.$parent.myScroll[key].refresh();
    	}, $scope.timeOutForScrollerRefresh);   	
    };

}