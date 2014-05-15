sntRover.controller('companyCardDetailsController',['$scope', 'RVCompanyCardSrv', '$stateParams', function($scope, RVCompanyCardSrv, $stateParams){
	//setting the heading of the screen
	$scope.heading = "Company Card";	

	//inheriting some useful things
	BaseCtrl.call(this, $scope);

	//scope variable for tab navigation, based on which the tab will appear
	$scope.currentSelectedTab = 'cc-contact-info'; //initially contact information is active

	/**
	* function to switch to new tab, will set $scope.currentSelectedTab to param variable
	* @param{string} is the value of that tab
	*/
	$scope.switchTabTo = function(tabToSwitch){
		if($scope.currentSelectedTab == 'cc-contact-info' && tabToSwitch !== 'cc-contact-info'){
			saveContactInformation($scope.contactInformation);
		}
		$scope.currentSelectedTab = tabToSwitch;		
	}
	

	$scope.$parent.myScrollOptions = {		
	    'company-card-content': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false
	    },
	};		

	/**
	* function to handle click operation on company card, mainly used for saving
	*/
	$scope.companyCardClicked = function($event){

		if(getParentWithSelector($event, document.getElementById("company-card-nested-first"))){
			$scope.$emit("saveContactInformation");
		}
	}

	/**
	* remaining portion will be the Controller class of company card's contact info
	*/

	/**
	* success callback of initial fetch data
	*/
	var successCallbackOfInitialFetch = function(data){
		$scope.$emit("hideLoader");
		$scope.contactInformation = data;
		if(typeof $stateParams.id !== 'undefined' && $stateParams.id !== ""){
			$scope.contactInformation.id = $stateParams.id;
		}
		//taking a deep copy of copy of contact info. for handling save operation
		//we are avoiding watch due to performance issue
		$scope.presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
	}

	//getting the contact information
	var id = $stateParams.id;
	var data = {'id': id};
	$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, data, successCallbackOfInitialFetch);	

	/**
	* success callback of save data
	*/
	var successCallbackOfSaveData = function(data){
		$scope.$emit("hideLoader");
		if(typeof $stateParams.id !== 'undefined' && $stateParams.id !== ""){
			$scope.contactInformation.id = $stateParams.id;
		}
		else{
			$scope.contactInformation.id = data.id;
		}
		//taking a deep copy of copy of contact info. for handling save operation
		//we are avoiding watch due to performance issue
		$scope.presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
	}

	/**
	* function used to save the contact data, it will save only if there is any
	* change found in the present contact info.
	*/
	var saveContactInformation = function(data){
		var dataUpdated = false;
	    if(!angular.equals(data, $scope.presentContactInfo)) {
				dataUpdated = true;
		}

		if(dataUpdated){
			var dataToSend = JSON.parse(JSON.stringify(data));
			for(key in dataToSend){
				if(typeof dataToSend[key] !== "undefined" && data[key] != null && data[key] != ""){
					for(subDictKey in dataToSend[key]){
						if(typeof dataToSend[key][subDictKey] ==='undefined' || dataToSend[key][subDictKey] === $scope.presentContactInfo[key][subDictKey]){
							delete dataToSend[key][subDictKey];
						}						
					}
				}
				else{
					delete dataToSend[key];
				}
			}
			$scope.invokeApi(RVCompanyCardSrv.saveContactInformation, dataToSend, successCallbackOfSaveData);
		}
	}

	/**
	* recieving function for save contact with data
	*/
	$scope.$on("saveContactInformation", function(event){
		event.preventDefault();
		event.stopPropagation();
		saveContactInformation($scope.contactInformation);
	});

	/*** end of the contact info's controller class */
}]);