sntRover.controller('guestCardController', [
	'$scope', '$window', 'RVCompanyCardSrv', 'RVReservationAllCardsSrv', 'RVContactInfoSrv', '$stateParams', '$timeout', 'ngDialog', '$rootScope', 'RVSearchSrv', 'RVReservationDataService', 'rvGroupSrv', '$state',
	function($scope, $window, RVCompanyCardSrv, RVReservationAllCardsSrv, RVContactInfoSrv, $stateParams, $timeout, ngDialog, $rootScope, RVSearchSrv, RVReservationDataService, rvGroupSrv, $state) {
		var resizableMinHeight = 90;
		var resizableMaxHeight = $(window).height() - resizableMinHeight;

		$scope.dimensionsLookup = {
			resizableMaxHeight: resizableMaxHeight,
			cardTabContentOffset: 170 // Height of the tab menu and the header above.
		};

		$scope.cardVisible = false;
		//init activeCard as the companyCard
		$scope.activeCard = "companyCard";

		BaseCtrl.call(this, $scope);

		var initReservation = function() {
			if (!$scope.reservationData.isSameCard || !$scope.otherData.reservationCreated) {
				// open search list card if any of the search fields are entered on main screen
				var searchData = $scope.reservationData;
				if ($scope.searchData.guestCard.guestFirstName !== '' || $scope.searchData.guestCard.guestLastName !== '' || searchData.company.id !== null || searchData.travelAgent.id !== null || !!$scope.reservationData.group.id) {
					// based on search values from base screen
					// init respective search
					if ($scope.reservationDetails.guestCard.id === '') {
						if ($scope.searchData.guestCard.guestFirstName !== '' || $scope.searchData.guestCard.guestLastName !== '') {
							$scope.openGuestCard();
							$scope.searchGuest();
						}
					}
					if (!!searchData.company.id && !$scope.reservationData.group.id) {
						if ($scope.searchData.guestCard.guestFirstName === '' && $scope.searchData.guestCard.guestLastName === '') {
							if ($stateParams.reservation && $stateParams.reservation !== 'HOURLY' && $stateParams.mode && $stateParams.mode !== 'OTHER') {
								$scope.switchCard('company-card');
							}
						}
						$scope.reservationDetails.companyCard.id = searchData.company.id;
						$scope.initCompanyCard({
							id: searchData.company.id
						});
					}
					if (!!searchData.travelAgent.id && !$scope.reservationData.group.id) {
						if ($scope.searchData.guestCard.guestFirstName === '' && $scope.searchData.guestCard.guestLastName === '') {
							if ($stateParams.reservation && $stateParams.reservation !== 'HOURLY' && $stateParams.mode && $stateParams.mode !== 'OTHER') {
								$scope.switchCard('travel-agent-card');
							}
						}
						$scope.reservationDetails.travelAgent.id = searchData.travelAgent.id;
						$scope.initTravelAgentCard({
							id: searchData.travelAgent.id
						});
					}
					if (!!$scope.reservationData.group.id) {
						$scope.initGroupCard($scope.reservationData.group.id);
						if (!!$scope.reservationData.group.travelAgent) {
							$scope.reservationDetails.travelAgent.id = $scope.reservationData.group.travelAgent;
							$scope.initTravelAgentCard();
						}
						if (!!$scope.reservationData.group.company) {
							$scope.reservationDetails.companyCard.id = $scope.reservationData.group.company;
							$scope.initCompanyCard();
						}
					}
				}
			} else {
				// populate cards
				$scope.closeGuestCard();
				if (!!$scope.reservationDetails.guestCard.id || !!$scope.reservationData.guest.id) {
					$scope.initGuestCard({
						id: $scope.reservationDetails.guestCard.id || $scope.reservationData.guest.id
					});
				}
				if (!!$scope.reservationDetails.companyCard.id && !$scope.reservationData.group.id) {
					$scope.initCompanyCard({
						id: $scope.reservationDetails.companyCard.id
					});
				}
				if (!!$scope.reservationDetails.travelAgent.id && !$scope.reservationData.group.id) {
					$scope.initTravelAgentCard({
						id: $scope.reservationDetails.travelAgent.id
					});
				}
				if (!!$scope.reservationData.group.id) {
					$scope.initGroupCard($scope.reservationData.group.id);
					if (!!$scope.reservationData.group.travelAgent) {
						$scope.reservationDetails.travelAgent.id = $scope.reservationData.group.travelAgent;
						$scope.initTravelAgentCard();
					}
					if (!!$scope.reservationData.group.company) {
						$scope.reservationDetails.companyCard.id = $scope.reservationData.group.company;
						$scope.initCompanyCard();
					}
				}

				$scope.reservationData.isSameCard = false;
			}

			if ($scope.otherData.fromSearch) {
				$scope.otherData.fromSearch = false;
			}
		};

		// update guest details to RVSearchSrv via RVSearchSrv.updateGuestDetails - params: guestid, data
		var updateSearchCache = function() {
			var dataSource = $scope.guestCardData.contactInfo;
			var data = {
				'firstname': dataSource.first_name,
				'lastname': dataSource.last_name,
				'vip': dataSource.vip
			};

			if (dataSource.address) {
				if ($scope.escapeNull(dataSource.address.city).toString().trim() !== '' || $scope.escapeNull(dataSource.address.state).toString().trim() !== '') {
					data.location = (dataSource.address.city + ', ' + dataSource.address.state);
				} else {
					data.location = false;
				}
			}
			RVSearchSrv.updateGuestDetails($scope.guestCardData.contactInfo.user_id, data);
		};

		$scope.init = function() {
			if ($scope.viewState.identifier === "CREATION") {
				initReservation();
			} else {
				$scope.contactInfoError = false;
				$scope.eventTimestamp = "";
				var preventClicking = false;
			}
		};

		$scope.$on("resetGuestTab", function() {
			$scope.guestCardTabSwitch("guest-contact");
		});

		$scope.$on("guest_email_updated", function(e, email) {
			$scope.guestCardData.contactInfo.email = email;
		});

		$scope.$on('reservationCardisClicked', function() {

			$("#guest-card").css("height", $scope.resizableOptions.minHeight); //against angular js practice, sorry :(
			$scope.guestCardVisible = false;
			$scope.cardVisible = false;
		});
		/**
		 * for dragging of guest card
		 */
		$scope.guestCardVisible = false;
		//varibale used to determine whether to show guest card's different tabs
		$scope.guestCardHeight = 90;

		/**
		 * to be updated from resize directive
		 */
		$scope.$watch('windowHeight', function(newValue, oldValue) {
			$scope.windowHeight = newValue;
		});

		/**
		 * scroller options
		 */
		$scope.resizableOptions = {
			minHeight: resizableMinHeight,
			maxHeight: resizableMaxHeight,
			handles: 's',
			resize: function(event, ui) {
				if ($(this).height() > 120 && !$scope.guestCardVisible) { //against angular js principle, sorry :(
					$scope.guestCardVisible = true;
					$scope.cardVisible = true;
					$scope.$emit('GUESTCARDVISIBLE', true);
					$scope.$apply();
				} else if ($(this).height() <= 120 && $scope.guestCardVisible) {
					$scope.guestCardVisible = false;
					$scope.cardVisible = false;
					$scope.handleDrawClosing();
					$scope.$emit('GUESTCARDVISIBLE', false);
					$scope.$apply();
				}
				$scope.guestCardHeight = $(this).height();
				/**
				 * CICO-9564 -- Scrolls in the card section on dragging
				 */
				if ($scope.UICards[0] === "guest-card") {
					$scope.$broadcast('CONTACTINFOLOADED');
					$scope.$broadcast('REFRESHLIKESSCROLL');
				} else {
					$scope.$broadcast('contactTabActive');
					$scope.$broadcast('contractTabActive');
					$scope.$broadcast('refreshAccountsScroll');
				}


			},
			stop: function(event, ui) {
				preventClicking = true;
				$scope.eventTimestamp = event.timeStamp;
			}
		};

		/**
		 *  API call needs only rest of keys in the data
		 */
		$scope.decloneUnwantedKeysFromContactInfo = function() {

			var unwantedKeys = ["birthday", "country",
				"is_opted_promotion_email", "job_title",
				"mobile", "passport_expiry",
				"passport_number", "postal_code",
				"reservation_id", "title", "user_id",
				"works_at", "birthday", "avatar"
			];
			var declonedData = dclone($scope.guestCardData.contactInfo, unwantedKeys);
			return declonedData;
		};

		/**
		 *  init guestcard header data
		 */
		var declonedData = $scope.decloneUnwantedKeysFromContactInfo();
		var currentGuestCardHeaderData = declonedData;
		$scope.current = 'guest-contact';

		/**
		 *
		 *to reset current data in header info for determining any change
		 **/
		$scope.$on('RESETHEADERDATA', function(event, data) {
			currentGuestCardHeaderData.address = data.address;
			currentGuestCardHeaderData.phone = data.phone;
			currentGuestCardHeaderData.email = data.email;
			currentGuestCardHeaderData.first_name = data.first_name;
			currentGuestCardHeaderData.last_name = data.last_name;
		});

		/**
		 * tab actions
		 */
		$scope.guestCardTabSwitch = function(tab) {
			if ($scope.current === 'guest-contact' && tab !== 'guest-contact') {
				if ($scope.viewState.isAddNewCard) {
					$scope.$broadcast("showSaveMessage");
				} else {
					$scope.$broadcast('saveContactInfo');
				}
			};
			if ($scope.current === 'guest-like' && tab !== 'guest-like') {
				$scope.$broadcast('SAVELIKES');

			};
			if (tab === 'guest-credit') {
				$scope.$broadcast('PAYMENTSCROLL');
			}
			$scope.$broadcast('REFRESHLIKESSCROLL');
			if (!$scope.viewState.isAddNewCard) {
				$scope.current = tab;
			}
		};

		$scope.$on('contactInfoError', function(event, value) {
			$scope.contactInfoError = value;
		});
		$scope.$on('likesInfoError', function(event, value) {
			$scope.likesInfoError = value;
		});

		$scope.updateContactInfo = function() {
			var that = this;
			that.newUpdatedData = $scope.decloneUnwantedKeysFromContactInfo();
			var saveUserInfoSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.reservationData.guest.email = that.newUpdatedData.email;
				// update few of the details to searchSrv
				updateSearchCache();
				//to reset current data in contcat info for determining any change
				$scope.$broadcast("RESETCONTACTINFO", that.newUpdatedData);
			};

			// check if there is any chage in data.if so call API for updating data
			if (JSON.stringify(currentGuestCardHeaderData) !== JSON.stringify(that.newUpdatedData)) {
				currentGuestCardHeaderData = that.newUpdatedData;
				var data = {
					'data': currentGuestCardHeaderData,
					'userId': $scope.guestCardData.contactInfo.user_id
				};
				if (typeof data.userId !== 'undefined') {
					$scope.invokeApi(RVContactInfoSrv.saveContactInfo, data, saveUserInfoSuccessCallback);
				}
			}
		};

		/**
		 *   In case of a click or an event occured on child elements
		 *	of actual targeted element, we need to change it as the event on parent element
		 *   @param {event} is the actual event
		 *   @param {selector} is the selector which we want to check against that event
		 *   @return {Boolean} trueif the event occured on selector or it's child elements
		 *   @return {Boolean} false if not
		 */
		function getParentWithSelector($event, selector) {
			var obj = $event.target,
				matched = false;
			return selector.contains(obj);
		};

		$scope.guestCardClick = function($event) {
			$rootScope.$emit('clearErroMessages');
			$scope.$broadcast('clearNotifications');
			var element = $event.target;
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			//if the main menu is open close the same
			if ($scope.isMenuOpen()) {
				$scope.closeDrawer();
				return false;
			}
			if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-handle")[0])) {
				//save contact info
				$scope.$broadcast('saveContactInfo');
				$scope.$broadcast('SAVELIKES');
				if (parseInt($scope.eventTimestamp)) {
					if (($event.timeStamp - $scope.eventTimestamp) < 100) {
						return;
					}
				}
				var currentHeight = $scope.guestCardHeight;
				if (currentHeight === resizableMinHeight || currentHeight === resizableMaxHeight) {
					// open a closed card
					if (!$scope.guestCardVisible) {
						$scope.openGuestCard();
						$scope.$broadcast('CONTACTINFOLOADED');
						$scope.$emit('GUESTCARDVISIBLE', true);
					} else if ($scope.guestCardVisible && currentHeight === resizableMaxHeight) { // close an opened card
						$scope.closeGuestCard();
						$scope.$emit('GUESTCARDVISIBLE', false);
					}
				} else {
					// mid way click : close guest card
					$scope.closeGuestCard();
					$scope.$emit('GUESTCARDVISIBLE', false);
				}


			} else {
				if (getParentWithSelector($event, document.getElementById("guest-card-content"))) {
					/**
					 * handle click on tab navigation bar.
					 */
					if ($event.target.id === 'guest-card-tabs-nav' || $event.target.id === 'cards-header') {
						$scope.$broadcast('saveContactInfo');
						$scope.$broadcast('SAVELIKES');

					} else {
						return;
					}
				}
			}
		};


		$scope.checkOutsideClick = function(targetElement) {
			if ($scope.cardVisible) {
				$scope.$broadcast('saveContactInfo');
				$scope.$broadcast('SAVELIKES');
			}
			if ($(targetElement).closest(".rover-header").length < 1 && $(targetElement).closest(".stay-card-alerts").length < 1 && $(targetElement).closest(".guest-card").length < 1 && $(targetElement).closest(".ngdialog").length < 1 && $(targetElement).find("#loading").length < 1 && $(targetElement).closest("#loading").length < 1 && $(targetElement).closest('.nav-toggle').length < 1) {
				$scope.closeGuestCard();
			}
		};


		$scope.UICards = ['guest-card', 'company-card', 'travel-agent-card', 'group-card', 'allotment-card'];

		// className based on UICards index
		var subCls = ['first', 'second', 'third', 'fourth', 'fifth'];

		$scope.UICardClass = function(from) {
			// based on from (guest-card, company-card || travel-agent-card)
			// evaluate UICards return className(s) as string
			var cls = '';
			if (from !== $scope.UICards[0]) {
				cls = "change-card " + subCls[$scope.UICards.indexOf(from)];
			} else {
				cls = subCls[0];
			};
			return cls;
		};

		$scope.UICardContentCls = function(from) {
			// evaluate UICards return card conten className(s) as string
			var cls = '';
			if (from !== $scope.UICards[0]) {
				cls = "hidden";
			} else {
				cls = 'visible';
			};
			return cls;
		};

		$scope.cardCls = function() {
			// evaluate
			var cls = $scope.UICards[0]; //  current active card
			if ($scope.cardVisible) {
				cls += " open";
			}
			return cls;
		};

		$scope.switchCard = function(from) {
			//  based on from
			//  swap UICards array for guest-card, company-card & travel-agent-card
			var newCardIndex = $scope.UICards.indexOf(from);
			var currentCard = $scope.UICards[0];
			$scope.UICards[0] = from;
			$scope.UICards[newCardIndex] = currentCard;
			if ($scope.UICards[0] === 'company-card' || $scope.UICards[0] === 'travel-agent-card') {
				$scope.activeCard = $scope.UICards[0] === 'company-card' ? "companyCard" : "travelAgent";
				$scope.$broadcast('activeCardChanged');
			}
		};

		/**
		 * function to open guest card
		 */
		$scope.openGuestCard = function() {
			$scope.cardVisible = true;
			$scope.guestCardVisible = true;
			$scope.guestCardHeight = resizableMaxHeight;
			// //refresh scroll in the contact tab of the card-content view. Handled in rover/controllers/rvCompanyCardsContactCtrl.js
			$scope.$broadcast("contactTabActive");
			// //refreshing the scroller in guestcard's tab

		};

		/**
		 * function to close guest card
		 */
		$scope.closeGuestCard = function() {
			$scope.guestCardHeight = resizableMinHeight;
			//Check if pending removals - If yes remove
			$scope.handleDrawClosing();
			$scope.cardVisible = false;
			$scope.guestCardVisible = false;
		};

		$scope.handleDrawClosing = function() {
			if ($scope.viewState.isAddNewCard) {
				var cards = {
					'guest-card': 'guest',
					'company-card': 'company',
					'travel-agent-card': 'travel_agent'
				};
				discardCard(cards[$scope.UICards[0]]);
			}
			if ($scope.viewState.pendingRemoval.status) {
				$scope.removeCard($scope.viewState.pendingRemoval.cardType);
			}
		};

		$scope.clickedDiscardCard = function(cardType, discard) {
			discardCard(cardType, discard);
		};

		var discardCard = function(cardType, discard) {
			$scope.viewState.isAddNewCard = false;
			if (cardType === 'travel_agent') {
				$scope.$broadcast('travelAgentDetached');
			} else if (cardType === 'company') {
				$scope.$broadcast('companyCardDetached');
			} else if (cardType === 'guest') {
				$scope.$broadcast('guestCardDetached');
			}
		};

		var resetReservationData = (function() {
			this.resetGuest = function() {
				$scope.reservationData.guest.id = "";
				$scope.reservationData.guest.firstName = "";
				$scope.reservationData.guest.lastName = "";
				$scope.reservationData.guest.city = "";
				$scope.reservationData.guest.loyaltyNumber = "";
				$scope.reservationData.guest.email = "";


				// update current controller scope
				$scope.guestFirstName = "";
				$scope.guestLastName = "";
				$scope.guestCity = "";
				$scope.guestCardData.cardHeaderImage = "";
			};
			this.resetCompanyCard = function() {
				$scope.reservationData.company.id = "";
				$scope.reservationData.company.name = "";
				$scope.reservationData.company.corporateid = "";
				$scope.companyName = "";
				$scope.companyCity = "";
				$scope.reservationDetails.companyCard.id = "";
			};
			this.resetTravelAgent = function() {
				$scope.reservationData.travelAgent.id = "";
				$scope.reservationData.travelAgent.name = "";
				$scope.reservationData.travelAgent.iataNumber = "";
				$scope.travelAgentName = "";
				$scope.travelAgentCity = "";
				$scope.reservationDetails.travelAgent.id = "";
			};

			return {
				resetGuest: this.resetGuest,
				resetCompanyCard: this.resetCompanyCard,
				resetTravelAgent: this.resetTravelAgent
			};
		})();

		$scope.removeGroupCard = function() {

			resetReservationData.resetCompanyCard();
			resetReservationData.resetTravelAgent();

			$scope.reservationDetails.companyCard.id = "";
			$scope.reservationDetails.travelAgent.id = "";

			$scope.$broadcast("companyCardDetached");
			$scope.$broadcast("travelAgentDetached");

			if ($scope.viewState.identifier === "CREATION") {
				// reservationCreation				
				$scope.reservationData.group = {
					id: "",
					name: "",
					code: "",
					company: "",
					travelAgent: ""
				}
				
				$scope.showContractedRates({
					companyCard: $scope.reservationDetails.companyCard.id,
					travelAgent: $scope.reservationDetails.travelAgent.id
				});
				$scope.$broadcast("groupCardDetached");
				$scope.closeGuestCard();
			} else {
				// Handle group removal in stay-card
				detachGroupFromThisReservation();
			}
		}

		$scope.detachCard = function(cardType) {
			if ($scope.viewState.identifier === "CREATION") {
				if (cardType === "guest") {
					resetReservationData.resetGuest();
					$scope.$broadcast("guestCardDetached");
				} else if (cardType === "company") {
					resetReservationData.resetCompanyCard();
					$scope.reservationDetails.companyCard.id = "";
					$scope.showContractedRates({
						companyCard: $scope.reservationDetails.companyCard.id,
						travelAgent: $scope.reservationDetails.travelAgent.id
					});
					$scope.$broadcast("companyCardDetached");
				} else if (cardType === "travel_agent") {
					resetReservationData.resetTravelAgent();
					$scope.reservationDetails.travelAgent.id = "";
					$scope.showContractedRates({
						companyCard: $scope.reservationDetails.companyCard.id,
						travelAgent: $scope.reservationDetails.travelAgent.id
					});
					$scope.$broadcast("travelAgentDetached");
				}
			} else {
				var cards = {
					"guest": "Guest Card",
					"company": "Company Card",
					"travel_agent": "Travel Agent Card"
				};

				ngDialog.open({
					template: '/assets/partials/cards/alerts/detachCard.html',
					className: 'ngdialog-theme-default stay-card-alerts',
					scope: $scope,
					closeByDocument: false,
					closeByEscape: false,
					data: JSON.stringify({
						cardTypeText: cards[cardType],
						cardType: cardType
					})
				});
			}
		};
		$scope.deleteCard = function(cardType) {
			if (cardType === 'travel_agent') {
				$scope.$broadcast('travelAgentDetached');
				$scope.viewState.pendingRemoval.status = true;
				$scope.viewState.pendingRemoval.cardType = "travel_agent";
			} else if (cardType === 'company') {
				$scope.$broadcast('companyCardDetached');
				$scope.viewState.pendingRemoval.status = true;
				$scope.viewState.pendingRemoval.cardType = "company";
				$scope.showContractedRates({
					companyCard: '',
					travelAgent: $scope.reservationDetails.travelAgent.id
				});
			} else if (cardType === 'guest') {
				$scope.$broadcast('guestCardDetached');
				$scope.viewState.pendingRemoval.status = true;
				$scope.viewState.pendingRemoval.cardType = "guest";
				$scope.showContractedRates({
					companyCard: $scope.reservationDetails.companyCard.id,
					travelAgent: ''
				});
			}
		};

		// init staycard header

		$scope.searchGuest = function() {
			var successCallBackFetchGuest = function(data) {
				$scope.$emit("hideLoader");
				$scope.guestSearchIntiated = true;
				$scope.searchedGuests = [];
				if (data.results.length > 0) {
					angular.forEach(data.results, function(item) {
						var guestData = {};
						guestData.id = item.id;
						guestData.firstName = item.first_name;
						guestData.lastName = item.last_name;
						guestData.image = item.image_url;
						guestData.vip = item.vip;
						if (item.address !== null) {
							guestData.address = {};
							guestData.address.city = item.address.city;
							guestData.address.state = item.address.state;
							guestData.address.postalCode = item.address.postal_code;
						}
						guestData.stayCount = item.stay_count;
						guestData.lastStay = {};
						guestData.phone = item.home_phone;
						guestData.email = item.email;
						guestData.lastStay.date = item.last_stay.date;
						guestData.lastStay.room = item.last_stay.room;
						guestData.lastStay.roomType = item.last_stay.room_type;
						$scope.searchedGuests.push(guestData);
					});
				}
				$scope.$broadcast('guestSearchInitiated');
			};
			if ($scope.searchData.guestCard.guestFirstName !== '' || $scope.searchData.guestCard.guestLastName !== '' || $scope.searchData.guestCard.guestCity !== '' || $scope.searchData.guestCard.guestLoyaltyNumber !== '' || $scope.searchData.guestCard.email !== '') {
				var paramDict = {
					'first_name': $scope.searchData.guestCard.guestFirstName,
					'last_name': $scope.searchData.guestCard.guestLastName,
					'city': $scope.searchData.guestCard.guestCity,
					'membership_no': $scope.searchData.guestCard.guestLoyaltyNumber,
					'email': $scope.searchData.guestCard.email
				};
				if (shouldSearch()) {
					$scope.invokeApi(RVReservationAllCardsSrv.fetchGuests, paramDict, successCallBackFetchGuest);
				}
			} else {
				$scope.guestSearchIntiated = false;
				$scope.searchedGuests = [];
				$scope.$apply();
				$scope.$broadcast('guestSearchStopped');
			}
		};

		var previousSearchData = {
			'lastName': '',
			'firstName': '',
			'city': '',
			'loyaltyNumber': '',
			'email': ''
		};

		var shouldSearch = function() {
			if (previousSearchData.lastName === $scope.searchData.guestCard.guestLastName && previousSearchData.firstName === $scope.searchData.guestCard.guestFirstName && previousSearchData.city === $scope.searchData.guestCard.guestCity && previousSearchData.loyaltyNumber === $scope.searchData.guestCard.guestLoyaltyNumber && previousSearchData.email === $scope.searchData.guestCard.email) {
				return false;
			}
			previousSearchData.lastName = $scope.searchData.guestCard.guestLastName;
			previousSearchData.firstName = $scope.searchData.guestCard.guestFirstName;
			previousSearchData.city = $scope.searchData.guestCard.guestCity;
			previousSearchData.loyaltyNumber = $scope.searchData.guestCard.guestLoyaltyNumber;
			previousSearchData.email = $scope.searchData.guestCard.email;

			return ($scope.searchData.guestCard.guestLastName.length >= 2 || $scope.searchData.guestCard.guestFirstName.length >= 1 || $scope.searchData.guestCard.guestCity !== '' || $scope.searchData.guestCard.guestLoyaltyNumber !== '' || $scope.searchData.guestCard.email !== '');
		};

		$scope.searchGroups = function() {
			var onGroupSearchSuccess = function(data) {
					$scope.searchingGroups = true;
					$scope.searchedGroups = data.groups;
					$scope.$broadcast('GROUP_SEARCH_ON');
				},
				onGroupSearchFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
				};
			if (!!$scope.searchData.groupCard.name || !!$scope.searchData.groupCard.code) {
				$scope.callAPI(rvGroupSrv.searchGroupCard, {
					params: {
						name: $scope.searchData.groupCard.name,
						code: $scope.searchData.groupCard.code,
						from_date: $scope.reservationData.arrivalDate,
						to_date: $scope.reservationData.departureDate
					},
					successCallBack: onGroupSearchSuccess,
					failureCallBack: onGroupSearchFailure
				});
			} else {
				$scope.searchingGroups = false;
				$scope.searchedGroups = [];
				$scope.$apply();
				$scope.$broadcast('GROUP_SEARCH_OFF');
			}
		};

		$scope.searchCompany = function() {
			var successCallBackFetchCompanies = function(data) {
				$scope.$emit("hideLoader");
				$scope.companySearchIntiated = true;
				$scope.searchedCompanies = [];
				if (data.accounts.length > 0) {
					angular.forEach(data.accounts, function(item) {
						if (item.account_type === 'COMPANY') {
							var companyData = {};
							companyData.id = item.id;
							companyData.account_name = item.account_name;

							companyData.account_type = item.account_type;
							companyData.isMultipleContracts = false;
							if (item.current_contracts.length > 1) companyData.isMultipleContracts = true;

							companyData.logo = item.company_logo;
							if (item.address !== null) {
								companyData.address = {};
								companyData.address.postalCode = item.address.postal_code;
								companyData.address.city = item.address.city;
								companyData.address.state = item.address.state;
							}
							if (item.current_contracts.length > 0) {
								companyData.rate = item.current_contracts[0];
								companyData.rate.difference = (function() {
									if (parseInt(companyData.rate.based_on.value) < 0) {
										if (companyData.rate.based_on.type === "amount") {
											return $scope.currencySymbol + (parseFloat(companyData.rate.based_on.value) * -1).toFixed(2) + " off ";
										} else {
											return (parseFloat(companyData.rate.based_on.value) * -1) + "%" + " off ";
										}

									}
									return "";
								})();

								companyData.rate.surplus = (function() {
									if (parseInt(companyData.rate.based_on.value) > 0) {
										if (companyData.rate.based_on.type === "amount") {
											return " plus " + $scope.currencySymbol + parseFloat(companyData.rate.based_on.value).toFixed(2);
										} else {
											return " plus " + parseFloat(companyData.rate.based_on.value) + "%";
										}
									}
									return "";
								})();
							}

							companyData.email = item.email;
							companyData.phone = item.phone;
							$scope.searchedCompanies.push(companyData);
						}
					});
				}
				$scope.$broadcast('companySearchInitiated');
			};
			if ($scope.searchData.companyCard.companyName !== '' || $scope.searchData.companyCard.companyCity !== '' || $scope.searchData.companyCard.companyCorpId !== '') {
				var paramDict = {
					'name': $scope.searchData.companyCard.companyName,
					'city': $scope.searchData.companyCard.companyCity,
					'account_number': $scope.searchData.companyCard.companyCorpId,
					'from_date': ($scope.viewState.identifier === "CREATION" || $scope.viewState.identifier === "CONFIRM") ? $scope.reservationData.arrivalDate : new Date($scope.reservation.reservation_card.arrival_date).toISOString().slice(0, 10).replace(/-/g, "-"),
					'to_date': ($scope.viewState.identifier === "CREATION" || $scope.viewState.identifier === "CONFIRM") ? $scope.reservationData.departureDate : new Date($scope.reservation.reservation_card.departure_date).toISOString().slice(0, 10).replace(/-/g, "-")
				};
				$scope.invokeApi(RVReservationAllCardsSrv.fetchCompaniesOrTravelAgents, paramDict, successCallBackFetchCompanies);
			} else {
				$scope.companySearchIntiated = false;
				$scope.searchedCompanies = [];
				$scope.$apply();
				$scope.$broadcast('companySearchStopped');
			}
		};

		$scope.searchTravelAgent = function() {
			var successCallBackFetchTravelAgents = function(data) {
				$scope.$emit("hideLoader");
				$scope.travelAgentSearchIntiated = true;
				$scope.searchedtravelAgents = [];
				if (data.accounts.length > 0) {
					angular.forEach(data.accounts, function(item) {
						if (item.account_type === 'TRAVELAGENT') {
							var travelAgentData = {};
							travelAgentData.id = item.id;
							travelAgentData.account_name = item.account_name;

							travelAgentData.account_type = item.account_type;
							travelAgentData.isMultipleContracts = false;
							if (item.current_contracts.length > 1) travelAgentData.isMultipleContracts = true;

							travelAgentData.logo = item.company_logo;
							if (item.address !== null) {
								travelAgentData.address = {};
								travelAgentData.address.postalCode = item.address.postal_code;
								travelAgentData.address.city = item.address.city;
								travelAgentData.address.state = item.address.state;
							}
							if (item.current_contracts.length > 0) {
								travelAgentData.rate = item.current_contracts[0];
								travelAgentData.rate.difference = (function() {
									if (parseInt(travelAgentData.rate.based_on.value) < 0) {
										if (travelAgentData.rate.based_on.type === "amount") {
											return $scope.currencySymbol + (parseFloat(travelAgentData.rate.based_on.value) * -1).toFixed(2) + " off ";
										} else {
											return (parseFloat(travelAgentData.rate.based_on.value) * -1) + "%" + " off ";
										}

									}
									return "";
								})();

								travelAgentData.rate.surplus = (function() {
									if (parseInt(travelAgentData.rate.based_on.value) > 0) {
										if (travelAgentData.rate.based_on.type === "amount") {
											return " plus " + $scope.currencySymbol + parseFloat(travelAgentData.rate.based_on.value).toFixed(2);
										} else {
											return " plus " + parseFloat(travelAgentData.rate.based_on.value) + "%";
										}
									}
									return "";
								})();
							}
							travelAgentData.email = item.email;
							travelAgentData.phone = item.phone;
							$scope.searchedtravelAgents.push(travelAgentData);
						}
					});
				}
				$scope.$broadcast('travelAgentSearchInitiated');
			};
			if ($scope.searchData.travelAgentCard.travelAgentName !== '' || $scope.searchData.travelAgentCard.travelAgentCity !== '' || $scope.searchData.travelAgentCard.travelAgentIATA !== '') {
				var paramDict = {
					'name': $scope.searchData.travelAgentCard.travelAgentName,
					'city': $scope.searchData.travelAgentCard.travelAgentCity,
					'account_number': $scope.searchData.travelAgentCard.travelAgentIATA,
					'from_date': ($scope.viewState.identifier === "CREATION" || $scope.viewState.identifier === "CONFIRM") ? $scope.reservationData.arrivalDate : new Date($scope.reservation.reservation_card.arrival_date).toISOString().slice(0, 10).replace(/-/g, "-"),
					'to_date': ($scope.viewState.identifier === "CREATION" || $scope.viewState.identifier === "CONFIRM") ? $scope.reservationData.departureDate : new Date($scope.reservation.reservation_card.departure_date).toISOString().slice(0, 10).replace(/-/g, "-")
				};
				$scope.invokeApi(RVReservationAllCardsSrv.fetchCompaniesOrTravelAgents, paramDict, successCallBackFetchTravelAgents);
			} else {
				$scope.searchedtravelAgents = [];
				$scope.travelAgentSearchIntiated = false;
				$scope.$broadcast('travelAgentSearchStopped');
			}
		};
		$scope.checkFuture = function(cardType, card) {
			// Changing this reservation only will unlink the stay card from the previous company / travel agent card and assign it to the newly selected card.
			// Changing all reservations will move all stay cards to the new card.
			// This will only apply when a new company / TA card had been selected.
			// If no new card has been selected, the change will only ever just apply to the current reservation and the above message should not display.
			// If multiple future reservations exist for the same Travel Agent / Company Card details, display message upon navigating away from the Stay Card 'Future reservations exist for the same Travel Agent / Company card.'
			// With choice of 'Change this reservation only' and 'Change all Reservations'.

			if (!$scope.isHourly) {
				var templateUrl = '/assets/partials/cards/alerts/futureReservationsAccounts.html';
				if (cardType === 'guest') {
					templateUrl = '/assets/partials/cards/alerts/futureReservationsGuest.html';
				}
				ngDialog.open({
					template: templateUrl,
					className: 'ngdialog-theme-default stay-card-alerts',
					scope: $scope,
					closeByDocument: false,
					closeByEscape: false,
					data: JSON.stringify({
						cardType: cardType,
						card: card
					})
				});
			}
		};

		$scope.replaceCardCaller = function(cardType, card, future) {
			$scope.replaceCard(cardType, card, future);
		};

		/**
		 * [showGroupOtherRoomTypeAvailablePopup description]
		 * @return {undefined}
		 */
		var showGroupOtherRoomTypeAvailablePopup = function() {
			ngDialog.open({
				template: '/assets/partials/cards/popups/group/rvResAttachingToGroupOtherRoomTypeAvailabe.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * [showGroupNoRoomTypeAvailablePopup description]
		 * @return {undefined}
		 */
		var showGroupNoRoomTypeAvailablePopup = function() {
			ngDialog.open({
				template: '/assets/partials/cards/popups/group/rvResAttachingToGroupNoAvailability.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * [showGroupNoRoomTypeAvailablePopup description]
		 * @return {undefined}
		 */
		var showGroupRoomTypeIsNotConfiguredPopup = function() {
			ngDialog.open({
				template: '/assets/partials/cards/popups/group/rvResAttachingToGroupRoomTypeIsNotConfigured.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};
		/**
		 * to navigate to room & rates screen
		 * @return {[type]} [description]
		 */
		$scope.navigateToRoomAndRates = function() {
			var resData = $scope.reservationData;
			$state.go('rover.reservation.staycard.mainCard.roomType', {
				from_date: resData.arrivalDate,
				to_date: resData.departureDate,
				fromState: function() {
					if ($state.current.name === "rover.reservation.staycard.reservationcard.reservationdetails") {
						return 'STAY_CARD'
					} else {
						return $state.current.name
					}
				}(),
				company_id: resData.company.id,
				travel_agent_id: resData.travelAgent.id,
				group_id: resData.group && resData.group.id,
				allotment_id: resData.allotment && resData.allotment.id
			});
		};

		/**
		 * navigate to group details
		 * @return {[type]} [description]
		 */
		$scope.gotoGroupDetails = function() {
			$state.go('rover.groups.config', {
				id: $scope.reservationData.group.id,
				activeTab: 'SUMMARY'
			});
		};

		/**
		 * Utility method to change the central reservation data model with our group data
		 * @param  {Object} groupData
		 * @return {undefined}
		 */
		var updateReservationGroupData = function(groupData) {

			//if it is not set initially
			if (_.isUndefined($scope.reservationData.group)) {
				$scope.reservationData.group = {};
			}

			_.extend($scope.reservationData.group, {
				id: groupData.id,
				name: groupData.group_name,
				code: groupData.group_code,
				company: groupData.company_id,
				travelAgent: groupData.travel_agent_id
			});
		};


		/**
		 * when we failed in attaching a group
		 */
		var failureCallBackOfAttachGroupToReservation = function(error) {
			if (error.hasOwnProperty('httpStatus')) {

				//470 is reserved for other room type is available
				if (error.httpStatus === 470) {
					showGroupOtherRoomTypeAvailablePopup();
				}

				//471 - NO availability in group
				else if (error.httpStatus === 471) {
					showGroupNoRoomTypeAvailablePopup();
				}

				//472 - Room type is not configured in Group
				else if (error.httpStatus === 472) {
					showGroupRoomTypeIsNotConfiguredPopup();
				}
			} else {
				$scope.errrorMessage = error;
			}
		};

		/**
		 * utility method to switch to normal card viewing mode
		 * @return {undefined}
		 */
		var switchToNomralCardViewingMode = function() {
			$scope.viewState.isAddNewCard = false;
		};

		/**
		 * when the API call is success
		 * @param  {Object} success data from API
		 * @return {undefined}
		 */
		var successCallBackOfAttachGroupToReservation = function(data, successCallBackParams) {
			var selectedGroup = successCallBackParams.selectedGroup;

			//updating the central reservation data model
			updateReservationGroupData(selectedGroup);

			//we are in card adding mode
			switchToNomralCardViewingMode();

			//we need to upadte the rate and other associated field, to do that, we are reloading the staycard
			if ($scope.isInStayCardScreen()) {
				$scope.reloadTheStaycard();
			}
		};

		/**
		 * [attachGroupToThisReservation description]
		 * @param  {Object} selectedGroup
		 * @return undefined
		 */
		var attachGroupToThisReservation = function(selectedGroup) {
			//calling the API
			var params = {
				reservation_id: $scope.reservationData.reservationId,
				group_id: selectedGroup.id
			};

			var options = {
				params: params,
				successCallBack: successCallBackOfAttachGroupToReservation,
				failureCallBack: failureCallBackOfAttachGroupToReservation,
				successCallBackParameters: {
					selectedGroup: selectedGroup
				}
			};

			$scope.callAPI(rvGroupSrv.attachGroupToReservation, options);
		};

		/**
		 * when we failed in attaching a group
		 */
		var failureCallBackOfDetachGroupFromThisReservation = function(error) {
			$scope.errrorMessage = error;
		};

		/**
		 * utility method to switch to normal card viewing mode
		 * @return {undefined}
		 */
		var switchToAddCardViewMode = function() {
			$scope.viewState.isAddNewCard = true;
		};

		/**
		 * utility method to unset group data
		 * @return {undefined}
		 */
		var resetReservationGroupData = function() {
			$scope.reservationData.group = {
				id: "",
				name: "",
				code: ""
			};
		};

		/**
		 * when the API call is success
		 * @param  {Object} success data from API
		 * @return {undefined}
		 */
		var successCallBackOfDetachGroupFromThisReservation = function(data, successCallBackParams) {
			//updating the central reservation data model
			resetReservationGroupData();

			//we will be in card opened mode, so closing
			$scope.closeGuestCard();

			//we are in details viewing mode
			switchToAddCardViewMode();

			$scope.$broadcast("groupCardDetached");

			$scope.navigateToRoomAndRates();
		};

		/**
		 * [detachGroupToThisReservation description]
		 * @param  {Object} selectedGroup
		 * @return undefined
		 */
		var detachGroupFromThisReservation = function(selectedGroup) {
			var resData = $scope.reservationData;

			//calling the API
			var params = {
				reservation_id: resData.reservationId,
				group_id: resData.group.id
			};

			var options = {
				params: params,
				successCallBack: successCallBackOfDetachGroupFromThisReservation,
				failureCallBack: failureCallBackOfDetachGroupFromThisReservation
			};

			$scope.callAPI(rvGroupSrv.detachGroupFromReservation, options);
		};

		$scope.selectGroup = function(group, $event) {
			$event.stopPropagation();
			if ($scope.viewState.identifier === "CREATION") {
				// In create reservation
				$scope.reservationData.group = {
					id: group.id,
					name: group.group_name,
					code: group.group_code,
					company: group.company_id,
					travelAgent: group.travel_agent_id
				};
				$scope.closeGuestCard();
				$scope.viewState.isAddNewCard = false;
				$scope.initGroupCard(group.id);
				if (!!$scope.reservationData.group.travelAgent) {
					$scope.reservationDetails.travelAgent.id = $scope.reservationData.group.travelAgent;
					$scope.initTravelAgentCard();
				}
				if (!!$scope.reservationData.group.company) {
					$scope.reservationDetails.companyCard.id = $scope.reservationData.group.company;
					$scope.initCompanyCard();
				}
				$scope.showContractedRates({
					companyCard: $scope.reservationDetails.companyCard.id,
					travelAgent: $scope.reservationDetails.travelAgent.id
				});
			} else {
				// In staycard
				attachGroupToThisReservation(group);
			}
		};

		/**
		 * if in create reservation mode
		 * @return {Boolean}
		 */
		var isInCreateReservationMode = function() {
			return ($scope.viewState.identifier === "CREATION");
		};

		/**
		 * [showAllotmentOtherRoomTypeAvailablePopup description]
		 * @return {undefined}
		 */
		var showAllotmentOtherRoomTypeAvailablePopup = function() {
			ngDialog.open({
				template: '/assets/partials/cards/popups/allotment/rvResAttachingToAllotmentOtherRoomTypeAvailabe.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * [showGroupNoRoomTypeAvailablePopup description]
		 * @return {undefined}
		 */
		var showAllotmentNoRoomTypeAvailablePopup = function() {
			ngDialog.open({
				template: '/assets/partials/cards/popups/allotment/rvResAttachingToAllotmentNoAvailability.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * [showGroupNoRoomTypeAvailablePopup description]
		 * @return {undefined}
		 */
		var showAllotmentRoomTypeIsNotConfiguredPopup = function() {
			ngDialog.open({
				template: '/assets/partials/cards/popups/allotment/rvResAttachingToAllotmentRoomTypeIsNotConfigured.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * navigate to group details
		 * @return {[type]} [description]
		 */
		$scope.gotoAllotmentDetails = function() {
			$state.go('rover.allotment.config', {
				id: $scope.reservationData.allotment.id,
				activeTab: 'SUMMARY'
			});
		};

		/**
		 * Utility method to change the central reservation data model with our allotment data
		 * @param  {Object} allotmentData
		 * @return {undefined}
		 */
		var updateReservationAllotmentData = function(allotmentData) {

			//if it is not set initially
			if (_.isUndefined($scope.reservationData.allotment)) {
				$scope.reservationData.allotment = {};
			}

			_.extend($scope.reservationData.allotment, {
				id: allotmentData.id,
				name: allotmentData.group_name,
				code: allotmentData.group_code
			});
		};

		/**
		 * when we failed in attaching a group
		 */
		var failureCallBackOfAttachAllotmentToReservation = function(error) {
			if (error.hasOwnProperty('httpStatus')) {

				//470 is reserved for other room type is available
				if (error.httpStatus === 470) {
					showAllotmentOtherRoomTypeAvailablePopup();
				}

				//471 - NO availability in group
				else if (error.httpStatus === 471) {
					showAllotmentNoRoomTypeAvailablePopup();
				}

				//472 - Room type is not configured in Group
				else if (error.httpStatus === 472) {
					showAllotmentRoomTypeIsNotConfiguredPopup();
				}
			} else {
				$scope.errrorMessage = error;
			}
		};


		/**
		 * when the API call is success
		 * @param  {Object} success data from API
		 * @return {undefined}
		 */
		var successCallBackOfAttachAllotmentToReservation = function(data, successCallBackParams) {
			var selectedGroup = successCallBackParams.selectedGroup;

			//updating the central reservation data model
			updateReservationAllotmentData(selectedGroup);

			//we are in card adding mode
			switchToNomralCardViewingMode();

			//fecthing the group details and showing them
			initializeAllotmentCard(selectedGroup.id);
		};

		/**
		 * [attachAllotmentToThisReservation description]
		 * @param  {Object} selectedAllotment
		 * @return undefined
		 */
		var attachAllotmentToThisReservation = function(selectedAllotment) {
			//calling the API
			var params = {
				reservation_id: $scope.reservationData.reservationId,
				group_id: selectedAllotment.id
			};

			var options = {
				params: params,
				successCallBack: successCallBackOfAttachAllotmentToReservation,
				failureCallBack: failureCallBackOfAttachAllotmentToReservation,
				successCallBackParameters: {
					selectedAllotment: selectedAllotment
				}
			};

			$scope.callAPI(rvGroupSrv.attachAllotmentToReservation, options);
		};

		/**
		 * when the user selects the allotment from the allotment search results,
		 * this will trigger
		 * @param {Object} - allotment object
		 * @param {Object} - clicked event
		 * @return {undefined}
		 */
		$scope.selectAllotment = function(selectedAllotment, $event) {
			$event.stopPropagation();

			if (isInCreateReservationMode()) {
				return;
			}

			//staycard card attaching
			else {
				attachAllotmentToThisReservation(selectedAllotment);
			}
		};

		/**
		 * function to search allotment
		 * @return {[type]} [description]
		 */
		$scope.searchAllotments = function() {
			$scope.$broadCast('FETCH_ALLOTMENT_SEARCH_DATA');
		};

		// CICO-11893
		// To show contracted Rate confirmation popup
		var showContractRatePopup = function(data) {
			$scope.cardData = data;
			ngDialog.open({
				template: '/assets/partials/cards/alerts/contractRatesConfirmation.html',
				className: '',
				closeByDocument: false,
				closeByEscape: false,
				scope: $scope
			});
		};
		// To keep existing rate and proceed.
		$scope.keepExistingRate = function(cardData) {
			if (cardData.account_type === 'COMPANY') {
				$scope.selectCompany(cardData);
			}
			if (cardData.account_type === 'TRAVELAGENT') {
				$scope.selectTravelAgent(cardData);
			}
			ngDialog.close();
		};
		// To change to contracted Rate and proceed.
		$scope.changeToContractedRate = function(cardData) {
			$scope.keepExistingRate(cardData);
			//$scope.navigateToRoomAndRates();
			ngDialog.close();
			//we will be in card opened mode, so closing
			$scope.closeGuestCard();

			$timeout(function() {
				$scope.navigateToRoomAndRates();
			}, 3000);
		};

		// To handle card selection from COMPANY / TA.
		$scope.selectCardType = function(cardData, $event) {
			$event.stopPropagation();

			if (cardData.account_type === 'COMPANY') {
				if (!!cardData.rate && $state.current.name !== "rover.reservation.staycard.mainCard.roomType") {
					showContractRatePopup(cardData);
				} else {
					$scope.selectCompany(cardData);
				}
			} else if (cardData.account_type === 'TRAVELAGENT') {
				if (!!cardData.rate && $state.current.name !== "rover.reservation.staycard.mainCard.roomType") {
					showContractRatePopup(cardData);
				} else {
					$scope.selectTravelAgent(cardData);
				}
			}
		};

		// On selecting comapny card
		$scope.selectCompany = function(company) {
			//CICO-7792
			if ($scope.viewState.identifier === "CREATION") {
				$scope.reservationData.company.id = company.id;
				$scope.showContractedRates({
					companyCard: company.id,
					travelAgent: $scope.reservationData.travelAgent.id
				});
				$scope.reservationData.company.name = company.account_name;
				$scope.reservationData.company.corporateid = $scope.companyCorpId;

				// update current controller scopehandleDrawClosing
				$scope.companyName = company.account_name;
				$scope.companyCity = company.city;
				$scope.closeGuestCard();
				$scope.reservationDetails.companyCard.id = company.id;
				$scope.initCompanyCard(company);
				$scope.viewState.isAddNewCard = false;
			} else {
				if (!$scope.reservationDetails.companyCard.futureReservations || $scope.reservationDetails.companyCard.futureReservations <= 0) {
					$scope.replaceCardCaller('company', company, false);
				} else {
					$scope.checkFuture('company', company);
				}
			}
		};
		// On selecting travel agent card
		$scope.selectTravelAgent = function(travelAgent) {
			//CICO-7792
			if ($scope.viewState.identifier === "CREATION") {
				// Update main reservation scope
				$scope.reservationData.travelAgent.id = travelAgent.id;
				$scope.showContractedRates({
					companyCard: $scope.reservationData.company.id,
					travelAgent: travelAgent.id
				});
				$scope.reservationData.travelAgent.name = travelAgent.account_name;
				$scope.reservationData.travelAgent.iataNumber = $scope.travelAgentIATA;

				// update current controller scope
				$scope.travelAgentName = travelAgent.account_name;
				$scope.travelAgentCity = travelAgent.city;
				$scope.closeGuestCard();
				$scope.reservationDetails.travelAgent.id = travelAgent.id;
				$scope.initTravelAgentCard(travelAgent);
				$scope.viewState.isAddNewCard = false;
			} else {
				if (!$scope.reservationDetails.travelAgent.futureReservations || $scope.reservationDetails.travelAgent.futureReservations <= 0) {
					$scope.replaceCardCaller('travel_agent', travelAgent, false);
				} else {
					$scope.checkFuture('travel_agent', travelAgent);
				}
			}
		};

		$scope.selectGuest = function(guest, $event) {
			$event.stopPropagation();
			if ($scope.viewState.identifier === "CREATION") {
				$scope.reservationData.guest.id = guest.id;
				$scope.reservationData.guest.firstName = guest.firstName;
				$scope.reservationData.guest.lastName = guest.lastName;
				$scope.reservationData.guest.city = guest.address.city;
				$scope.reservationData.guest.loyaltyNumber = $scope.guestLoyaltyNumber;

				// update current controller scope
				$scope.guestFirstName = guest.firstName;
				$scope.guestLastName = guest.lastName;
				$scope.guestCity = guest.address.city;
				$scope.guestCardData.cardHeaderImage = guest.image;
				$scope.viewState.isAddNewCard = false;
				$scope.reservationDetails.guestCard.id = guest.id;
				$scope.initGuestCard(guest);
				$scope.closeGuestCard();
			} else {
				if (!$scope.reservationDetails.guestCard.futureReservations || $scope.reservationDetails.guestCard.futureReservations <= 0) {
					$scope.replaceCardCaller('guest', guest, false);
				} else {
					$scope.checkFuture('guest', guest);
				}
			}
		};

		$scope.refreshScroll = function(elemToBeRefreshed) {
			if (typeof $scope.$parent.myScroll !== 'undefined') {
				$timeout(function() {
					$scope.$parent.myScroll[elemToBeRefreshed].refresh();
				}, 300);
			}
		};
		// CREATES
		$scope.createNewGuest = function() {
			// create an empty dataModel for the guest
			var contactInfoData = {
				'contactInfo': {},
				'countries': $scope.countries,
				'userId': "",
				'avatar': "",
				'guestId': "",
				'vip': false
			};

			$scope.guestCardData.contactInfo = contactInfoData.contactInfo;
			$scope.guestCardData.contactInfo.avatar = contactInfoData.avatar;
			$scope.guestCardData.contactInfo.vip = contactInfoData.vip;
			$scope.countriesList = contactInfoData.countries;
			$scope.guestCardData.userId = contactInfoData.userId;
			$scope.guestCardData.guestId = contactInfoData.guestId;
			$scope.guestCardData.contactInfo.birthday = null;
			var guestInfo = {
				"user_id": "",
				"guest_id": ""
			};
			// Retain Search Keys
			$scope.guestCardData.contactInfo.first_name = $scope.searchData.guestCard.guestFirstName;
			$scope.guestCardData.contactInfo.last_name = $scope.searchData.guestCard.guestLastName;
			$scope.guestCardData.contactInfo.email = $scope.searchData.guestCard.email;

			$scope.guestCardData.contactInfo.address = {};
			$scope.guestCardData.contactInfo.address.city = $scope.searchData.guestCard.guestCity;
			$scope.guestCardData.membership_no = $scope.searchData.guestCard.guestLoyaltyNumber;
			$scope.$broadcast('guestCardAvailable');
			$scope.current = 'guest-contact';
			$scope.viewState.isAddNewCard = true;
		};

		$scope.createNewCompany = function() {
			$scope.companyContactInformation = RVReservationDataService.getEmptyAccountData();
			$scope.reservationDetails.companyCard.id = "";
			$scope.reservationDetails.companyCard.futureReservations = 0;
			$scope.viewState.isAddNewCard = true;
			$scope.$broadcast('companyCardAvailable', true);

		};

		$scope.createNewTravelAgent = function() {
			$scope.travelAgentInformation = RVReservationDataService.getEmptyAccountData();
			$scope.reservationDetails.travelAgent.id = "";
			$scope.reservationDetails.travelAgent.futureReservations = 0;
			$scope.viewState.isAddNewCard = true;
			$scope.$broadcast('travelAgentFetchComplete', true);
		};

		$scope.clickedSaveCard = function(cardType) {
			if (cardType === "guest") {
				$scope.$broadcast("saveContactInfo");
			}
		};

		$scope.newGuestAdded = function(id) {
			$scope.viewState.isAddNewCard = false;
			$scope.viewState.pendingRemoval.status = false;
			$scope.viewState.pendingRemoval.cardType = "";
			$scope.initGuestCard({
				id: id
			});
			$scope.closeGuestCard();
		};

		$scope.$on("updateGuestEmail", function(e) {
			$scope.guestCardData.contactInfo.email = $scope.reservationData.guest.email;
		});
		//Listener to update the card info from billing info
		$scope.$on("CardInfoUpdated", function(e, card_id, card_type) {
			if (card_type === 'COMPANY_CARD') {
				$scope.reservationDetails.companyCard.id = card_id;
				$scope.initCompanyCard();
			} else {
				$scope.reservationDetails.travelAgent.id = card_id;
				$scope.initTravelAgentCard();
			}

		});

		$scope.$on('PROMPTCARDENTRY', function() {
			if (!$scope.reservationDetails.guestCard.id) {
				$scope.openGuestCard();
			}
		});


		$scope.init();

		// CICO-6049 Toggle VIP button
		$scope.vipToggleClicked = function() {
			$scope.guestCardData.contactInfo.vip = !$scope.guestCardData.contactInfo.vip;
			$scope.updateContactInfo();
		};

		/**
		 * Hide detach card in case of group reservations		 
		 */
		$scope.allowDetachAgent = function() {
			return !$scope.reservationData.group.id;
		};

		$scope.allowDetachCompany = function() {
			return !$scope.reservationData.group.id;
		};


		$scope.guestCardClicked = function() {
			//save contact info
			//CICO-16965 Do IFF the card is saved - NOT in Add mode
			if (!$scope.viewState.isAddNewCard) {
				// Call save if NOT 'AddNewCard' mode
				$scope.$broadcast('saveContactInfo');
			}
		};
	}
]);