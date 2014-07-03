sntRover.controller('stayCardMainCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', 'RVReservationCardSrv', 'RVGuestCardSrv', 'ngDialog',
	function($scope, RVCompanyCardSrv, $stateParams, RVReservationCardSrv, RVGuestCardSrv, ngDialog) {

		$scope.addNewCards = true;
		$scope.cardHeaderImage = '/assets/avatar-trans.png';

		$scope.pendingRemoval = {
			status: false,
			cardType: ""
		};

		$scope.viewState = {
			isAddNewCard: false,
			pendingRemoval: {
				status: false,
				cardType: ""
			},
			identifier:"STAY_CARD"
		};

		$scope.cardSaved = function() {
			$scope.viewState.isAddNewCard = false;
		}


		BaseCtrl.call(this, $scope);
		$scope.searchData = {
			guestCard: {
				guestFirstName: "",
				guestLastName: "",
				guestCity: "",
				guestLoyaltyNumber: ""
			},
			companyCard: {
				companyName: "",
				companyCity: "",
				companyCorpId: ""
			},
			travelAgentCard: {
				travelAgentName: "",
				travelAgentCity: "",
				travelAgentIATA: ""
			}
		}

		$scope.reservationListData = {};

		$scope.reservationDetails = {
			guestCard: {
				id: "",
				futureReservations: 0
			},
			companyCard: {
				id: "",
				futureReservations: 0
			},
			travelAgent: {
				id: "",
				futureReservations: 0
			}
		};

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
				$scope.reservationDetails.guestCard.futureReservations = data.future_reservation_count;
				var contactInfoData = {
					'contactInfo': data,
					'countries': $scope.countries,
					'userId': $scope.reservationDetails.guestCard.id,
					'avatar': (guestData && guestData.image) || $scope.cardHeaderImage,
					'guestId': null,
					'vip': false //TODO: check with API or the product team
				};
				// // $scope.$emit('guestCardUpdateData', contactInfoData);
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
				$scope.current = 'guest-contact';
				$scope.$broadcast("SHOWGUESTLIKESINFO");
			};

			var fetchGuestcardDataFailureCallback = function(data) {
				$scope.$emit('hideLoader');
			};

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
				console.log(data);
				$scope.$emit("hideLoader");
				data.id = $scope.reservationDetails.companyCard.id;
				$scope.companyContactInformation = data;
				$scope.reservationDetails.companyCard.futureReservations = data.future_reservation_count;
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
				$scope.reservationDetails.travelAgent.futureReservations = data.future_reservation_count;
				$scope.$broadcast('travelAgentFetchComplete');
				console.log($scope.reservationDetails);

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

		$scope.$on('cardIdsFetched', function() {
			console.log('init of guest-controller', {
				guest: $scope.reservationDetails.guestCard.id,
				company: $scope.reservationDetails.companyCard.id,
				travelagent: $scope.reservationDetails.travelAgent.id,
				reservationListData: $scope.reservationListData
			});

			$scope.initGuestCard();
			$scope.initCompanyCard();
			$scope.initTravelAgentCard();
			// if ($scope.reservationDetails.guestCard.id != "" && $scope.reservationDetails.guestCard.id != null) {
			// 	$scope.$broadcast('guestCardAvailable');
			// 	$scope.$emit('guestCardAvailable');
			// }
		});

		$scope.removeCard = function(card) {
			// Remove card
			var checkNumber = function() {
				var x = 0;
				_.each($scope.reservationDetails, function(d, i) {
					if (typeof d.id != 'undefined' && d.id != '' && d.id != null) x++;
				})
				return x;
			}

			//Cannot Remove the last card... Tell user not to select another card
			if (checkNumber() > 1) {
				$scope.invokeApi(RVCompanyCardSrv.removeCard, {
					'reservation': $stateParams.id,
					'cardType': card
				}, function() {
					console.log('removeCard - success');
					$scope.cardRemoved(card);
					$scope.$emit('hideLoader');
				}, function() {
					console.log('removeCard - failure');
					$scope.$emit('hideLoader');
				});
			} else {
				//Bring up alert here
				console.log("Attempt to delete last card");
				if ($scope.viewState.pendingRemoval.status) {
					$scope.viewState.pendingRemoval.status = false;
					$scope.viewState.pendingRemoval.cardType = "";
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