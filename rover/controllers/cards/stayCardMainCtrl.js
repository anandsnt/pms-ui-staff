sntRover.controller('stayCardMainCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', 'RVReservationCardSrv',
	function($scope, RVCompanyCardSrv, $stateParams, RVReservationCardSrv) {

		$scope.addNewCards = false;

		$scope.pendingRemoval = {
			status: false,
			cardType: ""
		};

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


		$scope.initGuestCard = function() {
			// passReservationParams
			//TODO : Once this works pull it to a separate method 
			var fetchGuestcardDataSuccessCallback = function(data) {
				var contactInfoData = {
					'contactInfo': data,
					'countries': $scope.countries,
					'userId': data.user_id,
					'avatar': $scope.reservationListData.avatar,
					'guestId': data.guest_id,
					'vip': $scope.reservationListData.vip
				};
				// $scope.$emit('guestCardUpdateData', contactInfoData);
				$scope.guestCardData.contactInfo = contactInfoData.contactInfo;
				$scope.guestCardData.contactInfo.avatar = contactInfoData.avatar;
				$scope.guestCardData.contactInfo.vip = contactInfoData.vip;
				$scope.countriesList = contactInfoData.countries;
				$scope.guestCardData.userId = contactInfoData.userId;
				$scope.guestCardData.guestId = contactInfoData.guestId;
				var guestInfo = {
					"user_id": contactInfoData.user_id,
					"guest_id": contactInfoData.guest_id
				};
				$scope.searchData.guestCard.guestFirstName = "";
				$scope.searchData.guestCard.guestLastName = "";
				$scope.searchData.guestCard.guestCity = "";
				$scope.searchData.guestCard.guestLoyaltyNumber = "";
				$scope.$broadcast('guestSearchStopped');
				$scope.$broadcast('guestCardAvailable');
				// $scope.showGuestPaymentList(guestInfo);
			};
			var fetchGuestcardDataFailureCallback = function(data) {
				$scope.$emit('hideLoader');
			};

			var param = {
				'fakeDataToAvoidCache': new Date(),
				'id': $scope.reservationListData.guest_details.reservation_id
			};
			$scope.invokeApi(RVReservationCardSrv.fetchGuestcardData, param, fetchGuestcardDataSuccessCallback, fetchGuestcardDataFailureCallback, 'NONE');
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

			$scope.initCompanyCard();
			$scope.initTravelAgentCard();
			if ($scope.reservationDetails.guestCard.id != "" && $scope.reservationDetails.guestCard.id != null) {
				$scope.$broadcast('guestCardAvailable');
				$scope.$emit('guestCardAvailable');
			}
		});

		$scope.removeCard = function(card) {
			// TODO: Remove card
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
		}

		$scope.replaceCard = function(card, id, future) {
			//Replace card with the selected one
			$scope.invokeApi(RVCompanyCardSrv.replaceCard, {
				'reservation': $stateParams.id,
				'cardType': card,
				'id': id,
				'future': typeof future == 'undefined' ? false : future
			}, function() {
				console.log('replaceCard - success');
				$scope.cardRemoved();
				$scope.cardReplaced(card, id);
				$scope.$emit('hideLoader');
			}, function() {
				console.log('replaceCard -failure');
				$scope.cardRemoved();
				$scope.$emit('hideLoader');
			});
		}

		$scope.cardRemoved = function(card) {
			//reset Pending Flag
			$scope.pendingRemoval = {
				status: false,
				cardType: ""
			};
			//reset the id and the future reservation counts that were cached
			if (card == 'company') {
				$scope.reservationDetails.companyCard.id = "";
				$scope.reservationDetails.companyCard.futureReservations = 0;
			} else if (card == 'travel_agent') {
				$scope.reservationDetails.companyCard.id = "";
				$scope.reservationDetails.travelAgent.futureReservations = 0;
			}
		}

		$scope.cardReplaced = function(card, id) {
			if (card == 'company') {
				$scope.reservationDetails.companyCard.id = id;
				$scope.initCompanyCard();
				//clean search data
				$scope.searchData.companyCard.companyName = "";
				$scope.searchData.companyCard.companyCity = "";
				$scope.searchData.companyCard.companyCorpId = "";
				$scope.$broadcast('companySearchStopped');
			} else if (card == 'travel_agent') {
				$scope.reservationDetails.travelAgent.id = id;
				$scope.initTravelAgentCard();
				// clean search data
				$scope.searchData.travelAgentCard.travelAgentName = "";
				$scope.searchData.travelAgentCard.travelAgentCity = "";
				$scope.searchData.travelAgentCard.travelAgentIATA = "";
				$scope.$broadcast('travelAgentSearchStopped');
			} else if (card == 'guest') {
				$scope.reservationDetails.guestCard.id = id;
				$scope.initGuestCard();
			}
		}

	}
]);