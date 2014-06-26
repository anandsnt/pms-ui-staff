sntRover.controller('stayCardMainCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams',
	function($scope, RVCompanyCardSrv, $stateParams) {

		// BaseCtrl.call(this, $scope);
		$scope.searchData = {
			guestCard: {
				guestFirstName: "",
				guestLastName: "",
				guestCity: ""
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


		// fetch reservation company card details 
		$scope.initCompanyCard = function() {
			var companyCardFound = function(data) {
				$scope.$emit("hideLoader");
				$scope.companyContactInformation = data;
				$scope.$broadcast('companyCardAvailable');
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
				$scope.travelAgentInformation = data;
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

		$scope.$on('cardIdsFetched', function() {
			console.log('init of guest-controller', {
				guest: $scope.reservationDetails.guestCard.id,
				company: $scope.reservationDetails.companyCard.id,
				travelagent: $scope.reservationDetails.travelAgent.id
			});
			$scope.initCompanyCard();
			$scope.initTravelAgentCard();
		});

		$scope.removeCard = function(card) {
			// TODO: Remove card
			$scope.invokeApi(RVCompanyCardSrv.removeCard, {
				'reservation': $stateParams.id,
				'cardType': card
			}, function() {
				console.log('removeCard - success');
				$scope.$emit('hideLoader');
			}, function() {
				console.log('removeCard - failure');
			});
		}

		$scope.replaceCard = function(card, id) {
			//Replace card with the selected one
			$scope.invokeApi(RVCompanyCardSrv.replaceCard, {
				'reservation': $stateParams.id,
				'cardType': card,
				'id': id
			}, function() {
				console.log('replaceCard - success');
				$scope.$emit('hideLoader');
			}, function() {
				console.log('replaceCard -failure');
			});
		}

	}
]);