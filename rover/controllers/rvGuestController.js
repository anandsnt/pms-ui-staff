sntRover.controller('guestCardController', ['$scope', '$window', 'RVCompanyCardSrv', 'RVReservationAllCardsSrv', 'RVContactInfoSrv', '$stateParams',
	function($scope, $window, RVCompanyCardSrv, RVReservationAllCardsSrv, RVContactInfoSrv, $stateParams) {

		var resizableMinHeight = 90;
		var resizableMaxHeight = $(window).height() - resizableMinHeight;
		$scope.cardVisible = false;
		//init activeCard as the companyCard
		$scope.activeCard = "companyCard";

		BaseCtrl.call(this, $scope);

		// fetch reservation company card details 
		$scope.initCompanyCard = function() {
			var successCallbackOfInitialFetch = function(data) {
				$scope.$emit("hideLoader");
				$scope.companyContactInformation = data;
				$scope.$broadcast('companyCardAvailable');
			};
			var param = {
				'id': $scope.reservationDetails.companyCard.id
			};
			$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, param, successCallbackOfInitialFetch);
		}

		// fetch reservation travel agent card details
		$scope.initTravelAgentCard = function() {
			var successCallbackOfInitialFetch = function(data) {
				$scope.$emit("hideLoader");
				$scope.travelAgentInformation = data;
				$scope.$broadcast('travelAgentFetchComplete');
			};
			var param = {
				'id': $scope.reservationDetails.travelAgent.id
			};
			$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, param, successCallbackOfInitialFetch);
		}

		$scope.init = function() {
			$scope.contactInfoError = false;
			$scope.eventTimestamp = "";
			var preventClicking = false;
			$scope.initCompanyCard();
			$scope.initTravelAgentCard();
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


		$scope.detachCard = function() {
			console.log('detachCard');
			$scope.$emit('cardDetached');
			$scope.$broadcast('cardDetached');
		}

		// init staycard header

		$scope.searchCompany = function() {
			var successCallBackFetchCompanies = function(data) {
				$scope.$emit("hideLoader");
				// $scope.refreshScroll('companyResultScroll');
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


		$scope.init();



	}
]);