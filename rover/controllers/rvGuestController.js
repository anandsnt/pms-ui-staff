sntRover.controller('guestCardController', ['$scope', '$window', 'RVCompanyCardSrv', 'RVReservationAllCardsSrv', 'RVContactInfoSrv', '$stateParams', '$timeout', 'ngDialog',

	function($scope, $window, RVCompanyCardSrv, RVReservationAllCardsSrv, RVContactInfoSrv, $stateParams, $timeout, ngDialog) {

		var resizableMinHeight = 90;
		var resizableMaxHeight = $(window).height() - resizableMinHeight;
		$scope.cardVisible = false;
		//init activeCard as the companyCard
		$scope.activeCard = "companyCard";

		BaseCtrl.call(this, $scope);

		$scope.init = function() {
			$scope.contactInfoError = false;
			$scope.eventTimestamp = "";
			var preventClicking = false;
		};

		$scope.$on('reservationCardisClicked', function() {
			$("#guest-card").css("height", $scope.resizableOptions.minHeight); //against angular js practice, sorry :(
			$scope.guestCardVisible = false;
		});
		/**
		 * for dragging of guest card
		 */
		$scope.guestCardVisible = false; //varibale used to determine whether to show guest card's different tabs
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
			minHeight: '90',
			maxHeight: screen.height - 200,
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
					$scope.$emit('GUESTCARDVISIBLE', false);
					$scope.$apply();
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

			var unwantedKeys = ["address", "birthday", "country",
				"is_opted_promotion_email", "job_title",
				"mobile", "passport_expiry",
				"passport_number", "postal_code",
				"reservation_id", "title", "user_id",
				"works_at", "birthday"
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
		 * tab actions
		 */
		$scope.guestCardTabSwitch = function(tab) {
			if ($scope.current === 'guest-contact' && tab !== 'guest-contact') {
				$scope.$broadcast('saveContactInfo');
			};
			if (tab === 'guest-credit') {
				$scope.$broadcast('PAYMENTSCROLL');
			}

			$scope.current = tab;
		};

		$scope.$on('contactInfoError', function(event, value) {
			$scope.contactInfoError = value;
		});
		$scope.updateContactInfo = function() {
			var saveUserInfoSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
			};
			var saveUserInfoFailureCallback = function(data) {
				$scope.$emit('hideLoader');
			};
			var newUpdatedData = $scope.decloneUnwantedKeysFromContactInfo();
			// check if there is any chage in data.if so call API for updating data
			if (JSON.stringify(currentGuestCardHeaderData) !== JSON.stringify(newUpdatedData)) {
				currentGuestCardHeaderData = newUpdatedData;
				var data = {
					'data': currentGuestCardHeaderData,
					'userId': $scope.guestCardData.contactInfo.user_id
				};
				$scope.invokeApi(RVContactInfoSrv.saveContactInfo, data, saveUserInfoSuccessCallback, saveUserInfoFailureCallback);
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

		$scope.checkOutsideClick = function(targetElement) {
			if ($(targetElement).closest(".stay-card-alerts").length < 1) {
				$scope.closeGuestCard();
			}
		}

		/**
		 * handle click outside tabs and drawer click
		 */

		$scope.guestCardClick = function($event) {

			var element = $event.target;
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-handle")[0])) {
				if (parseInt($scope.eventTimestamp)) {
					if (($event.timeStamp - $scope.eventTimestamp) < 100) {
						return;
					}
				}

				if (!$scope.guestCardVisible) {
					$("#guest-card").css("height", $scope.windowHeight - 90);
					$scope.guestCardVisible = true;
					$scope.$broadcast('CONTACTINFOLOADED');
					$scope.$emit('GUESTCARDVISIBLE', true);
				} else {
					$("#guest-card").css("height", $scope.resizableOptions.minHeight);
					$scope.guestCardVisible = false;
					$scope.$emit('GUESTCARDVISIBLE', false);
				}
			} else {
				if (getParentWithSelector($event, document.getElementById("guest-card-content"))) {
					/**
					 * handle click on tab navigation bar.
					 */
					if ($event.target.id === 'guest-card-tabs-nav')
						$scope.$broadcast('saveContactInfo');
					else
						return;
				} else {
					$scope.$broadcast('saveContactInfo');
				}
			}

		};

		$scope.UICards = ['guest-card', 'company-card', 'travel-agent-card'];

		// className based on UICards index
		var subCls = ['first', 'second', 'third'];

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
		}

		$scope.UICardContentCls = function(from) {
			// evaluate UICards return card conten className(s) as string
			var cls = '';
			if (from !== $scope.UICards[0]) {
				cls = "hidden";
			} else {
				cls = 'visible';
			};
			return cls;
		}

		$scope.cardCls = function() {
			// evaluate 
			var cls = $scope.UICards[0]; //  current active card
			if ($scope.cardVisible) {
				cls += " open";
			}
			return cls;
		}

		$scope.switchCard = function(from) {
			//  based on from
			//  swap UICards array for guest-card, company-card & travel-agent-card
			var newCardIndex = $scope.UICards.indexOf(from);
			var currentCard = $scope.UICards[0];
			$scope.UICards[0] = from;
			$scope.UICards[newCardIndex] = currentCard;
			if ($scope.UICards[0] == 'company-card' || $scope.UICards[0] == 'travel-agent-card') {
				$scope.activeCard = $scope.UICards[0] == 'company-card' ? "companyCard" : "travelAgent";
				$scope.$broadcast('activeCardChanged');
			}
		}

		/**
		 * function to open guest card
		 */
		$scope.openGuestCard = function() {
			$scope.cardVisible = true;
			$scope.guestCardHeight = resizableMaxHeight;
			//refresh scroll in the contact tab of the card-content view. Handled in rover/controllers/rvCompanyCardsContactCtrl.js
			$scope.$broadcast("contactTabActive");
		};

		/**
		 * function to close guest card
		 */
		$scope.closeGuestCard = function() {
			$scope.guestCardHeight = resizableMinHeight;
			//Check if pending removals - If yes remove 
			if ($scope.pendingRemoval.status) {
				$scope.removeCard($scope.pendingRemoval.cardType);
			}
			$scope.cardVisible = false;
		};

		/**
		 * function to execute click on Guest card
		 */
		$scope.clickedOnGuestCard = function($event) {
			if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-s")[0])) {
				if ($scope.cardVisible) {
					$scope.closeGuestCard();
				} else {
					$scope.openGuestCard();
				}

			}
		};

		$scope.detachCard = function(cardType) {
			var cards = {
				"guest": "Guest Card",
				"company": "Company Card",
				"travel_agent": "Travel Agent Card"
			}

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

		$scope.deleteCard = function(cardType) {
			if (cardType == 'travel_agent') {
				$scope.$broadcast('travelAgentDetached');
				$scope.pendingRemoval.status = true;
				$scope.pendingRemoval.cardType = "travel_agent";
			} else if (cardType == 'company') {
				$scope.$broadcast('companyCardDetached');
				$scope.pendingRemoval.status = true;
				$scope.pendingRemoval.cardType = "company";
			} else if (cardType == 'guest') {
				$scope.$broadcast('guestCardDetached');
				$scope.pendingRemoval.status = true;
				$scope.pendingRemoval.cardType = "guest";
			}
		}

		// init staycard header

		$scope.searchGuest = function() {
			var successCallBackFetchGuest = function(data) {
				$scope.$emit("hideLoader");
				$scope.refreshScroll('guestResultScroll');
				$scope.guestSearchIntiated = true;
				$scope.searchedGuests = [];
				if (data.results.length > 0) {
					angular.forEach(data.results, function(item) {
						var guestData = {};
						guestData.id = item.id;
						guestData.firstName = item.first_name;
						guestData.lastName = item.last_name;
						guestData.image = item.image_url;
						if (item.address != null) {
							guestData.address = {};
							guestData.address.city = item.address.city;
							guestData.address.state = item.address.state;
							guestData.address.postalCode = item.address.postal_code;
						}
						guestData.stayCount = item.stay_count;
						guestData.lastStay = {};
						guestData.phone = item.home_phone;
						guestData.lastStay.date = item.last_stay.date;
						guestData.lastStay.room = item.last_stay.room;
						guestData.lastStay.roomType = item.last_stay.room_type;
						$scope.searchedGuests.push(guestData);
					});
				}
				$scope.$broadcast('guestSearchInitiated');
			}
			if ($scope.searchData.guestCard.guestFirstName != '' || $scope.searchData.guestCard.guestLastName != '' || $scope.searchData.guestCard.guestCity != '' || $scope.searchData.guestCard.guestLoyaltyNumber != '') {
				var paramDict = {
					'first_name': $scope.searchData.guestCard.guestFirstName,
					'last_name': $scope.searchData.guestCard.guestLastName,
					'city': $scope.searchData.guestCard.guestCity,
					'membership_no': $scope.searchData.guestCard.guestLoyaltyNumber
				};
				$scope.invokeApi(RVReservationAllCardsSrv.fetchGuests, paramDict, successCallBackFetchGuest);
			} else {
				$scope.guestSearchIntiated = false;
				$scope.searchedGuests = [];
				$scope.$apply();
				$scope.$broadcast('companySearchStopped');
			}
		}

		$scope.searchCompany = function() {
			var successCallBackFetchCompanies = function(data) {
				$scope.$emit("hideLoader");
				$scope.companySearchIntiated = true;
				$scope.searchedCompanies = [];
				if (data.accounts.length > 0) {
					angular.forEach(data.accounts, function(item) {
						var companyData = {};
						companyData.id = item.id;
						companyData.firstName = item.account_first_name;
						companyData.lastName = item.account_last_name;
						companyData.logo = item.company_logo;
						if (item.address != null) {
							companyData.address = {};
							companyData.address.postalCode = item.address.postal_code;
							companyData.address.city = item.address.city;
							companyData.address.state = item.address.state;
						}
						companyData.email = item.email;
						companyData.phone = item.phone;
						$scope.searchedCompanies.push(companyData);
					});
				}
				$scope.$broadcast('companySearchInitiated');
			}
			if ($scope.searchData.companyCard.companyName != '' || $scope.searchData.companyCard.companyCity != '' || $scope.searchData.companyCard.companyCorpId != '') {
				var paramDict = {
					'name': $scope.searchData.companyCard.companyName,
					'city': $scope.searchData.companyCard.companyCity,
					'corporate_id': $scope.searchData.companyCard.companyCorpId
				};
				$scope.invokeApi(RVReservationAllCardsSrv.fetchCompaniesOrTravelAgents, paramDict, successCallBackFetchCompanies);
			} else {
				$scope.companySearchIntiated = false;
				$scope.searchedCompanies = [];
				$scope.$apply();
				$scope.$broadcast('companySearchStopped');
			}
		}

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
							travelAgentData.firstName = item.account_first_name;
							travelAgentData.lastName = item.account_last_name;
							travelAgentData.logo = item.company_logo;
							if (item.address != null) {
								travelAgentData.address = {};
								travelAgentData.address.postalCode = item.address.postal_code;
								travelAgentData.address.city = item.address.city;
								travelAgentData.address.state = item.address.state;
							}
							if (item.current_contract != null) {
								travelAgentData.rate = item.current_contract.name;
							}
							travelAgentData.email = item.email;
							travelAgentData.phone = item.phone;
							$scope.searchedtravelAgents.push(travelAgentData);
						}
					});
				}
				$scope.$broadcast('travelAgentSearchInitiated');
			}
			if ($scope.searchData.travelAgentCard.travelAgentName != '' || $scope.searchData.travelAgentCard.travelAgentCity != '' || $scope.searchData.travelAgentCard.travelAgentIATA != '') {
				var paramDict = {
					'name': $scope.searchData.travelAgentCard.travelAgentName,
					'city': $scope.searchData.travelAgentCard.travelAgentCity,
					'corporate_id': $scope.searchData.travelAgentCard.travelAgentIATA
				};
				$scope.invokeApi(RVReservationAllCardsSrv.fetchCompaniesOrTravelAgents, paramDict, successCallBackFetchTravelAgents);
			} else {
				$scope.searchedtravelAgents = [];
				$scope.travelAgentSearchIntiated = false;
				$scope.$broadcast('travelAgentSearchStopped');
			}
		}

		$scope.checkFuture = function(cardType, cardId) {
			// Changing this reservation only will unlink the stay card from the previous company / travel agent card and assign it to the newly selected card. 
			// Changing all reservations will move all stay cards to the new card. 
			// This will only apply when a new company / TA card had been selected. 
			// If no new card has been selected, the change will only ever just apply to the current reservation and the above message should not display.
			// If multiple future reservations exist for the same Travel Agent / Company Card details, display message upon navigating away from the Stay Card 'Future reservations exist for the same Travel Agent / Company card.' 
			// With choice of 'Change this reservation only' and 'Change all Reservations'.
			ngDialog.open({
				template: '/assets/partials/cards/alerts/futureReservationsAccounts.html',
				className: 'ngdialog-theme-default stay-card-alerts',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false,
				data: JSON.stringify({
					cardType: cardType,
					cardId: cardId
				})
			});
		}

		$scope.replaceCardCaller = function(cardType, cardId, future) {
			$scope.replaceCard(cardType, cardId, future);
		}



		$scope.selectCompany = function(company, $event) {
			$event.stopPropagation();
			// string (guest, company, travel_agent)
			// clean search data
			$scope.searchData.companyCard.companyName = "";
			$scope.searchData.companyCard.companyCity = "";
			$scope.searchData.companyCard.companyCorpId = "";
			// TODO - check condition 
			if ($scope.reservationDetails.companyCard.futureReservations <= 0) {
				$scope.replaceCardCaller('company', company.id, false);
			} else {
				$scope.checkFuture('company', company.id);
			}
		}

		$scope.selectTravelAgent = function(travelAgent, $event) {
			$event.stopPropagation();

			if ($scope.reservationDetails.travelAgent.futureReservations <= 0) {
				$scope.replaceCardCaller('travel_agent', travelAgent.id, false);
			} else {
				$scope.checkFuture('travel_agent', travelAgent.id);
			}
		}

		$scope.selectGuest = function(guest, $event) {
			$event.stopPropagation();
			// string (guest, company, travel_agent)
			// clean search data

			$scope.replaceCard('guest', guest.id);
			$scope.reservationDetails.guestCard.id = guest.id;
			$scope.initGuestCard();
			$scope.$broadcast('guestSearchStopped');
		}

		$scope.refreshScroll = function(elemToBeRefreshed) {
			if (typeof $scope.$parent.myScroll != 'undefined') {
				$timeout(function() {
					$scope.$parent.myScroll[elemToBeRefreshed].refresh();
				}, 300);
			}
		}
	}
]);