sntRover.controller('stayCardMainCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'RVReservationCardSrv', 'RVGuestCardSrv', 'ngDialog', '$state',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, RVReservationCardSrv, RVGuestCardSrv, ngDialog, $state) {
		BaseCtrl.call(this, $scope);
		//Switch to Enable the new cards addition funcitonality
		$scope.addNewCards = true;
		$scope.cardHeaderImage = '/assets/avatar-trans.png';
		$scope.pendingRemoval = {
			status: false,
			cardType: ""
		};

		$scope.cardSaved = function() {
			$scope.viewState.isAddNewCard = false;
		}

		var successCallbackOfCountryListFetch = function(data) {
			$scope.countries = data;
		};

		//fetching country list
		$scope.invokeApi(RVCompanyCardSrv.fetchCountryList, {}, successCallbackOfCountryListFetch);


		$scope.initGuestCard = function(guestData) {
			// passReservationParams
			//TODO : Once this works pull it to a separate method 
			var fetchGuestcardDataSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				// No more future reservations returned with this API call
				// $scope.reservationDetails.guestCard.futureReservations = data.future_reservation_count;
				var contactInfoData = {
					'contactInfo': data,
					'countries': $scope.countries,
					'userId': $scope.reservationDetails.guestCard.id,
					'avatar': (guestData && guestData.image) || $scope.cardHeaderImage,
					'guestId': null,
					'vip': false //TODO: check with API or the product team
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
				$scope.guestCardData.contactInfo.user_id = contactInfoData.userId;
				$scope.reservationData.guest.email = data.email;
				$scope.$broadcast('guestSearchStopped');
				$scope.$broadcast('guestCardAvailable');
				$scope.showGuestPaymentList(guestInfo);
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
				$scope.$broadcast("SHOWGUESTLIKESINFO");
			};

			var fetchGuestcardDataFailureCallback = function(data) {
				$scope.$emit('hideLoader');
			};

			console.log($scope.reservationDetails.guestCard);

			if ($scope.reservationDetails.guestCard.id != '' && $scope.reservationDetails.guestCard.id != null) {
				var param = {
					'id': $scope.reservationDetails.guestCard.id
				};
				$scope.invokeApi(RVReservationCardSrv.getGuestDetails, param, fetchGuestcardDataSuccessCallback, fetchGuestcardDataFailureCallback, 'NONE');
			}
		}

		// fetch reservation company card details 
		$scope.initCompanyCard = function() {
			var companyCardFound = function(data) {
				$scope.$emit("hideLoader");
				data.id = $scope.reservationDetails.companyCard.id;
				$scope.companyContactInformation = data;
				// No more future reservations returned with this API call
				// $scope.reservationDetails.companyCard.futureReservations = data.future_reservation_count;
				$scope.$broadcast('companyCardAvailable');
				console.log($scope.reservationDetails);
			};
			//	companycard defaults to search mode 
			// 	Hence, do API call only if a company card ID is returned
			if ($scope.reservationDetails.companyCard.id != '' && $scope.reservationDetails.companyCard.id != null) {
				var param = {
					'id': $scope.reservationDetails.companyCard.id
				};
				$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, param, companyCardFound);
			}
		}

		// fetch reservation travel agent card details
		$scope.initTravelAgentCard = function() {
			var successCallbackOfInitialFetch = function(data) {
				$scope.$emit("hideLoader");
				data.id = $scope.reservationDetails.travelAgent.id;
				$scope.travelAgentInformation = data;
				// No more future reservations returned with this API call
				// $scope.reservationDetails.travelAgent.futureReservations = data.future_reservation_count;
				$scope.$broadcast('travelAgentFetchComplete');

			};
			//	TAcard defaults to search mode 
			// 	Hence, do API call only if a company card ID is returned
			if ($scope.reservationDetails.travelAgent.id != '' && $scope.reservationDetails.travelAgent.id != null) {
				var param = {
					'id': $scope.reservationDetails.travelAgent.id
				};
				$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, param, successCallbackOfInitialFetch);
			}
		}


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

			// The future counts of the cards attached with the reservation
			// will be received here!
			// This code should be HIT everytime there is a removal or a replacement of
			// any of the cards attached! 
			//if cards are not attached future reservation values are coming in as null
			var futureCounts = $scope.reservationListData.future_reservation_counts;


			$scope.reservationDetails.guestCard.futureReservations = futureCounts.guest == null ? 0 : futureCounts.guest;
			$scope.reservationDetails.companyCard.futureReservations = futureCounts.company == null ? 0 : futureCounts.company;
			$scope.reservationDetails.travelAgent.futureReservations = futureCounts.travel_agent == null ? 0 : futureCounts.travel_agent;

			// TODO: Remove the following commented out code!
			// Leaving it now for further debugging if required
			// console.log("FUTURE_COUNTER", {
			// 	G: $scope.reservationDetails.guestCard.futureReservations,
			// 	C: $scope.reservationDetails.companyCard.futureReservations,
			// 	T: $scope.reservationDetails.travelAgent.futureReservations,
			// });

		});

		$scope.removeCard = function(card, future) {
			// This method returns the numnber of cards attached to the staycard
			var checkNumber = function() {
				var x = 0;
				_.each($scope.reservationDetails, function(d, i) {
					if (typeof d.id != 'undefined' && d.id != '' && d.id != null) x++;
				})
				return x;
			}

			//Cannot Remove the last card... Tell user not to select another card
			if (checkNumber() > 1 && card != "") {
				$scope.invokeApi(RVCompanyCardSrv.removeCard, {
					'reservation': $stateParams.id,
					'cardType': card
				}, function() {
					console.log('removeCard - success');
					$scope.cardRemoved(card);
					$scope.$emit('hideLoader');
					if ($scope.viewState.identifier == "STAY_CARD") {
						$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
							"id": $stateParams.id,
							"confirmationId": $stateParams.confirmationId,
							"isrefresh": false
						});
					}
				}, function() {
					console.log('removeCard - failure');
					$scope.$emit('hideLoader');
				});
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
		}

		$scope.replaceCard = function(card, cardData, future) {
			//Replace card with the selected one
			$scope.invokeApi(RVCompanyCardSrv.replaceCard, {
				'reservation': $stateParams.id,
				'cardType': card,
				'id': cardData.id,
				'future': typeof future == 'undefined' ? false : future
			}, function() {
				console.log('replaceCard - success');
				$scope.cardRemoved(card);
				$scope.cardReplaced(card, cardData);
				if ($scope.viewState.lastCardSlot != "") {
					$scope.removeCard($scope.viewState.lastCardSlot);
					$scope.viewState.lastCardSlot = "";
				}
				if ($scope.viewState.identifier == "STAY_CARD") {
					$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
						"id": $stateParams.id,
						"confirmationId": $stateParams.confirmationId,
						"isrefresh": false
					});
				}
				$scope.$emit('hideLoader');
			}, function() {
				console.log('replaceCard -failure');
				$scope.cardRemoved();
				$scope.$emit('hideLoader');
			});
		}

		$scope.cardRemoved = function(card) {
			//reset Pending Flag
			$scope.viewState.pendingRemoval.status = false;
			$scope.viewState.pendingRemoval.cardType = "";
			// reset the id and the future reservation counts that were cached
			if (card == 'guest') {
				$scope.reservationDetails.guestCard.id = "";
				// console.log('future reservation count is reset');
				$scope.reservationDetails.guestCard.futureReservations = 0;
				var contactInfoData = {
					'contactInfo': {},
					'countries': $scope.countries,
					'userId': "",
					'avatar': "",
					'guestId': "",
					'vip': "" //TODO: check with API or the product team
				};
				// // $scope.$emit('guestCardUpdateData', contactInfoData);
				$scope.guestCardData.contactInfo = contactInfoData.contactInfo;
				$scope.guestCardData.contactInfo.avatar = contactInfoData.avatar;
				$scope.guestCardData.contactInfo.vip = contactInfoData.vip;
				$scope.countriesList = contactInfoData.countries;
				$scope.guestCardData.userId = contactInfoData.userId;
				$scope.guestCardData.guestId = contactInfoData.guestId;
				$scope.guestCardData.contactInfo.birthday = null;
			}
			if (card == 'company') {
				$scope.reservationDetails.companyCard.id = "";
				$scope.reservationDetails.companyCard.futureReservations = 0;
			} else if (card == 'travel_agent') {
				$scope.reservationDetails.travelAgent.id = "";
				$scope.reservationDetails.travelAgent.futureReservations = 0;
			}


		}

		$scope.cardReplaced = function(card, cardData) {
			if (card == 'company') {
				$scope.reservationDetails.companyCard.id = cardData.id;
				$scope.initCompanyCard();
				//clean search data
				$scope.searchData.companyCard.companyName = "";
				$scope.searchData.companyCard.companyCity = "";
				$scope.searchData.companyCard.companyCorpId = "";
				$scope.$broadcast('companySearchStopped');
			} else if (card == 'travel_agent') {
				$scope.reservationDetails.travelAgent.id = cardData.id;
				$scope.initTravelAgentCard();
				// clean search data
				$scope.searchData.travelAgentCard.travelAgentName = "";
				$scope.searchData.travelAgentCard.travelAgentCity = "";
				$scope.searchData.travelAgentCard.travelAgentIATA = "";
				$scope.$broadcast('travelAgentSearchStopped');
			} else if (card == 'guest') {
				$scope.reservationDetails.guestCard.id = cardData.id;
				$scope.initGuestCard(cardData);
				$scope.searchData.guestCard.guestFirstName = "";
				$scope.searchData.guestCard.guestLastName = "";
				$scope.searchData.guestCard.guestCity = "";
				$scope.searchData.guestCard.guestLoyaltyNumber = "";
				$scope.$broadcast('guestSearchStopped');
			}
		}

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

		$scope.getEmptyAccountData = function() {
			return {
				"address_details": {
					"street1": null,
					"street2": null,
					"street3": null,
					"city": null,
					"state": null,
					"postal_code": null,
					"country_id": null,
					"email_address": null,
					"phone": null
				},
				"account_details": {
					"account_name": null,
					"company_logo": "",
					"account_number": null,
					"accounts_receivable_number": null,
					"billing_information": "Test"
				},
				"primary_contact_details": {
					"contact_first_name": null,
					"contact_last_name": null,
					"contact_job_title": null,
					"contact_phone": null,
					"contact_email": null
				},
				"future_reservation_count": 0
			}
		}

	}
]);