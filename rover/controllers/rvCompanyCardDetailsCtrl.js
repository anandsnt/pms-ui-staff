sntRover.controller('companyCardDetailsController',['$scope', 'RVCompanyCardSrv', '$state', '$stateParams', function($scope, RVCompanyCardSrv, $state, $stateParams){
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
	$scope.switchTabTo = function($event, tabToSwitch){
		$event.stopPropagation();
		$event.stopImmediatePropagation();
		if($scope.currentSelectedTab == 'cc-contact-info' && tabToSwitch !== 'cc-contact-info'){
			saveContactInformation($scope.contactInformation);
			$scope.$broadcast("ContactTabActivated");
		}
		if($scope.currentSelectedTab == 'cc-contracts' && tabToSwitch !== 'cc-contracts'){
			$scope.$broadcast("saveContract");
		}		
		$scope.currentSelectedTab = tabToSwitch;
	}
	

		

	/**
	* function to handle click operation on company card, mainly used for saving
	*/
	$scope.companyCardClicked = function($event){
		$event.stopPropagation();
		if(getParentWithSelector($event, document.getElementById("cc-contact-info")) && $scope.currentSelectedTab == 'cc-contact-info'){
			return;
		}
		else if(getParentWithSelector($event, document.getElementById("cc-contracts")) && $scope.currentSelectedTab == 'cc-contracts'){
			return;
		}
		else if(getParentWithSelector($event, document.getElementById("company-card-nested-first"))){
			$scope.$emit("saveContactInformation");
		}
	}

	/**
	* remaining portion will be the Controller class of company card's contact info
	*/
	var presentContactInfo = {};
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
		//we are not associating with scope in order to avoid watch
		presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
	}

	//checking for type, if not found, choosing as travel-agent, need to discuss with team
	if(typeof $stateParams.type !== 'undefined' && $stateParams.type !== ""){
		$scope.account_type = $stateParams.type;
	}
	else{
		$scope.account_type = "travel-agent";
	}

	/**
	* successcall back of country list fetch
	*/
	var successCallbackOfCountryListFetch = function(data){
		$scope.countries = data;
	}

	//fetching country list
	$scope.invokeApi(RVCompanyCardSrv.fetchCountryList, data, successCallbackOfCountryListFetch);	

	//getting the contact information
	var id = $stateParams.id;
	// here we are following a bad practice for add screen, 
	//we assumes that id will be equal to "add" in case for add, other for edit
	if(typeof id !== "undefined" && id === "add") {
		$scope.contactInformation = {};
		if(typeof $stateParams.firstname !== "undefined" && $stateParams.firstname !== "") {
			$scope.contactInformation.company_details = {};
			$scope.contactInformation.company_details.account_first_name = $stateParams.firstname;
		}

		//setting as null dictionary, will help us in saving..
		presentContactInfo = {};

	}
	//we are checking for edit screen
	else if(typeof id !== 'undefined' && id !== ""){
		var data = {'id': id};		
		$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, data, successCallbackOfInitialFetch);	
	}

	/**
	* success callback of save contact data
	*/
	var successCallbackOfContactSaveData = function(data){
		console.log('in success');
		
		$scope.$emit("hideLoader");
		console.log($scope.contactInformation.id);
		if(typeof data.id !== 'undefined' && data.id !== ""){
			$scope.contactInformation.id = data.id;
		}
		else if(typeof $stateParams.id !== 'undefined' && $stateParams.id !== ""){
			$scope.contactInformation.id = $stateParams.id;
		}
		//taking a deep copy of copy of contact info. for handling save operation
		//we are not associating with scope in order to avoid watch
		presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
	}

	/**
	* failure callback of save contact data
	*/
	var failureCallbackOfContactSaveData = function(errorMessage){
		$scope.$emit("hideLoader");
		$scope.errorMessage = errorMessage;
		$scope.currentSelectedTab = 'cc-contact-info';
	}

	/**
	* function used to save the contact data, it will save only if there is any
	* change found in the present contact info.
	*/
	var saveContactInformation = function(data){
		var dataUpdated = false;
	    if(!angular.equals(data, presentContactInfo)) {
				dataUpdated = true;
		}

		if(dataUpdated){
			var dataToSend = JSON.parse(JSON.stringify(data));
			for(key in dataToSend){
				if(typeof dataToSend[key] !== "undefined" && data[key] != null && data[key] != ""){
					//in add case's first api call, presentContactInfo will be empty object					
					if(JSON.stringify(presentContactInfo) !== '{}'){
						for(subDictKey in dataToSend[key]){
							if(typeof dataToSend[key][subDictKey] ==='undefined' || dataToSend[key][subDictKey] === presentContactInfo[key][subDictKey]){
								delete dataToSend[key][subDictKey];
							}						
						}
					}
				}
				else{
					delete dataToSend[key];
				}
			}
			if(typeof dataToSend.countries !== 'undefined'){
				delete dataToSend['countries'];
			}
			$scope.invokeApi(RVCompanyCardSrv.saveContactInformation, dataToSend, successCallbackOfContactSaveData, failureCallbackOfContactSaveData);
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

	/**
	* a reciever function to do operation on outside click, which is generated by outside click directive
	*/
	$scope.$on("OUTSIDECLICKED", function(event){
		event.preventDefault();
		saveContactInformation($scope.contactInformation);
	});
}]);