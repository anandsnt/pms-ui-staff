angular.module('sntRover').controller('RVCompanyCardCtrl', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', 'ngDialog', '$filter', '$stateParams',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, ngDialog, $filter, $stateParams) {
		$scope.searchMode = true;
		$scope.account_type = 'COMPANY';
		$scope.currentSelectedTab = 'cc-contact-info';

		// initialize company search fields
		$scope.companySearchIntiated = false;
		$scope.companies = [];

		var presentContactInfo = {};
		$scope.arAccountDetails = {};

		//handle tab switching in both cards
		$scope.switchTabTo = function($event, tabToSwitch) {
			$event.stopPropagation();
			$event.stopImmediatePropagation();

			// CICO-28058 - checking whether AR Number is present or not.
			var isArNumberAvailable = !!$scope.contactInformation.account_details.accounts_receivable_number;

			if ($scope.currentSelectedTab === 'cc-contact-info' && tabToSwitch !== 'cc-contact-info') {
				if ($scope.viewState.isAddNewCard) {
					$scope.$broadcast("setCardContactErrorMessage", [$filter('translate')('COMPANY_SAVE_PROMPT')]);
				} else {
					saveContactInformation($scope.contactInformation);
				}
			}
			if ($scope.currentSelectedTab === 'cc-contracts' && tabToSwitch !== 'cc-contracts') {
				$scope.$broadcast("contactTabActive");
				$scope.$broadcast("saveContract");
			} else if ($scope.currentSelectedTab === 'cc-ar-accounts' && tabToSwitch !== 'cc-ar-accounts') {
				$scope.$broadcast("saveArAccount");
			}

			if (tabToSwitch === 'cc-ar-accounts') {
				$scope.$broadcast("arAccountTabActive");
			} else if (tabToSwitch === 'cc-contracts') {
				$scope.$broadcast("contractTabActive");
			} else if (tabToSwitch === 'cc-contact-info') {
				$scope.$broadcast("contactTabActive");
			}
			else if (tabToSwitch === 'cc-ar-transactions' && isArNumberAvailable) {
				$scope.$broadcast("arTransactionTabActive");
				$scope.isWithFilters = false;
			}
			else if (tabToSwitch === 'cc-notes') {
				$scope.$broadcast("fetchNotes");
			}
			if(tabToSwitch === 'cc-ar-transactions' && !isArNumberAvailable){
			  	console.warn("Save AR Account and Navigate to AR Transactions");
			}
			else if (!$scope.viewState.isAddNewCard) {
				$scope.currentSelectedTab = tabToSwitch;
			}
		};

		$scope.$on('ARTransactionSearchFilter', function(e, data) {
			$scope.isWithFilters = data;
		});

		/*-------AR account starts here-----------*/

		$scope.showARTab = function($event) {
			$scope.isArTabAvailable = true;
			$scope.$broadcast('setgenerateNewAutoAr', true);
			$scope.switchTabTo($event, 'cc-ar-accounts');

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

		$scope.deleteARAccountConfirmed = function(event) {
			var successCallbackOfdeleteArAccount = function(data) {
				$scope.$emit('hideLoader');
				$scope.isArTabAvailable = false;
				$scope.$broadcast('ArAccountDeleted');
				$scope.contactInformation.account_details.accounts_receivable_number = "";

				$scope.$broadcast('setgenerateNewAutoAr', false);
				ngDialog.close();
			};
			var dataToSend = {
				"id": $scope.reservationDetails.companyCard.id
			};
			$scope.invokeApi(RVCompanyCardSrv.deleteArAccount, dataToSend, successCallbackOfdeleteArAccount);
		};

		$scope.clikedDiscardDeleteAr = function() {
			ngDialog.close();
		};
		var callCompanyCardServices = function() {
			var param = {
				'id': $scope.reservationDetails.companyCard.id
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

		$scope.$on('companyCardAvailable', function(obj, isNew) {
			$scope.searchMode = false;
			$scope.contactInformation = $scope.companyContactInformation;
			// object holding copy of contact information
			// before save we will compare 'contactInformation' against 'presentContactInfo'
			// to check whether data changed
			$scope.currentSelectedTab = 'cc-contact-info';
			presentContactInfo = angular.copy($scope.contactInformation);
			if (isNew === true) {
				$scope.contactInformation.account_details.account_name = $scope.searchData.companyCard.companyName;
				$scope.contactInformation.address_details.city = $scope.searchData.companyCard.companyCity;
				$scope.contactInformation.account_details.account_number = $scope.searchData.companyCard.companyCorpId;
			}
			$scope.$broadcast("contactTabActive");
			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 1000);
			if(!isNew){
				callCompanyCardServices();
			}
		});

		$scope.$on("companyCardDetached", function() {
			$scope.searchMode = true;
			$scope.isArTabAvailable = false;
			$scope.$broadcast('setgenerateNewAutoAr', false);
		});

		$scope.$on("companySearchInitiated", function() {
			$scope.companySearchIntiated = true;
			$scope.companies = $scope.searchedCompanies;
			$scope.$broadcast("refreshCompaniesScroll");
		});

		$scope.$on("companySearchStopped", function() {
			$scope.companySearchIntiated = false;
			$scope.companies = [];
			$scope.$broadcast("refreshCompaniesScroll");
		});

		$scope.$on("newCardSelected", function(id, values) {
			$scope.searchMode = false;
			$scope.$emit('hideLoader');
		});

		/**
		 * function to handle click operation on company card, mainly used for saving
		 */
		$scope.companyCardClicked = function($event) {
			$event.stopPropagation();
			if (document.getElementById("cc-contact-info") !== null && getParentWithSelector($event, document.getElementById("cc-contact-info")) && $scope.currentSelectedTab === 'cc-contact-info') {
				return;
			} else if (document.getElementById("cc-contracts") !== null && getParentWithSelector($event, document.getElementById("cc-contracts")) && $scope.currentSelectedTab === 'cc-contracts') {
				return;
			} else if (document.getElementById("cc-ar-accounts") !== null && getParentWithSelector($event, document.getElementById("cc-ar-accounts")) && $scope.currentSelectedTab === 'cc-ar-accounts') {
				return;
			} else if (!$scope.viewState.isAddNewCard && document.getElementById("company-card-header") !== null && getParentWithSelector($event, document.getElementById("company-card-header"))) {
				$scope.$emit("saveContactInformation");
				$rootScope.$broadcast("saveArAccount");
			}

		};

		/**
		 * recieving function for save contact with data
		 */
		$scope.$on("saveContactInformation", function(event) {
			event.preventDefault();
			event.stopPropagation();
			saveContactInformation($scope.contactInformation);
		});

		$scope.$on("saveCompanyContactInformation", function(event) {
			event.preventDefault();
			saveContactInformation($scope.contactInformation);
		});

		/**
		 * a reciever function to do operation on outside click, which is generated by outside click directive
		 */
		$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
			event.preventDefault();
			saveContactInformation($scope.contactInformation);
			$scope.checkOutsideClick(targetElement);
			$rootScope.$broadcast("saveArAccount");
			$rootScope.$broadcast("saveContract");
		});

		/**
		 * success callback of save contact data
		 */
		var successCallbackOfContactSaveData = function(data) {
			$scope.$emit("hideLoader");
			$scope.reservationDetails.companyCard.id = data.id;
			$scope.contactInformation.id = data.id;
			$rootScope.$broadcast("IDGENERATED",{ 'id': data.id });
			callCompanyCardServices();
			//New Card Handler
			if ($scope.viewState.isAddNewCard && typeof data.id !== "undefined") {
				if ($scope.viewState.identifier === "STAY_CARD" || ($scope.viewState.identifier === "CREATION" && $scope.viewState.reservationStatus.confirm)) {
					$scope.viewState.pendingRemoval.status = false;
					//if a new card has been added, reset the future count to zero
					$scope.viewState.pendingRemoval.cardType = "";
					if ($scope.reservationDetails.companyCard.futureReservations <= 0) {
						$scope.replaceCardCaller('company', {
							id: data.id
						}, false);
					} else {
						$scope.checkFuture('company', {
							id: data.id
						});
					}
					$scope.reservationDetails.companyCard.futureReservations = 0;
				}
				$scope.viewState.isAddNewCard = false;
				$scope.closeGuestCard();
				$scope.cardSaved();
				$scope.reservationDetails.companyCard.id = data.id;
				if ($scope.reservationData && $scope.reservationData.company) {
					$scope.reservationData.company.id = data.id;
					$scope.reservationData.company.name = $scope.contactInformation.account_details.account_name;
				}
			}

			//taking a deep copy of copy of contact info. for handling save operation
			//we are not associating with scope in order to avoid watch
			presentContactInfo = angular.copy($scope.contactInformation);
		};

		$scope.clickedSaveCard = function(cardType) {
			saveContactInformation($scope.contactInformation);
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
			if (typeof data !== 'undefined' && (dataUpdated || $scope.viewState.isAddNewCard)) {
				var dataToSend = JSON.parse(JSON.stringify(data));
				for (key in dataToSend) {
					if (typeof dataToSend[key] !== "undefined" && data[key] !== null && data[key] !== "") {
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
				dataToSend.account_type = $scope.account_type;
				$scope.invokeApi(RVCompanyCardSrv.saveContactInformation, dataToSend, successCallbackOfContactSaveData, failureCallbackOfContactSaveData);
			}
		};

	}
]);

angular.module('sntRover').controller('companyResults', ['$scope', '$timeout',
	function($scope, $timeout) {
		BaseCtrl.call(this, $scope);
		var scrollerOptionsForGraph = {
			scrollX: true,
			click: true,
			preventDefault: false
		};
		$scope.setScroller('companyResultScroll', scrollerOptionsForGraph);

		$scope.$on("refreshCompaniesScroll", function() {
			$timeout(function() {
				$scope.refreshScroller('companyResultScroll');
			}, 500);
		});
	}
]);