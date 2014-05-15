admin.controller('ADAppCtrl',['$state', '$scope', '$rootScope','ADAppSrv', '$stateParams', '$window', '$translate', function($state, $scope, $rootScope, ADAppSrv, $stateParams, $window, $translate){
	
	//when there is an occured while trying to access any menu details, we need to show that errors
	$scope.errorMessage = '';

	BaseCtrl.call(this, $scope);
	$scope.menuOpen = false;
	$scope.hotelListOpen = '';

	$scope.dragStart = false;
	$scope.selectedIndex = 0;	
	$scope.dropedElementsModel = []; // model used for drag & drop feature, used for droping menu items displaying area

	//for preventing drag & drop operations turning into click
	var lastDropedTime = '';

	//scroller options
	$scope.$parent.myScrollOptions = {
        snap: false,
        scrollbars: true,
        bounce: true,
        vScroll: true,
        vScrollbar: true,
        hideScrollbar: false
    };
     
	$scope.bookMarks = [];

	if($rootScope.adminRole == "hotel-admin" ){
		$scope.isHotelAdmin =  true;
	}	
	else{
		$scope.isHotelAdmin =  false;
	}

	$scope.isDragging = false;

	//on drag start we need to show a dotted border on bookmark area
	$scope.onDragStart = function(){
		$scope.isDragging = true;
	};

	//on drag stop we need to hide the dotted border on bookmark area
	$scope.onDragStop = function(){
		$scope.isDragging = false;

		//also we are taking the lastDropedTime to preventing click after drag stop operation
		lastDropedTime = new Date();			
	};	

	//function to copy the ids of bookmark to a new array
	var copyBookmarkIds = function(arrayToCopy){
		for(var i = 0; i < $scope.bookMarks.length; i++){
			arrayToCopy.push($scope.bookMarks[i].id);			
		}
	};

	//function to change bookmark status after dropping
	var updateBookmarkStatus = function(){
		for(var i = 0; i < $scope.data.menus.length; i++){
			for(var j = 0; j < $scope.data.menus[i].components.length; j++){
				if($scope.bookmarkIdList.indexOf($scope.data.menus[i].components[j].id) == -1){						
					$scope.data.menus[i].components[j].is_bookmarked = false;							
				}	
				else{
					$scope.data.menus[i].components[j].is_bookmarked = true;							
				}					
			}
		}
	};

	//drop function on menu item listing
	$scope.onDropingMenuItemListing = function(event, ui) {
		var index = -1;

		//successcallback of removing menu item
	   	var successCallbackOfRemovingBookMark = function(){
	   	 	$scope.$emit('hideLoader');

	   	 	if(index != -1){
	    		$scope.bookmarkIdList.splice(index, 1);
	    		index = -1;
	    	}
	    	updateBookmarkStatus();			    	   	
	    };


	    
		var copiedBookMarkIds = [];		
		copyBookmarkIds(copiedBookMarkIds);

	    if($scope.bookMarks.length <= $scope.bookmarkIdList.length){
	    	for(var i = 0; i < $scope.bookmarkIdList.length; i++){	
	    		//checking bookmarked id's in copiedBookark id's, if it is no, call web service	    		
	    		if(copiedBookMarkIds.indexOf($scope.bookmarkIdList[i]) == -1){
	    			index = i;
	    			var data = {id: $scope.bookmarkIdList[i]};
   					$scope.invokeApi(ADAppSrv.removeBookMarkItem, data, successCallbackOfRemovingBookMark);
	    		}
	    	}
	    }
   		
	};
	
	//drop function on boomark menu item listing
	$scope.onDropAtBookmarkArea = function(event, ui) {		
		var index = -1;
	   	var successCallbackOfBookMark = function(){
	   	 	$scope.$emit('hideLoader');
	   	 	if(index != -1){
	    		$scope.bookmarkIdList.push($scope.bookMarks[index].id);
	    		index = -1;
				updateBookmarkStatus();
	    	}	
	    };

		var copiedBookMarkIds = [];	
		copyBookmarkIds(copiedBookMarkIds);
	
	    if($scope.bookMarks.length > $scope.bookmarkIdList.length){
	    	for(var i = 0; i < $scope.bookMarks.length; i++){

	    		// if the newly added bookmark is not in the old copy then we have to web service and add it to the old array
	    		if($scope.bookmarkIdList.indexOf($scope.bookMarks[i].id) == -1){
	    			index = i;
	    			var data = {id: $scope.bookMarks[i].id};
   					$scope.invokeApi(ADAppSrv.bookMarkItem, data, successCallbackOfBookMark);
	    		}
	    	}
	    }
   		
	};

	/*
	* function for handling click operation on menu item
	* Here is a special case
	* After drag operation, click event is firing. Inorder to prevent that
	* we will check the lastDropedTime with click event fired time.
	* if it is less than a predefined time, it will not fire click event, otherwise fire	
	*/
	$scope.clickedMenuItem = function($event, stateToGo){
		var currentTime = new Date();
		if(lastDropedTime != '' && typeof lastDropedTime == 'object'){
			var diff = currentTime - lastDropedTime;				
			if(diff <= 400){
				$event.preventDefault();
				$event.stopImmediatePropagation();
				$event.stopPropagation();				
				lastDropedTime = '';
				return false;
			}
			else{
				lastDropedTime = '';
				$state.go(stateToGo);
			}
		}
		else{
			lastDropedTime = '';
			$state.go(stateToGo);
		}
	};
	
	$scope.$on("changedSelectedMenu", function(event, menu){
		$scope.selectedIndex = menu;		
	});

	$scope.successCallbackOfMenuLoading = function(data){
		//$scope.currentIndex = 0;
		$scope.data = data;
		$scope.selectedMenu = $scope.data.menus[$scope.selectedIndex];			
		$scope.bookMarks = $scope.data.bookmarks;
		
		$scope.bookmarkIdList = [];
		for(var i = 0; i < $scope.data.bookmarks.length; i++){
			$scope.bookmarkIdList.push($scope.data.bookmarks[i].id);
		}
			
		$scope.getLanguage();
			
	};
	
	$scope.invokeApi(ADAppSrv.fetch, {}, $scope.successCallbackOfMenuLoading);
	
	/*
	 * Success callback of get language
	 * @param {object} response
	 */
	$scope.fetchHotelDetailsSuccessCallback = function(data){
		 $translate.use(data.language.value);
		 $scope.$emit('hideLoader');
	};
	/*
	 * Function to get the current hotel language
	 */
	$scope.getLanguage = function(){
		$scope.invokeApi(ADAppSrv.fetchHotelDetails,{},$scope.fetchHotelDetailsSuccessCallback);  
	};


	// if there is any error occured 
    $scope.$on("showErrorMessage", function($event, errorMessage){
    	$event.stopPropagation();
    	$scope.errorMessage = errorMessage;
        
    });
	
	$scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
    });
    
 	$scope.isMenuOpen = function(){
        return $scope.menuOpen ? true : false;
    };


    $scope.$on("showLoader", function(){
        $scope.hasLoader = true;
    });

    $scope.$on("hideLoader", function(){
        $scope.hasLoader = false;
    });    

    $scope.isHotelListOpen = function(){
        $scope.hotelListOpen = ($scope.hotelListOpen == "open") ? "" : "open";
    };
    $scope.redirectToHotel = function(hotel_id){
    	ADAppSrv.redirectToHotel(hotel_id).then(function(data) {
    		$window.location.href = "/admin";
		},function(){
			console.log("error controller");
		});	
    };
}]);

    