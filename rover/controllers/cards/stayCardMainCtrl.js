sntRover.controller('stayCardMainCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'RVReservationCardSrv', 'RVGuestCardSrv', 'ngDialog', '$state', 'RVReservationSummarySrv', '$timeout', 'dateFilter', 'RVContactInfoSrv', '$q', 'RVReservationStateService', 'RVReservationDataService', 'rvGroupConfigurationSrv',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, RVReservationCardSrv, RVGuestCardSrv, ngDialog, $state, RVReservationSummarySrv, $timeout, dateFilter, RVContactInfoSrv, $q, RVReservationStateService, RVReservationDataService, rvGroupConfigurationSrv) {
		BaseCtrl.call(this, $scope);
		//Switch to Enable the new cards addition funcitonality
		$scope.addNewCards = true;
		var that = this;
		if ($scope.guestCardData.cardHeaderImage === undefined || $scope.guestCardData.cardHeaderImage === "") {
			$scope.guestCardData.cardHeaderImage = '/assets/avatar-trans.png';
		}
		$scope.pendingRemoval = {
			status: false,
			cardType: ""
		};

		$scope.setHeadingTitle = function(heading) {
			$scope.heading = heading;
			$scope.setTitle(heading);
		};

		$scope.cardSaved = function() {
			$scope.viewState.isAddNewCard = false;
		};

		var successCallbackOfCountryListFetch = function(data) {
			$scope.countries = data;
		};

		//fetching country list
		$scope.invokeApi(RVCompanyCardSrv.fetchCountryList, {}, successCallbackOfCountryListFetch);


		$scope.initGuestCard = function(guestData) {
			if (!guestData) {
				guestData = {
					id: ""
				}
			}
			// passReservationParams
			//TODO : Once this works pull it to a separate method
			var fetchGuestcardDataSuccessCallback = function(data) {
				$scope.idTypeList = data.id_type_list;
				$scope.$emit('hideLoader');
				// No more future reservations returned with this API call


				/**
				 *	CICO-9169
				 * 	Guest email id is not checked when user adds Guest details in the Payment page of Create reservation
				 *  -- To have the primary email id in app/assets/rover/partials/reservation/rvSummaryAndConfirm.html checked if the user attached has one!
				 */

				if (data.email && data.email.length > 0) {
					$scope.otherData.isGuestPrimaryEmailChecked = true;
				} else {
					// Handles cases where Guest with email is replaced with a Guest w/o an email address!
					$scope.otherData.isGuestPrimaryEmailChecked = false;
				}

				//	CICO-9169

				var contactInfoData = {
					'contactInfo': data,
					'countries': $scope.countries,
					'userId': $scope.reservationDetails.guestCard.id,
					'avatar': $scope.guestCardData.cardHeaderImage,
					'guestId': null,
					'vip': data.vip
				};
				$scope.guestCardData.contactInfo = contactInfoData.contactInfo;
				$scope.guestCardData.contactInfo.avatar = contactInfoData.avatar;
				$scope.guestCardData.contactInfo.vip = contactInfoData.vip;
				$scope.countriesList = $scope.countries;
				$scope.guestCardData.userId = contactInfoData.userId;
				$scope.guestCardData.guestId = contactInfoData.guestId;
				$scope.guestCardData.contactInfo.birthday = data.birthday;
				var guestInfo = {
					"user_id": contactInfoData.userId,
					"guest_id": null
				};
				$scope.searchData.guestCard.guestFirstName = "";
				$scope.searchData.guestCard.guestLastName = "";
				$scope.searchData.guestCard.guestCity = "";
				$scope.searchData.guestCard.guestLoyaltyNumber = "";
				$scope.searchData.guestCard.email = "";

				$scope.guestCardData.contactInfo.user_id = contactInfoData.userId;
				$scope.reservationData.guest.email = data.email;
				$scope.$broadcast('guestSearchStopped');
				$scope.$broadcast('guestCardAvailable');
				$scope.showGuestPaymentList(guestInfo);
				RVContactInfoSrv.completeContactInfoClone = JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
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
				$scope.$broadcast("resetGuestTab");
				// CICO-16013 - fixing multiple API calls on staycard loading

			};

			var fetchGuestcardDataFailureCallback = function(data) {
				$scope.$emit('hideLoader');
			};


			if (!!guestData.id || !!$scope.reservationDetails.guestCard.id || !!$scope.reservationData.guest.id) {
				var param = {
					'id': guestData.id || $scope.reservationDetails.guestCard.id || $scope.reservationData.guest.id
				};
				$scope.invokeApi(RVReservationCardSrv.getGuestDetails, param, fetchGuestcardDataSuccessCallback, fetchGuestcardDataFailureCallback, 'NONE');
			}
		};

		/**
		 * [successCallbackOfGroupDetailsFetch description]
		 * @return {[type]} [description]
		 */
		var successCallbackOfGroupDetailsFetch = function(response) {
			_.extend($scope.groupConfigData, {
				activeTab: 'SUMMARY', // Possible values are SUMMARY, ROOM_BLOCK, ROOMING, ACCOUNT, TRANSACTIONS, ACTIVITY
				summary: response.groupSummary,
				selectAddons: false, // To be set to true while showing addons full view
				addons: {},
				selectedAddons: []
			});
		};

		/**
		 * [successCallBackOfGroupHoldListFetch description]
		 * @param  {[type]} holdStatusList [description]
		 * @return {[type]}                [description]
		 */
		var successCallBackOfGroupHoldListFetch = function(holdStatusList) {
			_.extend($scope.groupConfigData, {
				holdStatusList: holdStatusList.data.hold_status
			});
		};

		/**
		 * [successFetchOfAllReqdForGroupDetailsShowing description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		var successFetchOfAllReqdForGroupDetailsShowing = function(data) {
			$scope.$broadcast('groupCardAvailable');
			$scope.$broadcast('groupSummaryDataChanged', $scope.groupConfigData);
			$scope.$emit("hideLoader");
		};

		/**
		 * [failedToFetchOfAllReqdForGroupDetailsShowing description]
		 * @return {[type]} [description]
		 */
		var failedToFetchOfAllReqdForGroupDetailsShowing = function(errorMessage) {
			$scope.errorMessage = errorMessage;
			$scope.$emit("hideLoader");
		};

		$scope.initGroupCard = function(groupId) {
			var promises = [];
			//we are not using our normal API calling since we have multiple API calls needed
			$scope.$emit('showLoader');

			$scope.groupConfigData = {
				activeScreen: 'STAY_CARD'
			};

			//group details fetch
			var paramsForGroupDetails = {
				groupId: groupId
			};
			promises.push(rvGroupConfigurationSrv
				.getGroupSummary(paramsForGroupDetails)
				.then(successCallbackOfGroupDetailsFetch)
			);

			//reservation list fetch
			var paramsForHoldListFetch = {
				is_group: true
			};
			promises.push(rvGroupConfigurationSrv
				.getHoldStatusList(paramsForHoldListFetch)
				.then(successCallBackOfGroupHoldListFetch)
			);

			//Lets start the processing
			$q.all(promises)
				.then(successFetchOfAllReqdForGroupDetailsShowing, failedToFetchOfAllReqdForGroupDetailsShowing);
		};

		// fetch reservation company card details
		$scope.initCompanyCard = function() {
			var companyCardFound = function(data) {
				$scope.$emit("hideLoader");
				data.id = $scope.reservationDetails.companyCard.id;
				$scope.companyContactInformation = data;
				// No more future reservations returned with this API call

				$scope.$broadcast('companyCardAvailable');

			};
			//	companycard defaults to search mode
			// 	Hence, do API call only if a company card ID is returned
			if ($scope.reservationDetails.companyCard.id !== '' && $scope.reservationDetails.companyCard.id !== null) {
				var param = {
					'id': $scope.reservationDetails.companyCard.id
				};
				$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, param, companyCardFound);
			}
		};

		// fetch reservation travel agent card details
		$scope.initTravelAgentCard = function() {
			var successCallbackOfInitialFetch = function(data) {
				$scope.$emit("hideLoader");
				data.id = $scope.reservationDetails.travelAgent.id;
				$scope.travelAgentInformation = data;

				// No more future reservations returned with this API call

				$scope.$broadcast('travelAgentFetchComplete');

			};
			//	TAcard defaults to search mode
			// 	Hence, do API call only if a company card ID is returned
			if ($scope.reservationDetails.travelAgent.id !== '' && $scope.reservationDetails.travelAgent.id !== null) {
				var param = {
					'id': $scope.reservationDetails.travelAgent.id
				};
				$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, param, successCallbackOfInitialFetch);
			}
		};


		$scope.$on('cardIdsFetched', function(event, isCardSame) {
			// Restore view state
			$scope.viewState.pendingRemoval.status = false;
			$scope.viewState.pendingRemoval.cardType = "";

			//init all cards with new data
			if (!isCardSame.guest) {
				$scope.$broadcast('guestCardDetached');
				$scope.initGuestCard();
			}
			if (!isCardSame.company) {
				$scope.$broadcast('companyCardDetached');
				$scope.initCompanyCard();
			}
			if (!isCardSame.agent) {
				$scope.$broadcast('travelAgentDetached');
				$scope.initTravelAgentCard();
			}

			if (!isCardSame.group) {
				$scope.$broadcast('groupDetached');
				$scope.initGroupCard($scope.reservationDetails.group.id);
			}

			// The future counts of the cards attached with the reservation
			// will be received here!
			// This code should be HIT everytime there is a removal or a replacement of
			// any of the cards attached!
			//if cards are not attached future reservation values are coming in as null
			var futureCounts = $scope.reservationListData.future_reservation_counts;


			$scope.reservationDetails.guestCard.futureReservations = futureCounts.guest === null ? 0 : futureCounts.guest;
			$scope.reservationDetails.companyCard.futureReservations = futureCounts.company === null ? 0 : futureCounts.company;
			$scope.reservationDetails.travelAgent.futureReservations = futureCounts.travel_agent === null ? 0 : futureCounts.travel_agent;

			// TODO: Remove the following commented out code!
			// Leaving it now for further debugging if required


		});

		/**
		 * if we wanted to reload particular staycard details
		 * @return {undeifned} [description]
		 */
		$scope.reloadTheStaycard = function() {
			$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
				"id": typeof $stateParams.id === "undefined" ? $scope.reservationData.reservationId : $stateParams.id,
				"confirmationId": $stateParams.confirmationId,
				"isrefresh": false
			});
		};

		/**
		 * if current screen is in staycard
		 * @return {Boolean} [description]
		 */
		$scope.isInStayCardScreen = function() {
			return ($scope.viewState.identifier === "STAY_CARD");
		};
		$scope.removeCard = function(card, cardId, options) {
			var cardId 			= cardId || null,
				successCallBack = (!!options) ? options.successCallBack : null,
				failureCallBack = (!!options) ? options.failureCallBack : null;

			// This method returns the numnber of cards attached to the staycard
			var checkNumber = function() {
					var x = 0;
					_.each($scope.reservationDetails, function(d, i) {
						if (typeof d.id !== 'undefined' && d.id !== '' && d.id !== null) {
							x++;
						}
					});
					return x;
				},
				onRemoveSuccess = function() {
					$scope.cardRemoved(card);
					$scope.$emit('hideLoader');
					// call custom callback functions if exists
					if(successCallBack) {
						successCallBack();
					}

					/**
					 * 	Reload the stay card if any of the attached cards are changed! >>> 7078 / 7370
					 * 	the state would be STAY_CARD in the reservation edit mode also.. hence checking for confirmation id in the state params
					 * 	The confirmationId will not be in the reservation edit/create stateParams except for the confirmation screen...
					 * 	However, in the confirmation screen the identifier would be "CONFIRM"
					 */
					if ($scope.viewState.identifier === "STAY_CARD" && typeof $stateParams.confirmationId !== "undefined") {
						$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
							"id": typeof $stateParams.id === "undefined" ? $scope.reservationData.reservationId : $stateParams.id,
							"confirmationId": $stateParams.confirmationId,
							"isrefresh": false
						});
					}
				},
				onRemoveFailure = function() {
					$scope.$emit('hideLoader');
					// call custom callback functions if exists
					if(failureCallBack) {
						failureCallBack();
					}
				},
				onEachRemoveSuccess = function() {
					// Handle indl, remove success
				};

			//Cannot Remove the last card... Tell user not to select another card
			if (checkNumber() > 1 && card !== "") {
				if ($scope.reservationData && $scope.reservationData.reservationIds && $scope.reservationData.reservationIds.length > 1) {
					var promises = []; // Use this array to push the promises returned for every call
					$scope.$emit('showLoader');
					// Loop through the reservation ids and call the cancel API for each of them
					_.each($scope.reservationData.reservationIds, function(reservationId) {
						promises.push(RVCompanyCardSrv.removeCard({
							'reservation': reservationId,
							'cardType': card,
							'cardId': cardId
						}).then(onEachRemoveSuccess));
					});
					$q.all(promises).then(onRemoveSuccess, onRemoveFailure);
				} else {
					$scope.invokeApi(RVCompanyCardSrv.removeCard, {
						'reservation': typeof $stateParams.id === "undefined" ? $scope.reservationData.reservationId : $stateParams.id,
						'cardType': card,
						'cardId': cardId
					}, onRemoveSuccess, onRemoveFailure);
				}

			} else {
				//Bring up alert here
				if ($scope.viewState.pendingRemoval.status) {
					$scope.viewState.pendingRemoval.status = false;
					$scope.viewState.pendingRemoval.cardType = "";
					// If user has not replaced a new card, keep this one. Else remove this card
					// The below flag tracks the card and has to be reset once a new card has been linked,
					// along with a call to remove the flagged card
					$scope.viewState.lastCardSlot = card;
					var templateUrl = '/assets/partials/cards/alerts/cardRemoval.html';
					ngDialog.open({
						template: templateUrl,
						className: 'ngdialog-theme-default stay-card-alerts',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false
					});
				}
			}
		};

		$scope.noRoutingToReservation = function() {
			ngDialog.close();
			that.reloadStaycard();

		};

		$scope.applyRoutingToReservation = function() {
			var routingApplySuccess = function(data) {
				$scope.$emit("hideLoader");
				ngDialog.close();
				that.reloadStaycard();
				$scope.$broadcast('paymentTypeUpdated'); // to update bill screen data
			};

			var params = {};
			params.account_id = $scope.contractRoutingType === 'TRAVEL_AGENT' ? $scope.reservationData.travelAgent.id : $scope.reservationData.company.id;
			params.reservation_ids = [];
			params.reservation_ids.push($scope.reservationData.reservationId);

			$scope.invokeApi(RVReservationSummarySrv.applyDefaultRoutingToReservation, params, routingApplySuccess);
		};

		$scope.okClickedForConflictingRoutes = function() {
			ngDialog.close();
			that.reloadStaycard();

		};

		this.showConfirmRoutingPopup = function(type, id) {
			ngDialog.open({
				template: '/assets/partials/reservation/alerts/rvBillingInfoConfirmPopup.html',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		};

		this.showConflictingRoutingPopup = function(type, id) {

			ngDialog.open({
				template: '/assets/partials/reservation/alerts/rvBillingInfoConflictingPopup.html',
				className: 'ngdialog-theme-default',
				scope: $scope
			});

		};

		this.attachCompanyTACardRoutings = function(card) {

			var fetchSuccessofDefaultRouting = function(data) {
				$scope.$emit("hideLoader");
				$scope.routingInfo = data;
				if (data.has_conflicting_routes) {
					$scope.conflict_cards = [];
					if (card === 'travel_agent' && data.travel_agent.routings_count > 0) {
						$scope.conflict_cards.push($scope.reservationData.travelAgent.name);
					}
					if (card === 'company' && data.company.routings_count > 0) {
						$scope.conflict_cards.push($scope.reservationData.company.name);
					}
					that.showConflictingRoutingPopup();
					return false;
				}

				if (card === 'travel_agent' && data.travel_agent.routings_count > 0) {
					$scope.contractRoutingType = "TRAVEL_AGENT";
					that.showConfirmRoutingPopup($scope.contractRoutingType, $scope.reservationData.travelAgent.id);
					return false;

				}
				if (card === 'company' && data.company.routings_count > 0) {
					$scope.contractRoutingType = "COMPANY";
					that.showConfirmRoutingPopup($scope.contractRoutingType, $scope.reservationData.company.id);
					return false;
				} else {
					that.reloadStaycard();
				}

			};

			var params = {};
			params.reservation_id = $scope.reservationData.reservationId;

			if (card === 'travel_agent') {
				params.travel_agent_id = $scope.reservationData.travelAgent.id;
			} else if (card === 'company') {
				params.company_id = $scope.reservationData.company.id;
			}

			$scope.invokeApi(RVReservationSummarySrv.fetchDefaultRoutingInfo, params, fetchSuccessofDefaultRouting);
		};

		$scope.replaceCard = function(card, cardData, future) {
			if (card === 'company') {
				$scope.reservationData.company.id = cardData.id;
				$scope.reservationData.company.name = cardData.account_name;
			} else if (card === 'travel_agent') {
				$scope.reservationData.travelAgent.id = cardData.id;
				$scope.reservationData.travelAgent.name = cardData.account_name;
			}

			var onReplaceSuccess = function() {
					$scope.cardRemoved(card);
					$scope.cardReplaced(card, cardData);
					if ($scope.viewState.lastCardSlot !== "") {
						$scope.removeCard($scope.viewState.lastCardSlot);
						$scope.viewState.lastCardSlot = "";
					}
					$scope.$emit('hideLoader');
					that.attachCompanyTACardRoutings(card);
				},
				onReplaceFailure = function() {
					$scope.cardRemoved();
					$scope.$emit('hideLoader');
				},
				onEachReplaceSuccess = function() {
					//TODO: Handle each success call here
				};

			if ($scope.reservationData && $scope.reservationData.reservationIds && $scope.reservationData.reservationIds.length > 1) {
				var promises = []; // Use this array to push the promises returned for every call
				$scope.$emit('showLoader');
				// Loop through the reservation ids and call the cancel API for each of them
				_.each($scope.reservationData.reservationIds, function(reservationId) {
					promises.push(RVCompanyCardSrv.replaceCard({
						'reservation': reservationId,
						'cardType': card,
						'id': cardData.id,
						'future': typeof future === 'undefined' ? false : future
					}).then(onEachReplaceSuccess));
				});
				$q.all(promises).then(onReplaceSuccess, onReplaceFailure);
			} else {
				//Replace card with the selected one
				$scope.invokeApi(RVCompanyCardSrv.replaceCard, {
					'reservation': typeof $stateParams.id === "undefined" ? $scope.reservationData.reservationId : $stateParams.id,
					'cardType': card,
					'id': cardData.id,
					'future': typeof future === 'undefined' ? false : future
				}, onReplaceSuccess, onReplaceFailure);
			}
		};

		/**
		 * 	Reload the stay card if any of the attached cards are changed! >>> 7078 / 7370
		 * 	the state would be STAY_CARD in the reservation edit mode also.. hence checking for confirmation id in the state params
		 * 	The confirmationId will not be in the reservation edit/create stateParams except for the confirmation screen...
		 * 	However, in the confirmation screen the identifier would be "CONFIRM"
		 */
		this.reloadStaycard = function() {
			if ($scope.viewState.identifier === "STAY_CARD" && typeof $stateParams.confirmationId !== "undefined") {
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": typeof $stateParams.id === "undefined" ? $scope.reservationData.reservationId : $stateParams.id,
					"confirmationId": $stateParams.confirmationId,
					"isrefresh": false
				});
			}
		};

		$scope.cardRemoved = function(card) {
			//reset Pending Flag
			$scope.viewState.pendingRemoval.status = false;
			$scope.viewState.pendingRemoval.cardType = "";
			// reset the id and the future reservation counts that were cached
			if (card === 'guest') {
				$scope.reservationDetails.guestCard.id = "";
				$scope.reservationDetails.guestCard.futureReservations = 0;
				var contactInfoData = {
					'contactInfo': {},
					'countries': $scope.countries,
					'userId': "",
					'avatar': "",
					'guestId': "",
					'vip': "" //TODO: check with API or the product team
				};

				$scope.guestCardData.contactInfo = contactInfoData.contactInfo;
				$scope.guestCardData.contactInfo.avatar = contactInfoData.avatar;
				$scope.guestCardData.contactInfo.vip = contactInfoData.vip;
				$scope.countriesList = contactInfoData.countries;
				$scope.guestCardData.userId = contactInfoData.userId;
				$scope.guestCardData.guestId = contactInfoData.guestId;
				$scope.guestCardData.contactInfo.birthday = null;
			}
			if (card === 'company') {
				$scope.reservationData.company.id = "";
				$scope.reservationDetails.companyCard.id = "";
				$scope.reservationDetails.companyCard.futureReservations = 0;
			} else if (card === 'travel_agent') {
				$scope.reservationData.travelAgent.id = "";
				$scope.reservationDetails.travelAgent.id = "";
				$scope.reservationDetails.travelAgent.futureReservations = 0;
			}


		};

		$scope.cardReplaced = function(card, cardData) {
			if (card === 'company') {
				$scope.reservationDetails.companyCard.id = cardData.id;
				$scope.initCompanyCard();
				//clean search data
				$scope.searchData.companyCard.companyName = "";
				$scope.searchData.companyCard.companyCity = "";
				$scope.searchData.companyCard.companyCorpId = "";
				$scope.showContractedRates({
					companyCard: cardData.id,
					travelAgent: $scope.reservationDetails.travelAgent.id
				});
				$scope.$broadcast('companySearchStopped');
			} else if (card === 'travel_agent') {
				$scope.reservationDetails.travelAgent.id = cardData.id;
				$scope.initTravelAgentCard();
				// clean search data
				$scope.searchData.travelAgentCard.travelAgentName = "";
				$scope.searchData.travelAgentCard.travelAgentCity = "";
				$scope.searchData.travelAgentCard.travelAgentIATA = "";
				$scope.showContractedRates({
					companyCard: $scope.reservationData.company.id,
					travelAgent: cardData.id
				});
				$scope.$broadcast('travelAgentSearchStopped');
			} else if (card === 'guest') {
				$scope.reservationDetails.guestCard.id = cardData.id;
				$scope.initGuestCard(cardData);
				$scope.searchData.guestCard.guestFirstName = "";
				$scope.searchData.guestCard.guestLastName = "";
				$scope.searchData.guestCard.guestCity = "";
				$scope.searchData.guestCard.guestLoyaltyNumber = "";
				$scope.searchData.guestCard.email = "";

				$scope.$broadcast('guestSearchStopped');
			}
		};

		$scope.showGuestPaymentList = function(guestInfo) {
			var userId = guestInfo.user_id,
				guestId = guestInfo.guest_id;
			var paymentSuccess = function(paymentData) {
				$scope.$emit('hideLoader');

				var paymentData = {
					"data": paymentData,
					"user_id": userId,
					"guest_id": guestId
				};
				$scope.$emit('GUESTPAYMENTDATA', paymentData);
				$scope.$emit('SHOWGUESTLIKES');
			};

			$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, userId, paymentSuccess, '', 'NONE');
		};

		$scope.showContractedRates = function(cardIds) {
			// 	CICO-7792 BEGIN
			/*
			 *	When a Travel Agent or Company card has been attached to the reservation during the reservation process,
			 *	the rate / room display should include the rate of the Company / Travel Agent contract if one exists.
			 *	Have to make a call to the availability API with the card added as a request param
			 */
			$scope.$broadcast('cardChanged', cardIds);
			// 	CICO-7792 END
		};


		var ratesFetched = function(data, saveReservation) {
			var save = function() {
				if ($scope.reservationData.guest.id || $scope.reservationData.company.id || $scope.reservationData.travelAgent.id) {
					$scope.saveReservation();
				} else {
					$scope.$emit('PROMPTCARD');
				}
			};

			$scope.otherData.taxesMeta = data.tax_codes;
			$scope.otherData.hourlyTaxInfo = data.tax_information;
			RVReservationStateService.metaData.taxDetails = angular.copy(data.tax_codes);
			$scope.reservationData.totalTax = 0;
			$scope.computeHourlyTotalandTaxes();
			if (saveReservation) {
				if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id) {
					$scope.$emit('PROMPTCARD');
					$scope.$watch("reservationData.guest.id", save);
					$scope.$watch("reservationData.company.id", save);
					$scope.$watch("reservationData.travelAgent.id", save);
				} else {
					$scope.saveReservation();
				}
			}

			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 500);
		};

		$scope.populateDatafromDiary = function(roomsArray, tData, saveReservation) {
			var roomTypes = [];
			this.rooms = [];

			angular.forEach(tData.rooms, function(value) {
				value['roomTypeId'] = parseInt(roomsArray[value.room_id].room_type_id, 10);
				value['roomTypeName'] = roomsArray[value.room_id].room_type_name;
				value['roomNumber'] = roomsArray[value.room_id].room_no;
				roomTypes.push(parseInt(value.roomTypeId, 10))
			});
			roomTypes = _.uniq(roomTypes);
			$scope.reservationData.tabs = RVReservationDataService.getTabDataModel(roomTypes.length, roomTypes);
			$scope.reservationData.rooms = []
			_.each($scope.reservationData.tabs, function(tab) {
				var roomsOfType = _.filter(tData.rooms, function(room) {
					return parseInt(room.roomTypeId, 10) === parseInt(tab.roomTypeId, 10)
				});
				tab.roomCount = roomsOfType.length;
				$scope.reservationData.rooms = $scope.reservationData.rooms.concat(roomsOfType);
			});

			$scope.reservationData.arrivalDate = dateFilter(new tzIndependentDate(tData.arrival_date), 'yyyy-MM-dd');
			$scope.reservationData.departureDate = dateFilter(new tzIndependentDate(tData.departure_date), 'yyyy-MM-dd');
			var arrivalTimeSplit = tData.arrival_time.split(":");

			$scope.reservationData.checkinTime.hh = arrivalTimeSplit[0];
			$scope.reservationData.checkinTime.mm = arrivalTimeSplit[1].split(" ")[0];
			if ($scope.reservationData.checkinTime.mm.length === 1) {
				$scope.reservationData.checkinTime.mm = "0" + $scope.reservationData.checkinTime.mm;
			}
			$scope.reservationData.checkinTime.ampm = arrivalTimeSplit[1].split(" ")[1];
			if (!($scope.reservationData.checkinTime.ampm === "AM" || $scope.reservationData.checkinTime.ampm === "PM")) {
				if (parseInt($scope.reservationData.checkinTime.hh) >= 12) {
					$scope.reservationData.checkinTime.hh = Math.abs(parseInt($scope.reservationData.checkinTime.hh) - 12) + "";
					$scope.reservationData.checkinTime.ampm = "PM";
				} else {
					$scope.reservationData.checkinTime.ampm = "AM";
				}
			}
			if (Math.abs(parseInt($scope.reservationData.checkinTime.hh) - 12) === 0 || $scope.reservationData.checkinTime.hh === "00" || $scope.reservationData.checkinTime.hh === "0") {
				$scope.reservationData.checkinTime.hh = "12";
			}
			if ($scope.reservationData.checkinTime.hh.length === 1) {
				$scope.reservationData.checkinTime.hh = "0" + $scope.reservationData.checkinTime.hh;
			}

			var departureTimeSplit = tData.departure_time.split(":");
			$scope.reservationData.checkoutTime.hh = departureTimeSplit[0];
			$scope.reservationData.checkoutTime.mm = departureTimeSplit[1].split(" ")[0];

			if ($scope.reservationData.checkoutTime.mm.length === 1) {
				$scope.reservationData.checkoutTime.mm = "0" + $scope.reservationData.checkoutTime.mm;
			}
			$scope.reservationData.checkoutTime.ampm = departureTimeSplit[1].split(" ")[1];

			if (!($scope.reservationData.checkoutTime.ampm === "AM" || $scope.reservationData.checkoutTime.ampm === "PM")) {
				if (parseInt($scope.reservationData.checkoutTime.hh) >= 12) {
					$scope.reservationData.checkoutTime.hh = Math.abs(parseInt($scope.reservationData.checkoutTime.hh) - 12) + "";
					$scope.reservationData.checkoutTime.ampm = "PM";
				} else {
					$scope.reservationData.checkoutTime.ampm = "AM";
				}
			}
			if (Math.abs(parseInt($scope.reservationData.checkoutTime.hh) - 12) === "0" || $scope.reservationData.checkoutTime.hh === "00" || $scope.reservationData.checkoutTime.hh === "0") {
				$scope.reservationData.checkoutTime.hh = "12";
			}
			if ($scope.reservationData.checkoutTime.hh.length === 1) {
				$scope.reservationData.checkoutTime.hh = "0" + $scope.reservationData.checkoutTime.hh;
			}
			var hResData = tData.rooms[0];

			this.reservationId = hResData.reservation_id;
			this.confirmNum = hResData.confirmation_id;


			if (this.reservationId) {
				$scope.viewState.identifier = "CONFIRM";
			} else {
				$scope.viewState.identifier = "CREATION";
				$scope.viewState.reservationStatus.confirm = false;
			}

			$scope.reservationDetails.guestCard = {};
			$scope.reservationDetails.guestCard.id = hResData.guest_card_id;
			$scope.reservationDetails.travelAgent = {};
			$scope.reservationDetails.travelAgent.id = hResData.travel_agent_id;
			$scope.reservationDetails.companyCard = {};
			$scope.reservationDetails.companyCard.id = hResData.company_card_id;


			$scope.reservationData.guest = {};
			$scope.reservationData.guest.id = hResData.guest_card_id;
			$scope.reservationData.travelAgent = {};
			$scope.reservationData.travelAgent.id = hResData.travel_agent_id;
			$scope.reservationData.company = {};
			$scope.reservationData.company.id = hResData.company_card_id;

			if (!!$scope.reservationData.guest.id) {
				$scope.initGuestCard();
			}
			if (!!$scope.reservationData.company.id) {
				$scope.initCompanyCard();
			}
			if (!!$scope.reservationData.travelAgent.id) {
				$scope.initTravelAgentCard();
			}

			this.totalStayCost = 0;
			var rateIdSet = [];
			var self = this;
			angular.forEach($scope.reservationData.rooms, function(room) {
				var refData = _.findWhere(tData.rooms, {room_no : room.room_no});
				room.stayDates = {};
				rateIdSet.push(refData.rateId);
				room.numAdults = refData.numAdults;
				room.numChildren = refData.numChildren;
				room.numInfants = refData.numInfants;
				room.roomTypeId = refData.roomTypeId;
				room.amount = refData.amount;
				room.room_id = refData.room_id;
				room.room_no = refData.room_no;
				room.room_type = refData.room_type;

				room.rateId = refData.rateId;
				room.roomAmount = refData.amount;
				// CICO-16850
				//  In case of updating a reservation from Diary
				// the reservation's already attached demographics
				// information must be preserved.

				//CICO-16927 - added undefined check for demographics
				room.demographics = {
					market: (typeof refData.demographics === "undefined" || !refData.demographics.market_segment_id) ? '' : refData.demographics.market_segment_id,
					source: (typeof refData.demographics === "undefined" || !refData.demographics.source_id) ? '' : refData.demographics.source_id,
					reservationType: (typeof refData.demographics === "undefined" || !refData.demographics.reservation_type_id) ? '' : refData.demographics.reservation_type_id,
					origin: (typeof refData.demographics === "undefined" || !refData.demographics.booking_origin_id) ? '' : refData.demographics.booking_origin_id,
					segment: (typeof refData.segment === "undefined" || !refData.demographics.segment_id) ? '' : refData.demographics.segment_id
				};

				// put the same stuff in the reservationData obj as well
				//
				self.demographics = angular.copy(room.demographics);

				self.totalStayCost = parseFloat(self.totalStayCost) + parseFloat(refData.amount);
				var success = function(data) {
					room.rateName = data.name;
					//CICO-16850
					//Default to market and source of Rate IFF there is nothing associated with the reservation yet
					//This checkt will Save reservations state while editing
					if (!$scope.reservationData.demographics.market) {
						$scope.reservationData.demographics.market = !data.market_segment_id ? '' : data.market_segment_id;
					}
					if (!$scope.reservationData.demographics.source) {
						$scope.reservationData.demographics.source = !data.source_id ? '' : data.source_id;
					}

					angular.forEach($scope.reservationData.rooms, function(room, index) {
						if (!room.demographics.market) {
							room.demographics.market = !data.market_segment_id ? '' : data.market_segment_id;
						}
						if (!room.demographics.source) {
							room.demographics.source = !data.source_id ? '' : data.source_id;
						}

					});

					if (data.deposit_policy_id) {
						$scope.reservationData.depositData = {};
						$scope.reservationData.depositData.isDepositRequired = true;
						$scope.reservationData.depositData.description = data.deposit_policy.description;
						$scope.reservationData.depositData.depositSuccess = !$scope.reservationData.depositData.isDepositRequired;
						$scope.reservationData.depositData.attempted = false;
						$scope.reservationData.depositData.depositAttemptFailure = false;
						$scope.$broadcast("UPDATEDEPOSIT");
					}
				};
				var roomAmount = parseFloat(room.roomAmount).toFixed(2);
				$scope.invokeApi(RVReservationSummarySrv.getRateDetails, {
					id: room.rateId
				}, success);
				for (var ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {

					room.stayDates[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')] = {
						guests: {
							adults: room.numAdults,
							children: room.numChildren,
							infants: room.numInfants
						},
						rate: {
							id: room.rateId
						},
						rateDetails: {
							actual_amount: roomAmount,
							modified_amount: roomAmount,
							is_discount_allowed: 'true'
						}
					};
				}
			});

			$scope.invokeApi(RVReservationSummarySrv.getTaxDetails, {
				rate_ids: rateIdSet
			}, ratesFetched);
		}.bind($scope.reservationData);

		// CICO-11991 : Handle ARRIVALS button click.
		$scope.loadPrevState = function() {
			$rootScope.loadPrevState();
			$rootScope.$broadcast("OUTSIDECLICKED");
		};

		$scope.staycardClicked = function() {
			//save contact info
			$scope.$broadcast('saveContactInfo');
		};

	}
]);