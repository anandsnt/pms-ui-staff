sntRover.controller('companyCardDetailsController', ['$scope', 'RVCompanyCardSrv', '$state', '$stateParams', 'ngDialog', '$filter',
	function($scope, RVCompanyCardSrv, $state, $stateParams, ngDialog, $filter) {

		console.log("$stateParams type --" + $stateParams.type);
		console.log("$stateParams id --" + $stateParams.id);
		// Flag for add new card or not
		$scope.isAddNewCard = ($stateParams.id == "add") ? true : false;
		$scope.isDiscard = false;
		$scope.isPromptOpened = false;
		//setting the heading of the screen
		if ($stateParams.type == "COMPANY") {
			if ($scope.isAddNewCard) $scope.heading = $filter('translate')('NEW_COMPANY_CARD');
			else $scope.heading = $filter('translate')('COMPANY_CARD');
			$scope.cardTypeText = $filter('translate')('COMPANY');
			$scope.dataIdHeader = "company-card-header";
		} else if ($stateParams.type == "TRAVELAGENT") {
			if ($scope.isAddNewCard) $scope.heading = $filter('translate')('NEW_TA_CARD');
			else $scope.heading = $filter('translate')('TA_CARD');
			$scope.cardTypeText = $filter('translate')('TRAVELAGENT');
			$scope.dataIdHeader = "travel-agent-card-header";
		}

		$scope.isContactInformationSaved = false;
		//inheriting some useful things
		BaseCtrl.call(this, $scope);

		//scope variable for tab navigation, based on which the tab will appear
		$scope.currentSelectedTab = 'cc-contact-info'; //initially contact information is active

		if (typeof $stateParams.type !== 'undefined' && $stateParams.type !== "") {
			$scope.account_type = $stateParams.type;
		}

		/**
		 * function to switch to new tab, will set $scope.currentSelectedTab to param variable
		 * @param{string} is the value of that tab
		 */
		$scope.switchTabTo = function($event, tabToSwitch) {
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			if ($scope.currentSelectedTab == 'cc-contact-info' && tabToSwitch !== 'cc-contact-info') {

				if ($scope.isAddNewCard && !$scope.isContactInformationSaved) {
					$scope.errorMessage = ["Please save " + $scope.cardTypeText + " card first"];
					return;
				} else {
					saveContactInformation($scope.contactInformation);
					$scope.$broadcast("ContactTabActivated");
				}

			}
			if ($scope.currentSelectedTab == 'cc-contracts' && tabToSwitch !== 'cc-contracts') {
				$scope.$broadcast("saveContract");
			}
			$scope.currentSelectedTab = tabToSwitch;
		};



		/**
		 * function to handle click operation on company card, mainly used for saving
		 */
		$scope.companyCardClicked = function($event) {
			$event.stopPropagation();
			if (getParentWithSelector($event, document.getElementById("cc-contact-info")) && $scope.currentSelectedTab == 'cc-contact-info') {
				return;
			} else if (getParentWithSelector($event, document.getElementById("cc-contracts")) && $scope.currentSelectedTab == 'cc-contracts') {
				return;
			} else if (getParentWithSelector($event, document.getElementById("company-card-nested-first"))) {
				$scope.$emit("saveContactInformation");
			}
		};

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
			if (typeof $stateParams.id !== 'undefined' && $stateParams.id !== "") {
				$scope.contactInformation.id = $stateParams.id;
			}
			//taking a deep copy of copy of contact info. for handling save operation
			//we are not associating with scope in order to avoid watch
			presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
		};

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
			if (typeof $stateParams.firstname !== "undefined" && $stateParams.firstname !== "") {
				$scope.contactInformation.account_details = {};
				$scope.contactInformation.account_details.account_name = $stateParams.firstname;
			}

			//setting as null dictionary, will help us in saving..
			presentContactInfo = {};

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
			console.log('in success');

			$scope.$emit("hideLoader");
			console.log($scope.contactInformation.id);
			if (typeof data.id !== 'undefined' && data.id !== "") {
				$scope.contactInformation.id = data.id;
			} else if (typeof $stateParams.id !== 'undefined' && $stateParams.id !== "") {
				$scope.contactInformation.id = $stateParams.id;
			}
			//taking a deep copy of copy of contact info. for handling save operation
			//we are not associating with scope in order to avoid watch
			presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
			console.log(presentContactInfo);
			//In the case of ass mode - rename the headding after saving contact info
			if ($scope.isAddNewCard) {
				//setting the heading of the screen
				if ($stateParams.type == "COMPANY") {
					$scope.heading = $filter('translate')('COMPANY_CARD');
				} else if ($stateParams.type == "TRAVELAGENT") {
					$scope.heading = $filter('translate')('TA_CARD');
				}
			}
			$scope.isAddNewCard = false;
			$scope.errorMessage = "";
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

			if (dataUpdated && typeof data != "undefined") {
				var dataToSend = JSON.parse(JSON.stringify(data));
				for (key in dataToSend) {
					if (typeof dataToSend[key] !== "undefined" && data[key] != null && data[key] != "") {
						//in add case's first api call, presentContactInfo will be empty object					
						if (JSON.stringify(presentContactInfo) !== '{}') {
							for (subDictKey in dataToSend[key]) {
								if (typeof dataToSend[key][subDictKey] === 'undefined' || dataToSend[key][subDictKey] === presentContactInfo[key][subDictKey]) {
									delete dataToSend[key][subDictKey];
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
				console.log(dataToSend);
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
				if (!$scope.isPromptOpened) $scope.saveNewCardPrompt();
			} else if ($scope.isDiscard) {
				// On discarded - prevent save call
			} else {
				saveContactInformation($scope.contactInformation);
			}
		});
		// To handle click on save new card button on screen.
		$scope.clikedSaveNewCard = function() {
			saveContactInformation($scope.contactInformation);
			$scope.isContactInformationSaved = true;
		};
		// To handle click on save new card button on popup.
		$scope.clikedSaveNewCardViaPopup = function() {
			$scope.isContactInformationSaved = true;
			ngDialog.close();
		};
		// To handle click on discard button.
		$scope.clikedDiscardCard = function() {
			$scope.isDiscard = true;
			$state.go('rover.companycardsearch', {
				'textInQueryBox': $stateParams.firstname
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
	}
]);