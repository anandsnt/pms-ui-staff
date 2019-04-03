angular.module('sntRover').controller('companyCardDetailsController', ['$scope', 'RVCompanyCardSrv', '$state', '$stateParams', 'ngDialog', '$filter', '$timeout', '$rootScope', 'rvPermissionSrv', '$interval', '$log',
	function($scope, RVCompanyCardSrv, $state, $stateParams, ngDialog, $filter, $timeout, $rootScope, rvPermissionSrv, $interval, $log) {

		// Flag for add new card or not
		$scope.isAddNewCard = ($stateParams.id === "add");	

		/* Checking permision to show Commission Tab */

		$scope.hasPermissionToViewCommissionTab = function() {
			return rvPermissionSrv.getPermissionValue ('VIEW_COMMISSIONS_TAB');
		};

		/**
		* function to check whether the user has permission
		* to create/edit AR Account.
		* @return {Boolean}
		*/
		$scope.hasPermissionToCreateArAccount = function() {
			return rvPermissionSrv.getPermissionValue ('CREATE_AR_ACCOUNT');
		};

		$scope.isCommissionTabAvailable = $scope.hasPermissionToViewCommissionTab();
		$scope.isDiscard = false;
		$scope.isPromptOpened = false;
		$scope.isLogoPrint = true;
		$scope.isPrintArStatement = false;
		$scope.contactInformation = {};
		$scope.isGlobalToggleReadOnly = !rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE');
		var createArAccountCheck = false;

		// setting the heading of the screen
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

		$scope.setTitle ($scope.heading);

		$scope.$on('ARTransactionSearchFilter', function(e, data) {
			$scope.isWithFilters = data;
		});
		var setBackButtonCaption = function() {
	        if ($rootScope.previousState.controller === "rvAllotmentConfigurationCtrl")
	        {
	            $scope.searchBackButtonCaption = $filter('translate')('ALLOTMENTS');
	        }
	        else if ($stateParams.origin === 'AR_OVERVIEW') {
	        	$scope.searchBackButtonCaption = $filter('translate')('MENU_ACCOUNTS_RECEIVABLES');
	        }
	        else if ($stateParams.origin === 'COMMISION_SUMMARY') {
				$scope.searchBackButtonCaption = $filter('translate')('MENU_COMMISIONS');
			} else if ($stateParams.isMergeViewSelected) {
				$scope.searchBackButtonCaption = $filter('translate')('MERGE_CARDS');			}
			else {
	            $scope.searchBackButtonCaption = $filter('translate')('FIND_CARDS');
	        }
        };

		$rootScope.$broadcast("viewFromCardsOutside");
		// Handle back button Click on card details page.
		setBackButtonCaption();
		$scope.headerBackButtonClicked = function() {

			// Save details if made changes.
			if ($scope.currentSelectedTab === 'cc-contact-info') {
				saveContactInformation($scope.contactInformation);
			}
			else if ($scope.currentSelectedTab === 'cc-contracts') {
				$scope.$broadcast("saveContract");
			}
			else if ($scope.currentSelectedTab === 'cc-ar-accounts') {
				$scope.$broadcast("saveArAccount");
			}

			$state.go($rootScope.previousState, $rootScope.previousStateParams);
		};
		$scope.isContactInformationSaved = false;
		// inheriting some useful things
		BaseCtrl.call(this, $scope);

		// scope variable for tab navigation, based on which the tab will appear
		$scope.currentSelectedTab = 'cc-contact-info'; // initially contact information is active

		if (typeof $stateParams.type !== 'undefined' && $stateParams.type !== "") {
			$scope.account_type = $stateParams.type;
		}


		/**
		 * function to handle click operation on company card, mainly used for saving
		 */
		$scope.companyCardClicked = function($event) {			

			$event.stopPropagation();

			if (getParentWithSelector($event, document.getElementById("cc-contact-info")) && $scope.currentSelectedTab === 'cc-contact-info') {
				return;
			} else if (getParentWithSelector($event, document.getElementById("cc-contracts")) && $scope.currentSelectedTab === 'cc-contracts') {
				return;
			} else if (getParentWithSelector($event, document.getElementById("company-card-nested-first"))) {
				$scope.$emit("saveContactInformation");
			}
			// to check if click is outside the AR accounts Tab
			if (!getParentWithSelector($event, document.getElementById("cc-ar-accounts"))) {
				$scope.$broadcast("saveArAccount");
			}
			$scope.$broadcast("CLEAR_ERROR_MESSAGE");
		};

		/* -------AR account starts here-----------*/

		$scope.$on('ERRORONARTAB', function(e) {
			$scope.isArTabAvailable = true;
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
					if (tabToSwitch === 'cc-ar-accounts') {
						$scope.showARTab();
					} else {
						saveContactInformation($scope.contactInformation);
						$scope.$broadcast("ContactTabActivated");
					}
					
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
			if (tabToSwitch === 'cc-commissions') {
				$scope.$broadcast("commissionsTabActive");
			}
			if (tabToSwitch === 'cc-activity-log') {
				$scope.$broadcast("activityLogTabActive");
			}
			if (tabToSwitch === 'statistics') {
				$scope.$broadcast("LOAD_STATISTICS");
			}
			if (tabToSwitch === 'cc-ar-transactions' && !isArNumberAvailable) {
			  	console.warn("Save AR Account and Navigate to AR Transactions");
			}
			else {
				$scope.currentSelectedTab = tabToSwitch;
			}
		};

		$scope.openCompanyTravelAgentCardMandatoryFieldsPopup = function() {
			$scope.shouldSaveArDataFromPopup = false;
			ngDialog.open({
				template: '/assets/partials/companyCard/rvCompanyTravelAgentCardMandatoryFieldsPopup.html',
				className: 'ngdialog-theme-default1 calendar-single1',
				controller: 'companyTravelAgentMandatoryFieldsController',
				closeByDocument: false,
				scope: $scope
			});
		};

		$scope.clickedCreateArAccountButton = function() {
			$scope.isMandatoryPopupOpen = true;
			$scope.openCompanyTravelAgentCardMandatoryFieldsPopup();				
		};

		$scope.$on("UPDATE_MANDATORY_POPUP_OPEN_FLAG", function() {
			$scope.isMandatoryPopupOpen = false;
		});

		$scope.showARTab = function() {
			createArAccountCheck = true;
			saveContactInformation($scope.contactInformation);
		};

		$scope.$on("saveArAccountFromMandatoryPopup", function(e, data) {
			$scope.arAccountDetails = data;
			$scope.isArTabAvailable = true;
			$scope.shouldSaveArDataFromPopup = true;
		});




		$scope.$on("UPDATE_AR_ACCOUNT_DETAILS_AFTER_DELETE", function(e, data) {
			$scope.arAccountDetails = data;
		});

		/*
		*	CICO-45240
		*	Fixes loop caused when navigating in the following flows:
		*	- Search AR Trans/Company & TA Cards -> Balance/Paid Tabs of CC -> Reservation Stay Card -> 
		*		Back to Balance/Paid tabs -> Back to AR Trans/Company & TA Cards search
		*/
		if (!$stateParams.isBackFromStaycard) {
			if ($stateParams.isMergeViewSelected) {
				$rootScope.prevStateBookmarkDataFromAR = {
					title: $scope.searchBackButtonCaption,
					name: $rootScope.previousState.name
				};
			} else {
				$rootScope.prevStateBookmarkDataFromAR = {
					title: $scope.searchBackButtonCaption,
					name: $rootScope.previousState.name
				};
			}

		}
		// CICO-11664
		// To default the AR transactions tab while navigating back from staycard
		if ($stateParams.isBackFromStaycard) {
			$scope.isArTabAvailable = !$stateParams.isBackToTACommission && !$stateParams.isBackToStatistics;
			/*
			*	CICO-45240 - Replace prevState data to that which we stored before going to Staycard.
			*/
			if ($rootScope.prevStateBookmarkDataFromAR.title === $filter('translate')('FIND_CARDS') || $rootScope.prevStateBookmarkDataFromAR.title === $filter('translate')('MENU_ACCOUNTS_RECEIVABLES')) {
				$rootScope.setPrevState = {
					title: $rootScope.prevStateBookmarkDataFromAR.title,
					name: $rootScope.prevStateBookmarkDataFromAR.name
				};
			}

			// CICO-44250 - The deep copy of contactInformation made is applied here
			//		in case it becomes undefined while coming back from StayCard
			if (typeof($scope.contactInformation) === 'undefined') {
				$scope.contactInformation = angular.copy($rootScope.prevStateBookmarkDataFromAR.contactInformation);
			}

			if ($stateParams.isBackToStatistics) {
				$scope.currentSelectedTab = 'statistics';
				$scope.$broadcast('LOAD_STATISTICS');
			}
			/*
			*	CICO-45268 - Added $timeout to fix issue with data not being displayed on returning from Staycard.
			*/
			else if ($scope.isArTabAvailable) {
				$timeout(function() {
					$scope.currentSelectedTab = 'cc-ar-transactions';
					$scope.$broadcast('setgenerateNewAutoAr', true);
					$scope.switchTabTo('', 'cc-ar-transactions');
				}, 500);
				$timeout(function() {
					$scope.$broadcast('BACK_FROM_STAY_CARD');
				}, 1000);
			}
			
		}
		// CICO-36080 - Back from staycard - Commissions tab as selected
		if ($stateParams.isBackToTACommission) {
			$scope.currentSelectedTab = 'cc-commissions';
		}

		$scope.$on('ARNumberChanged', function(e, data) {
			$scope.contactInformation.account_details.accounts_receivable_number = data.newArNumber;
			if ($scope.isMandatoryPopupOpen) {
				$scope.arAccountDetails.payment_due_days = null;
				$scope.arAccountDetails.ar_number = data.newArNumber;
				$scope.openCompanyTravelAgentCardMandatoryFieldsPopup();
			}
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
		/*
		 * Toggle global button
		 */
		$scope.toggleGlobalButton = function() {
			if (rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE')) {
				$scope.contactInformation.is_global_enabled = !$scope.contactInformation.is_global_enabled;
				$scope.contactInformation.account_type = $scope.account_type;
			}

			$timeout(function() {
                $scope.$broadcast("LOAD_SUBSCRIBED_MPS");
				$scope.activateSelectedTab();				
			}, 1000);
		};
		/*
		 * Activate selected tab
		 */
		$scope.activateSelectedTab = function() {
			if ($scope.currentSelectedTab === 'cc-contact-info') {
				$scope.$broadcast("ContactTabActivated");
				$scope.$broadcast("contactTabActive");
			}
            if ($scope.currentSelectedTab === 'cc-contracts') {
				$scope.$broadcast("refreshContractsScroll");
			}
            if ($scope.currentSelectedTab === 'cc-ar-accounts') {
				$scope.$broadcast("arAccountTabActive");
				$scope.$broadcast("refreshAccountsScroll");
			}
	        if ($scope.currentSelectedTab === 'cc-ar-transactions') {
				$rootScope.$broadcast("arTransactionTabActive");
				$scope.isWithFilters = false;
			}
			if ($scope.currentSelectedTab === 'cc-notes') {
				$scope.$broadcast("fetchNotes");
			}
			if ($scope.currentSelectedTab === 'cc-commissions') {
				$scope.$broadcast("commissionsTabActive");
			}
		};

		$scope.shouldShowCommissionsTab = function() {
			return ($scope.account_type === 'TRAVELAGENT');
		};
		/*
		 * is update enabled for company cards
		 */
		$scope.isUpdateEnabled = function(shouldCheckContracts) {
			if ($scope.contactInformation.is_global_enabled === undefined) {
				return;
			}
			var isDisabledFields = false;
			
			if ($scope.contactInformation.is_global_enabled) {
				if (!rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE')) {
					isDisabledFields = true;
				}
			} else {
				if (!rvPermissionSrv.getPermissionValue ('EDIT_COMPANY_CARD')) {
					isDisabledFields = true;
				}
			}

			return (shouldCheckContracts) ?  isDisabledFields || !$scope.isUpdateEnabledForName() : isDisabledFields;
		};
		/*
		 * Added the same method in travel agent ctrl
		 * We are using the partials for TA and CC, when navigating thru staycard or thru revenue management
		 * When we go to travel agent from staycard, controller is travelagentctrl
		 * When we go to travel agent from revenue management, controller is this
		 */
		$scope.isUpdateEnabledForTravelAgent = function(shouldCheckContracts) {
			if ($scope.contactInformation.is_global_enabled === undefined) {
				return;
			}
			var isDisabledFields = false;

			if ($scope.contactInformation.is_global_enabled) {
				if (!rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE')) {
					isDisabledFields = true;
				}
			} else {
				if (!rvPermissionSrv.getPermissionValue ('EDIT_TRAVEL_AGENT_CARD')) {
					isDisabledFields = true;
				}
			}

			return (shouldCheckContracts) ?  isDisabledFields || !$scope.isUpdateEnabledForName() : isDisabledFields;
		};
		/*
		 * If contract rate exists then should not allow editing name of CC/TA - CICO-56441
		 */
		$scope.isUpdateEnabledForName = function() {
			var contractedRates = RVCompanyCardSrv.getContractedRates(),
				isUpdateEnabledForNameInCard = true;

			if (contractedRates.current_contracts.length > 0 || contractedRates.future_contracts.length > 0 || contractedRates.history_contracts.length > 0) {
				isUpdateEnabledForNameInCard = false;
			}
			return isUpdateEnabledForNameInCard;
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

		$scope.addListener("MANDATORY_CHECK_FAILED", function(event, errorMessage) {
			$scope.$broadcast("setCardContactErrorMessage",  errorMessage);
			$scope.isArTabAvailable = false;
			$scope.switchTabTo('', 'cc-contact-info');
		});


		/* -------AR account ends here-----------*/


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
			$scope.contactInformation.emailStyleClass = $rootScope.roverObj.isAnyInterfaceEnabled ? 'margin' : 'full-width';
			$scope.$broadcast("LOAD_SUBSCRIBED_MPS");
			$scope.$broadcast('UPDATE_CONTACT_INFO');
			if ($scope.contactInformation.alert_message !== "") {
				$scope.errorMessage = [$scope.contactInformation.alert_message];
			}
			if (typeof $stateParams.id !== 'undefined' && $stateParams.id !== "") {
				$scope.contactInformation.id = $stateParams.id;
				callCompanyCardServices();
			}
			// taking a deep copy of copy of contact info. for handling save operation
			// we are not associating with scope in order to avoid watch
			presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
			// CICO-44250 - Keeps a deep copy of contact information to use when coming back from Staycard if needed.
			$rootScope.prevStateBookmarkDataFromAR.contactInformation = angular.copy($scope.contactInformation);

			// CICO-20567-Select default to AR Transactions Tab
			if ($stateParams.origin === 'AR_OVERVIEW') {
				$scope.switchTabTo('', 'cc-ar-transactions');
			} else if ($stateParams.origin === 'COMMISION_SUMMARY') {
				$scope.switchTabTo('', 'cc-commissions');
			}
		};
		/**
		 * successcall back of commssion detail
		 */
		var successCallbackOffetchCommissionDetail = function(data) {
			$scope.$emit("hideLoader");	
			if (!angular.isDefined($scope.contactInformation.address_details)) {
				$scope.contactInformation.address_details = {
																"street1": "",
																"street2": "",
																"street3": "",
																"city": "",
																"state": "",
																"postal_code": "",
																"country_id": "",
																"email_address": "",
																"phone": "",
																"fax": "",
																"location": ""
															};
	
			}
			if (!angular.isDefined($scope.contactInformation.primary_contact_details)) {

				$scope.contactInformation.primary_contact_details = {
																		"contact_first_name": "",
																		"contact_last_name": "",
																		"contact_job_title": "",
																		"contact_phone": "",
																		"contact_email": ""
																	};
			}
	 
			$scope.contactInformation.mandatoryFields = data.mandatoryFields;
			$scope.contactInformation.emailStyleClass = $scope.contactInformation.mandatoryFields.e_invoice_mandatory.is_visible ? 'margin' : 'full-width';
			$scope.contactInformation["commission_details"] = data.commission_details;
		};

		/**
		 * successcall back of country list fetch
		 */
		var successCallbackOfCountryListFetch = function(data) {
			$scope.countries = data;
		};

		// fetching country list
		$scope.invokeApi(RVCompanyCardSrv.fetchCountryList, data, successCallbackOfCountryListFetch);

		// getting the contact information
		var id = $stateParams.id;
		$scope.shouldShowStatisticsTab = $stateParams.id !== 'add';
		// here we are following a bad practice for add screen,
		// we assumes that id will be equal to "add" in case for add, other for edit

		if (typeof id !== "undefined" && id === "add") {
			$scope.contactInformation = {};
			if (typeof $stateParams.query !== "undefined" && $stateParams.query !== "") {
				$scope.contactInformation.account_details = {
																"organization_id": null,
																"reg_tax_office": null,
																"tax_number": null
															};
				$scope.contactInformation.account_details.account_name = $stateParams.query;
			}			

			// setting as null dictionary, will help us in saving..

			$scope.arAccountNotes = {};
			$scope.arAccountDetails = {};
			presentContactInfo = {};
			
			$scope.invokeApi(RVCompanyCardSrv.fetchCommissionDetailsAndMandatoryFields, data, successCallbackOffetchCommissionDetail);
		}
		// we are checking for edit screen
		else if (typeof id !== 'undefined' && id !== "") {
			var data = {
				'id': id
			};

			$scope.invokeApi(RVCompanyCardSrv.fetchContactInformationAndMandatoryFields, data, successCallbackOfInitialFetch);
		}


		/**
		 * success callback of save contact data
		 */
		var successCallbackOfContactSaveData = function(data) {
			if ($scope.shouldSaveArDataFromPopup) {	
				$scope.shouldSaveArDataFromPopup = false;	
				$scope.$broadcast("UPDATE_AR_ACCOUNT_DETAILS", $scope.arAccountDetails);			
				$scope.$broadcast("saveArAccount");
			}
			if (createArAccountCheck) {
				createArAccountCheck = false;
				$scope.$broadcast('setgenerateNewAutoAr', true);
				return;
			}			

			if (typeof data.id !== 'undefined' && data.id !== "") {
				// to check if id is defined or not before save
				var contactInfoAvailable = $scope.contactInformation.id ? true : false;

				$scope.contactInformation.id = data.id;
				if (!contactInfoAvailable) {
					callCompanyCardServices();
				}
			} else if (typeof $stateParams.id !== 'undefined' && $stateParams.id !== "") {
				$scope.contactInformation.id = $stateParams.id;
			}
			// taking a deep copy of copy of contact info. for handling save operation
			// we are not associating with scope in order to avoid watch
			presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
			// In the case of ass mode - rename the headding after saving contact info
			if ($scope.isAddNewCard) {
				// setting the heading of the screen
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
			$scope.$broadcast("setCardContactErrorMessage", errorMessage);
			// $scope.errorMessage = errorMessage;
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

				if (typeof dataToSend.countries !== 'undefined') {
					delete dataToSend['countries'];
				}
				// CICO-49040 : Hadling passing blank string.
				if (dataToSend.account_details.account_number === "") {
					dataToSend.account_details.account_number = null;
				}
				// CICO-50810 : Hadling passing blank string.
				if ( typeof dataToSend.primary_contact_details === 'undefined' ) {
					dataToSend.primary_contact_details = {};
					dataToSend.primary_contact_details.contact_email = null;
				}
				else if (dataToSend.primary_contact_details.contact_email === "") {
					dataToSend.primary_contact_details.contact_email = null;
				}
				if ( typeof dataToSend.address_details === 'undefined' ) {
					dataToSend.address_details = {};
				}
				dataToSend.account_type = $stateParams.type;
				var options = {
					params: dataToSend,
					successCallBack: successCallbackOfContactSaveData,
					failureCallBack: failureCallbackOfContactSaveData
				};

				$scope.callAPI(RVCompanyCardSrv.saveContactInformation, options);
			} else {
				if ($scope.shouldSaveArDataFromPopup) {
					$scope.shouldSaveArDataFromPopup = false;			
					$scope.$broadcast("UPDATE_AR_ACCOUNT_DETAILS", $scope.arAccountDetails);			
					$scope.$broadcast("saveArAccount");
				}
				if (createArAccountCheck) {
					$scope.$broadcast('setgenerateNewAutoAr', true);
				}
				createArAccountCheck = false;				
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

		/** * end of the contact info's controller class */

		/**
		 * a reciever function to do operation on outside click, which is generated by outside click directive
		 */
		$scope.$on("OUTSIDECLICKED", function(event) {

			event.preventDefault();

			if ($scope.isMandatoryPopupOpen) {
				return;
			}

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
			else if ($stateParams.isBackFromStaycard) {
				// Back navigation from stay card.Do nothing here.
				// CICO-11664 to handle the back navigation from staycard.
			}
			else if ($scope.isContactInformationSaved) {
			}
			else {

				if ($scope.currentSelectedTab === 'cc-contact-info') {
					saveContactInformation($scope.contactInformation);
				}
				else if ($scope.currentSelectedTab === 'cc-contracts') {
					$scope.$broadcast("saveContract");
				}
				else if ($scope.currentSelectedTab === 'cc-ar-accounts') {
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
			if ($stateParams.type === "TRAVELAGENT") {
				if (!$scope.isUpdateEnabledForTravelAgent()) {
					$timeout(function() {
						angular.element('#uplaodCompanyLogo').trigger('click');
					}, 0, false);
				}
			
			} else if ($stateParams.type === "COMPANY") {
				if (!$scope.isUpdateEnabled()) {
					$timeout(function() {
						angular.element('#uplaodCompanyLogo').trigger('click');
					}, 0, false);
				}
			}			
		};

		$scope.isEmptyObject = isEmptyObject;

		// CICO-27364 - add class 'print-statement' if printing AR Transactions Statement.
		$scope.$on("PRINT_AR_STATEMENT", function(event, isPrintArStatement ) {
			$scope.isPrintArStatement = isPrintArStatement;
		});

        if (!$rootScope.disableObserveForSwipe) {
            CardReaderCtrl.call(this, $scope, $rootScope, $timeout, $interval, $log);
            $scope.observeForSwipe();
        }
    }
]);
