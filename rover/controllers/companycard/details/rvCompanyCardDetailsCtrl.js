angular.module('sntRover').controller('companyCardDetailsController', ['$scope', 'RVCompanyCardSrv', '$state', '$stateParams', 'ngDialog', '$filter', '$timeout', '$rootScope', 'rvPermissionSrv',
	function($scope, RVCompanyCardSrv, $state, $stateParams, ngDialog, $filter, $timeout, $rootScope, rvPermissionSrv) {

		// Flag for add new card or not
		$scope.isAddNewCard = ($stateParams.id === "add") ? true : false;

		/* Checking permision to show Commission Tab */

		$scope.hasPermissionToViewCommissionTab = function() {
			return rvPermissionSrv.getPermissionValue ('VIEW_COMMISSIONS_TAB');
		};

		$scope.isCommissionTabAvailable = $scope.hasPermissionToViewCommissionTab();
		$scope.isDiscard = false;
		$scope.isPromptOpened = false;
		$scope.isLogoPrint = true;
		$scope.isPrintArStatement = false;
		//setting the heading of the screen
		if ($stateParams.type === "COMPANY") {
			if ($scope.isAddNewCard) {
				$scope.heading = $filter('translate')('NEW_COMPANY_CARD');
			}
			else {
				$scope.heading = $filter('translate')('COMPANY_CARD');
			}
			$scope.cardTypeText = $filter('translate')('COMPANY');
			$scope.dataIdHeader = "company-card-header";
		} else if ($stateParams.type === "TRAVELAGENT") {
			if ($scope.isAddNewCard) {
				$scope.heading = $filter('translate')('NEW_TA_CARD');
			}
			else {
				$scope.heading = $filter('translate')('TA_CARD');
			}
			$scope.cardTypeText = $filter('translate')('TRAVELAGENT');
			$scope.dataIdHeader = "travel-agent-card-header";
		}

		$scope.$on('ARTransactionSearchFilter', function(e, data) {
			$scope.isWithFilters = data;
		});
		var setBackButtonCaption = function(){
	        if($rootScope.previousState.controller ==="rvAllotmentConfigurationCtrl")
	        {
	            $scope.searchBackButtonCaption = $filter('translate')('ALLOTMENTS');
	        }
	        else if($stateParams.origin === 'AR_OVERVIEW'){
	        	$scope.searchBackButtonCaption = $filter('translate')('MENU_ACCOUNTS_RECEIVABLES');
	        }
	        else if($stateParams.origin === 'COMMISION_SUMMARY'){
				$scope.searchBackButtonCaption = $filter('translate')('MENU_COMMISIONS');
			}else {
	            $scope.searchBackButtonCaption = $filter('translate')('FIND_CARDS');
	        }
        };
		$rootScope.$broadcast("viewFromCardsOutside");
		// Handle back button Click on card details page.
		setBackButtonCaption();
		$scope.headerBackButtonClicked = function() {

			// Save details if made changes.
			if($scope.currentSelectedTab === 'cc-contact-info'){
				saveContactInformation($scope.contactInformation);
			}
			else if($scope.currentSelectedTab === 'cc-contracts') {
				$scope.$broadcast("saveContract");
			}
			else if($scope.currentSelectedTab === 'cc-ar-accounts') {
				$scope.$broadcast("saveArAccount");
			}

			$state.go($rootScope.previousState, $rootScope.previousStateParams);
		};
		$scope.isContactInformationSaved = false;
		//inheriting some useful things
		BaseCtrl.call(this, $scope);

		//scope variable for tab navigation, based on which the tab will appear
		$scope.currentSelectedTab = 'cc-contact-info'; //initially contact information is active

		if (typeof $stateParams.type !== 'undefined' && $stateParams.type !== "") {
			$scope.account_type = $stateParams.type;
		}



		/**
		 * function to handle click operation on company card, mainly used for saving
		 */
		$scope.companyCardClicked = function($event) {

			//to check if click is outside the AR accounts Tab
			if (!getParentWithSelector($event, document.getElementById("cc-ar-accounts"))) {
				$scope.$broadcast("saveArAccount");
			};

			$event.stopPropagation();

			if (getParentWithSelector($event, document.getElementById("cc-contact-info")) && $scope.currentSelectedTab === 'cc-contact-info') {
				return;
			} else if (getParentWithSelector($event, document.getElementById("cc-contracts")) && $scope.currentSelectedTab === 'cc-contracts') {
				return;
			} else if (getParentWithSelector($event, document.getElementById("company-card-nested-first"))) {
				$scope.$emit("saveContactInformation");
			}



		};

		/*-------AR account starts here-----------*/
		
		$scope.$on('ERRORONARTAB', function(e) {
			$scope.switchTabTo('', 'cc-ar-accounts');
		});

		$scope.showArAccountButtonClick = function($event) {
			$scope.switchTabTo($event, 'cc-ar-accounts');
		};

		/**
		 * function to switch to new tab, will set $scope.currentSelectedTab to param variable
		 * @param{string} is the value of that tab
		 */
		$scope.switchTabTo = function($event, tabToSwitch) {

			if ($event !== undefined && $event !== "") {
				$event.stopPropagation();
				$event.stopImmediatePropagation();
			}
			// CICO-28058 - checking whether AR Number is present or not.
			var isArNumberAvailable = !!$scope.contactInformation && !!$scope.contactInformation.account_details && !!$scope.contactInformation.account_details.accounts_receivable_number;
			if ($scope.currentSelectedTab === 'cc-contact-info' && tabToSwitch !== 'cc-contact-info') {

				if ($scope.isAddNewCard && !$scope.isContactInformationSaved) {
					$scope.errorMessage = ["Please save " + $scope.cardTypeText + " card first"];
					if ($stateParams.type === "COMPANY") {
						$scope.$broadcast("setCardContactErrorMessage", [$filter('translate')('COMPANY_SAVE_PROMPT')]);
					} else {
						$scope.$broadcast("setCardContactErrorMessage", [$filter('translate')('TA_SAVE_PROMPT')]);
					}
					return;
				} else {
					saveContactInformation($scope.contactInformation);
					$scope.$broadcast("ContactTabActivated");
				}

			}
			if ($scope.currentSelectedTab === 'cc-contracts' && tabToSwitch !== 'cc-contracts') {
				$scope.$broadcast("saveContract");
			} else if ($scope.currentSelectedTab === 'cc-ar-accounts' && tabToSwitch !== 'cc-ar-accounts') {
				$scope.$broadcast("saveArAccount");
			}
			if (tabToSwitch === 'cc-ar-accounts') {
				$scope.$broadcast("arAccountTabActive");
				$scope.$broadcast("refreshAccountsScroll");
			}
			if (tabToSwitch === 'cc-contracts') {
				$scope.$broadcast("refreshContractsScroll");
			}
			if (tabToSwitch === 'cc-ar-transactions' && isArNumberAvailable) {
				$rootScope.$broadcast("arTransactionTabActive");
				$scope.isWithFilters = false;
			}
			if (tabToSwitch === 'cc-notes') {
				$scope.$broadcast("fetchNotes");
			}
			if (tabToSwitch === 'cc-contact-info') {
				$scope.$broadcast("contactTabActive");
			}
			if(tabToSwitch === 'cc-ar-transactions' && !isArNumberAvailable){
			  	console.warn("Save AR Account and Navigate to AR Transactions");
			}
			else{
				$scope.currentSelectedTab = tabToSwitch;
			}
		};


		$scope.showARTab = function($event) {
			$scope.isArTabAvailable = true;
			$scope.$broadcast('setgenerateNewAutoAr', true);
			$scope.showArAccountButtonClick($event);
		};

		//CICO-11664
		//To default the AR transactions tab while navigating back from staycard
		if ($stateParams.isBackFromStaycard) {
			$scope.isArTabAvailable = true;
			$scope.currentSelectedTab = 'cc-ar-transactions';
			$scope.$broadcast('setgenerateNewAutoAr', true);
			$scope.switchTabTo('', 'cc-ar-transactions');
		};

		$scope.$on('ARNumberChanged', function(e, data) {
			$scope.contactInformation.account_details.accounts_receivable_number = data.newArNumber;
		});

		$scope.deleteArAccount = function() {

			ngDialog.open({
				template: '/assets/partials/companyCard/rvCompanyCardDeleteARaccountPopup.html',
				className: 'ngdialog-theme-default1 calendar-single1',
				closeByDocument: false,
				scope: $scope
			});
		};

		$scope.deleteARAccountConfirmed = function() {
			var successCallbackOfdeleteArAccount = function() {
				$scope.$emit('hideLoader');
				$scope.isArTabAvailable = false;
				$scope.$broadcast('setgenerateNewAutoAr', false);
				$scope.$broadcast('ArAccountDeleted');
				$scope.contactInformation.account_details.accounts_receivable_number = "";
				ngDialog.close();
			};
			var dataToSend = {
				"id": $scope.contactInformation.id
			};
			$scope.invokeApi(RVCompanyCardSrv.deleteArAccount, dataToSend, successCallbackOfdeleteArAccount);
		};

		$scope.clikedDiscardDeleteAr = function() {
			ngDialog.close();
		};

		var callCompanyCardServices = function() {
			var param = {
				"id": $scope.contactInformation.id
			};
			var successCallbackFetchArNotes = function(data) {
				$scope.$emit("hideLoader");
				$scope.arAccountNotes = data;
				$scope.$broadcast('ARDetailsRecieved');
			};
			var fetchARNotes = function() {
				$scope.invokeApi(RVCompanyCardSrv.fetchArAccountNotes, param, successCallbackFetchArNotes);
			};

			var successCallbackFetchArDetails = function(data) {
				$scope.$emit("hideLoader");
				$scope.arAccountDetails = data;
				if ($scope.arAccountDetails.is_use_main_contact !== false) {
					$scope.arAccountDetails.is_use_main_contact = true;
				}
				if ($scope.arAccountDetails.is_use_main_address !== false) {
					$scope.arAccountDetails.is_use_main_address = true;
				}
				fetchARNotes();
			};
			$scope.invokeApi(RVCompanyCardSrv.fetchArAccountDetails, param, successCallbackFetchArDetails);

		};


		/*-------AR account ends here-----------*/


		/**
		 * remaining portion will be the Controller class of company card's contact info
		 */
		var presentContactInfo = {};
		/**
		 * success callback of initial fetch data
		 */
		var successCallbackOfInitialFetch = function(data) {
			$scope.$emit("hideLoader");
			$scope.contactInformation = data;
			if ($scope.contactInformation.alert_message !== "") {
				$scope.errorMessage = [$scope.contactInformation.alert_message];
			};
			if (typeof $stateParams.id !== 'undefined' && $stateParams.id !== "") {
				$scope.contactInformation.id = $stateParams.id;
				callCompanyCardServices();
			}
			//taking a deep copy of copy of contact info. for handling save operation
			//we are not associating with scope in order to avoid watch
			presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
			
			//CICO-20567-Select default to AR Transactions Tab
			if($stateParams.origin === 'AR_OVERVIEW'){
				$scope.switchTabTo('', 'cc-ar-transactions');
			}else if($stateParams.origin === 'COMMISION_SUMMARY'){
				$scope.switchTabTo('', 'cc-commissions');
			}
		};
		/**
		 * successcall back of commssion detail
		 */
		var successCallbackOffetchCommissionDetail = function(data){
			$scope.$emit("hideLoader");
			$scope.contactInformation["commission_details"] = data.commission_details;
		}

		/**
		 * successcall back of country list fetch
		 */
		var successCallbackOfCountryListFetch = function(data) {
			$scope.countries = data;
		};

		//fetching country list
		$scope.invokeApi(RVCompanyCardSrv.fetchCountryList, data, successCallbackOfCountryListFetch);

		//getting the contact information
		var id = $stateParams.id;
		// here we are following a bad practice for add screen,
		//we assumes that id will be equal to "add" in case for add, other for edit
		if (typeof id !== "undefined" && id === "add") {
			$scope.contactInformation = {};
			if (typeof $stateParams.query !== "undefined" && $stateParams.query !== "") {
				$scope.contactInformation.account_details = {};
				$scope.contactInformation.account_details.account_name = $stateParams.query;
			}

			//setting as null dictionary, will help us in saving..

			$scope.arAccountNotes = {};
			$scope.arAccountDetails = {};
			presentContactInfo = {};
			$scope.invokeApi(RVCompanyCardSrv.fetchCommissionDetail, data, successCallbackOffetchCommissionDetail);
		}
		//we are checking for edit screen
		else if (typeof id !== 'undefined' && id !== "") {
			var data = {
				'id': id
			};
			$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, data, successCallbackOfInitialFetch);
		}



		/**
		 * success callback of save contact data
		 */
		var successCallbackOfContactSaveData = function(data) {

			$scope.$emit("hideLoader");
			if (typeof data.id !== 'undefined' && data.id !== "") {
				//to check if id is defined or not before save
				var contactInfoAvailable = $scope.contactInformation.id ? true : false;
				$scope.contactInformation.id = data.id;
				if (!contactInfoAvailable) {
					callCompanyCardServices();
				}
			} else if (typeof $stateParams.id !== 'undefined' && $stateParams.id !== "") {
				$scope.contactInformation.id = $stateParams.id;
			}
			//taking a deep copy of copy of contact info. for handling save operation
			//we are not associating with scope in order to avoid watch
			presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
			//In the case of ass mode - rename the headding after saving contact info
			if ($scope.isAddNewCard) {
				//setting the heading of the screen
				if ($stateParams.type === "COMPANY") {
					$scope.heading = $filter('translate')('COMPANY_CARD');
				} else if ($stateParams.type === "TRAVELAGENT") {
					$scope.heading = $filter('translate')('TA_CARD');
				}
			}
			$scope.isAddNewCard = false;
			$scope.errorMessage = "";
			$scope.$broadcast("clearCardContactErrorMessage");
			$scope.$broadcast("IDGENERATED", {
				'id': data.id
			});
		};

		/**
		 * failure callback of save contact data
		 */
		var failureCallbackOfContactSaveData = function(errorMessage) {
			$scope.$emit("hideLoader");
			$scope.errorMessage = errorMessage;
			$scope.currentSelectedTab = 'cc-contact-info';
		};

		/**
		 * function used to save the contact data, it will save only if there is any
		 * change found in the present contact info.
		 */
		var saveContactInformation = function(data) {
			var dataUpdated = false;
			if (!angular.equals(data, presentContactInfo)) {
				dataUpdated = true;
			}

			if (dataUpdated) {
				var dataToSend = JSON.parse(JSON.stringify(data));
				for (key in dataToSend) {
					if (typeof dataToSend[key] !== "undefined" && data[key] !== null && data[key] !== "") {
						//in add case's first api call, presentContactInfo will be empty object
						if (JSON.stringify(presentContactInfo) !== '{}') {
							for (subDictKey in dataToSend[key]) {
								if(typeof presentContactInfo[key] !== 'undefined'){
									if (typeof dataToSend[key][subDictKey] === 'undefined' || dataToSend[key][subDictKey] === presentContactInfo[key][subDictKey]) {
										delete dataToSend[key][subDictKey];
									}
								}
							}
						}
					} else {
						delete dataToSend[key];
					}
				}
				if (typeof dataToSend.countries !== 'undefined') {
					delete dataToSend['countries'];
				}
				dataToSend.account_type = $stateParams.type;
				$scope.invokeApi(RVCompanyCardSrv.saveContactInformation, dataToSend, successCallbackOfContactSaveData, failureCallbackOfContactSaveData);
			}
		};

		/**
		 * recieving function for save contact with data
		 */
		$scope.$on("saveContactInformation", function(event) {
			event.preventDefault();
			event.stopPropagation();
			if ($scope.isAddNewCard) {
				// On addMode - prevent save call
			} else if ($scope.isDiscard) {
				// On discarded - prevent save call
			} else {
				saveContactInformation($scope.contactInformation);
			}
		});

		/*** end of the contact info's controller class */

		/**
		 * a reciever function to do operation on outside click, which is generated by outside click directive
		 */
		$scope.$on("OUTSIDECLICKED", function(event) {

			event.preventDefault();

			if ($scope.isAddNewCard && !$scope.isContactInformationSaved) {
				// On addMode and contact info not yet saved
				// If the prompt is not already opened - show the popup for save/disacrd
				if (!$scope.isPromptOpened) {
					$scope.saveNewCardPrompt();
				}
			}
			else if ($scope.isDiscard) {
				// On discarded - prevent save call
			}
			else if ($stateParams.isBackFromStaycard){
				// Back navigation from stay card.Do nothing here.
				//CICO-11664 to handle the back navigation from staycard.
			}
			else if ($scope.isContactInformationSaved){
			}
			else{

				if($scope.currentSelectedTab === 'cc-contact-info'){
					saveContactInformation($scope.contactInformation);
				}
				else if($scope.currentSelectedTab === 'cc-contracts') {
					$scope.$broadcast("saveContract");
				}
				else if($scope.currentSelectedTab === 'cc-ar-accounts') {
					$scope.$broadcast("saveArAccount");
				}
			}

		});
		// To handle click on save new card button on screen.
		$scope.clikedSaveNewCard = function() {
			saveContactInformation($scope.contactInformation);
			$scope.isContactInformationSaved = true;
		};
		// To handle click on save new card button on popup.
		$scope.clikedSaveNewCardViaPopup = function() {
			saveContactInformation($scope.contactInformation);
			$scope.isContactInformationSaved = true;
			ngDialog.close();
		};
		// To handle click on discard button.
		$scope.clikedDiscardCard = function() {
			$scope.isDiscard = true;
			$state.go('rover.companycardsearch', {
				'textInQueryBox': $stateParams.query
			});
			$scope.isAddNewCard = false;
			ngDialog.close();
		};
		// To implement a prompt for save/discard card info.
		$scope.saveNewCardPrompt = function() {
			$scope.isPromptOpened = true;
			ngDialog.open({
				template: '/assets/partials/companyCard/rvSaveNewCardPrompt.html',
				controller: 'saveNewCardPromptCtrl',
				className: 'ngdialog-theme-default1 calendar-single1',
				closeByDocument: false,
				scope: $scope
			});
		};

		// To handle logo upload explicitly via clicking company logo.
		$scope.clickedLogo = function() {
			/*
			 * Due to the special requirement, we need to do DOM access here.
			 * Since we are explicitily triggering click event, this should be outside of angular digest loop.
			 */
			$timeout(function() {
				angular.element('#uplaodCompanyLogo').trigger('click');
			}, 0, false);
		};

		$scope.isEmptyObject = isEmptyObject;
		
		// CICO-27364 - add class 'print-statement' if printing AR Transactions Statement.
		$scope.$on("PRINT_AR_STATEMENT", function(event, isPrintArStatement ) {
			$scope.isPrintArStatement = isPrintArStatement;
		});
	}
]);