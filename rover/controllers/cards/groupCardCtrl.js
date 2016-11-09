angular.module('sntRover').controller('RVGroupCardCtrl', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', 'ngDialog', '$filter', '$stateParams', 'rvGroupSrv', 'rvUtilSrv', '$controller',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, ngDialog, $filter, $stateParams, rvGroupSrv, rvUtilSrv, $controller) {
		$scope.searchMode = true;

		$scope.$on('groupCardAvailable', function(obj, isNew) {
			$scope.searchMode = false;
			$timeout(function() {
				$scope.groupSummaryMemento = angular.copy($scope.groupConfigData.summary);
				$scope.$emit('hideLoader');
			}, 500);
		});

		$scope.$on('allotmentCardAvailable', function(obj, isNew) {
			$scope.searchMode = false;
			$timeout(function() {
				// $scope.groupSummaryMemento = angular.copy($scope.groupConfigData.summary);
				$scope.$emit('hideLoader');
			}, 500);
		});

		$scope.isInAddMode = function() {
			return false;
		}

		$scope.getMoveDatesActions = function() {
			return {
				setToDefaultMode: function() {
					return false;
				}
			}
		};

		$scope.fetchGroupAllotmentCardId = function(section) {
			var suffix = section === "HEAD" ? 'header' : 'content';

			if (!!$scope.reservationData.group.id) {
				return 'group-card-' + suffix;

			} else if (!!$scope.reservationData.allotment.id) {
				return 'allotment-card-' + suffix;
			}
			return 'group-allotment-card-' + suffix;
		};

		$scope.$on("groupCardDetached", function() {
			$scope.searchMode = true;
		});

		$scope.$on("GROUP_SEARCH_ON", function() {
			$scope.searchingGroups = true;
			$scope.$broadcast("refreshGroupsListScroller");
		});

		$scope.$on("GROUP_SEARCH_OFF", function() {
			$scope.searchingGroups = false;
			$scope.$broadcast("refreshGroupsListScroller");
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
			// saveContactInformation($scope.contactInformation);
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
			$rootScope.$broadcast("IDGENERATED", {
				'id': data.id
			});
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

		$scope.getClassAgainstPickedStatus = rvGroupSrv.getClassAgainstPickedStatus;
		$scope.getGuestClassForArrival = rvGroupSrv.getGuestClassForArrival;
		$scope.getGuestClassForDeparture = rvGroupSrv.getGuestClassForDeparture;
		$scope.getClassAgainstHoldStatus = rvGroupSrv.getClassAgainstHoldStatus;
		$scope.stringify = rvUtilSrv.stringify;
		$scope.isEmpty = _.isEmpty;
		$scope.formatDateForUI = function(date_) {
			var type_ = typeof date_,
				returnString = '';

			switch (type_) {
				//if date string passed
				case 'string':
					returnString = $filter('date')(new tzIndependentDate(date_), $rootScope.dateFormat);
					break;

					//if date object passed
				case 'object':
					returnString = $filter('date')(date_, $rootScope.dateFormat);
					break;
			}
			return (returnString);
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

angular.module('sntRover').controller('groupResults', ['$scope', '$timeout',
	function($scope, $timeout) {
		BaseCtrl.call(this, $scope);
		var scrollerOptionsForGraph = {
			scrollX: true,
			click: true,
			preventDefault: false
		};

		$scope.setScroller('groupResultsScroll', scrollerOptionsForGraph);

		$scope.$on("refreshGroupsListScroller", function() {
			$timeout(function() {
				$scope.refreshScroller('groupResultsScroll');
			}, 500);
		});
	}
]);