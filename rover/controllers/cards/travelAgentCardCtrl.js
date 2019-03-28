angular.module('sntRover').controller('RVTravelAgentCardCtrl', ['$scope', '$rootScope', '$timeout', 'RVCompanyCardSrv', 'ngDialog', '$filter', '$stateParams', 'rvPermissionSrv',
	function($scope, $rootScope, $timeout, RVCompanyCardSrv, ngDialog, $filter, $stateParams, rvPermissionSrv) {

		$scope.searchMode = true;
		$scope.account_type = 'TRAVELAGENT';
		$scope.currentSelectedTab = 'cc-contact-info';
		$scope.isGlobalToggleReadOnly = !rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE');

		$scope.hasPermissionToViewCommissionTab = function() {
			return rvPermissionSrv.getPermissionValue ('VIEW_COMMISSIONS_TAB');
		};
		$scope.isCommissionTabAvailable = $scope.hasPermissionToViewCommissionTab();

		$scope.switchTabTo = function($event, tabToSwitch) {
			$event.stopPropagation();
			$event.stopImmediatePropagation();

			// CICO-28058 - checking whether AR Number is present or not.
			var isArNumberAvailable = !!$scope.contactInformation.account_details.accounts_receivable_number;

			if ($scope.currentSelectedTab === 'cc-contact-info' && tabToSwitch !== 'cc-contact-info') {
				if ($scope.viewState.isAddNewCard) {
					$scope.$broadcast("setCardContactErrorMessage", [$filter('translate')('TA_SAVE_PROMPT')]);
				} else {
					saveContactInformation($scope.contactInformation);
					$scope.$broadcast("contractTabActive");
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
				$scope.isWithFilters = false;
			} else if (tabToSwitch === 'statistics') {
				$scope.$broadcast("LOAD_STATISTICS");
			} 
			else if (tabToSwitch === 'cc-commissions') {
				$scope.$broadcast("commissionsTabActive");
			}
			else if (tabToSwitch === 'cc-activity-log') {
				$scope.$broadcast("activityLogTabActive");
			}
			if (tabToSwitch === 'cc-ar-transactions' && !isArNumberAvailable) {
			  	console.warn("Save AR Account and Navigate to AR Transactions");
			}
			else if (!$scope.viewState.isAddNewCard) {
				$scope.currentSelectedTab = tabToSwitch;
			}
		};

		$scope.$on('ARTransactionSearchFilter', function(e, data) {
			$scope.isWithFilters = data;
		});
		
		var presentContactInfo = {};
		/* -------AR account starts here-----------*/

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

		$scope.deleteARAccountConfirmed = function() {
			var successCallbackOfdeleteArAccount = function(data) {
				$scope.$emit('hideLoader');
				$scope.isArTabAvailable = false;
				$scope.$broadcast('setgenerateNewAutoAr', false);
				$scope.$broadcast('ArAccountDeleted');
				$scope.contactInformation.account_details.accounts_receivable_number = "";
				ngDialog.close();
			};
			var dataToSend = {
				"id": $scope.reservationDetails.travelAgent.id
			};

			$scope.invokeApi(RVCompanyCardSrv.deleteArAccount, dataToSend, successCallbackOfdeleteArAccount);
		};

		$scope.clikedDiscardDeleteAr = function() {
			ngDialog.close();
		};

		var callCompanyCardServices = function() {
			var param = {
				'id': $scope.reservationDetails.travelAgent.id
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

		/* -------AR account ends here-----------*/
		$scope.$on('travelAgentFetchComplete', function(obj, isNew) {
			$scope.searchMode = false;
			$scope.contactInformation = $scope.travelAgentInformation;
			$scope.contactInformation.id = $scope.reservationDetails.travelAgent.id;
			// object holding copy of contact information
			// before save we will compare 'contactInformation' against 'presentContactInfo'
			// to check whether data changed
			$scope.currentSelectedTab = 'cc-contact-info';
			presentContactInfo = angular.copy($scope.contactInformation);

			if (isNew === true) {
				$scope.contactInformation.account_details.account_name = $scope.searchData.travelAgentCard.travelAgentName;
				$scope.contactInformation.address_details.city = $scope.searchData.travelAgentCard.travelAgentCity;
				$scope.contactInformation.account_details.account_number = $scope.searchData.travelAgentCard.travelAgentIATA;
			}

			$scope.$broadcast("contactTabActive");
			$scope.$broadcast("UPDATE_CONTACT_INFO");
			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 1000);
			if (!isNew) {
				callCompanyCardServices();
			}
		});

		$scope.$on("travelAgentSearchInitiated", function() {
			$scope.companySearchIntiated = true;
			$scope.travelAgents = $scope.searchedtravelAgents;
			$scope.$broadcast("refreshTravelAgentScroll");
		});

		$scope.$on("travelAgentSearchStopped", function() {
			$scope.companySearchIntiated = false;
			$scope.travelAgents = [];
			$scope.$broadcast("refreshTravelAgentScroll");
		});

		$scope.$on("travelAgentDetached", function() {
			$scope.searchMode = true;
			$scope.isArTabAvailable = false;
			$scope.$broadcast('setgenerateNewAutoAr', false);
		});

		/**
		 * function to handle click operation on travel agent card, mainly used for saving
		 */
		$scope.travelAgentCardClicked = function($event) {
			$event.stopPropagation();
			if (document.getElementById("cc-contact-info") !== null && getParentWithSelector($event, document.getElementById("cc-contact-info")) && $scope.currentSelectedTab === 'cc-contact-info') {
				return;
			} else if (document.getElementById("cc-contracts") !== null && getParentWithSelector($event, document.getElementById("cc-contracts")) && $scope.currentSelectedTab === 'cc-contracts') {
				return;
			} else if (document.getElementById("cc-ar-accounts") !== null && getParentWithSelector($event, document.getElementById("cc-ar-accounts")) && $scope.currentSelectedTab === 'cc-ar-accounts') {
				return;
			} else if (!$scope.viewState.isAddNewCard && document.getElementById("travel-agent-card-header") !== null && getParentWithSelector($event, document.getElementById("travel-agent-card-header"))) {
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

		$scope.$on("saveTravelAgentContactInformation", function(event) {
			event.preventDefault();
			saveContactInformation($scope.contactInformation);
		});
		/*
		 * Toggle global button
		 */
        $scope.toggleGlobalButton = function() {
			if (rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE')) {
				$scope.contactInformation.is_global_enabled = !$scope.contactInformation.is_global_enabled;
				$scope.contactInformation.account_type = $scope.account_type;
			}
		};
		$scope.shouldShowCommissionsTab = function() {
			return $scope.account_type === 'TRAVELAGENT';
		};

		$scope.isUpdateEnabledForTravelAgent = function() {
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
			return isDisabledFields;
		};
		/*
		 * If contract rate exists then should not allow editing name of CC/TA - CICO-56441
		 */
		$scope.isUpdateEnabledForName = function() {
			var contractedRates = RVCompanyCardSrv.getContractedRates(),
				isUpdateEnabledForNameInCard = true;

			if ( ( contractedRates.current_contracts && contractedRates.current_contracts.length > 0 ) || ( contractedRates.future_contracts && contractedRates.future_contracts.length > 0 )|| ( contractedRates.history_contracts && contractedRates.history_contracts.length > 0 ) ) {
				isUpdateEnabledForNameInCard = false;
			}
			return isUpdateEnabledForNameInCard;
		};		

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
			$scope.contactInformation.id = data.id;
			$scope.reservationDetails.travelAgent.id = data.id;
			$rootScope.$broadcast("IDGENERATED", { 'id': data.id });
			callCompanyCardServices();
			// New Card Handler
			if ($scope.viewState.isAddNewCard && typeof data.id !== "undefined") {
				if ($scope.viewState.identifier === "STAY_CARD" || ($scope.viewState.identifier === "CREATION" && $scope.viewState.reservationStatus.confirm)) {
					$scope.viewState.pendingRemoval.status = false;
					// if a new card has been added, reset the future count to zero
					if ($scope.reservationDetails.travelAgent.futureReservations <= 0) {
						$scope.replaceCardCaller('travel_agent', {
							id: data.id
						}, false);
					} else {
						$scope.checkFuture('travel_agent', {
							id: data.id
						});
					}
					$scope.reservationDetails.travelAgent.futureReservations = 0;
					$scope.viewState.pendingRemoval.cardType = "";
				}
				$scope.viewState.isAddNewCard = false;
				$scope.closeGuestCard();
				$scope.cardSaved();
				$scope.reservationDetails.travelAgent.id = data.id;
				if ($scope.reservationData && $scope.reservationData.travelAgent) {
					$scope.reservationData.travelAgent.id = data.id;
					$scope.reservationData.travelAgent.name = $scope.contactInformation.account_details.account_name;
				}

			}

			// taking a deep copy of copy of contact info. for handling save operation
			// we are not associating with scope in order to avoid watch
			presentContactInfo = angular.copy($scope.contactInformation);
		};

		/**
		 * failure callback of save contact data
		 */
		var failureCallbackOfContactSaveData = function(errorMessage) {
			$scope.errorMessage = errorMessage;
			$scope.currentSelectedTab = 'cc-contact-info';
		};

		$scope.clickedSaveCard = function(cardType) {
			// show commission warning popup if departure date has passed
			if (cardType === 'travel_agent' && $scope.reservationData.status === "CHECKEDOUT" && (new Date($scope.userInfo.business_date) > new Date($scope.reservationData.departureDate))) {
				// show warning popup
				ngDialog.open({
					template: '/assets/partials/cards/popups/rvNewTACommissionsWarningPopup.html',
					className: '',
					closeByDocument: false,
					closeByEscape: false,
					scope: $scope
				});
			} else {
				saveContactInformation($scope.contactInformation);
			}
		};

		$scope.saveNewTACard = function ($event) {
			$event.stopPropagation();
			ngDialog.close();
			saveContactInformation($scope.contactInformation);
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
			if (typeof data !== 'undefined' && (dataUpdated || $scope.isAddNewCard)) {
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
				dataToSend.account_type = $scope.account_type;
				var options = {
					params: dataToSend,
					successCallBack: successCallbackOfContactSaveData,
					failureCallBack: failureCallbackOfContactSaveData
				};

				$scope.callAPI(RVCompanyCardSrv.saveContactInformation, options);
			}
		};

		/**
		* function to check whether the user has permission
		* to create/edit AR Account.
		* @return {Boolean}
		*/
		$scope.hasPermissionToCreateArAccount = function() {
			return rvPermissionSrv.getPermissionValue ('CREATE_AR_ACCOUNT');
		};
	}
]);

angular.module('sntRover').controller('travelAgentResults', ['$scope', '$timeout',
	function($scope, $timeout) {
		BaseCtrl.call(this, $scope);
		var scrollerOptionsForGraph = {
			scrollX: true,
			click: true,
			preventDefault: false
		};

		$scope.setScroller('travelAgentResultScroll', scrollerOptionsForGraph);

		$scope.$on("refreshTravelAgentScroll", function() {
			$timeout(function() {
				$scope.refreshScroller('travelAgentResultScroll');
			}, 500);
		});
	}
]);
