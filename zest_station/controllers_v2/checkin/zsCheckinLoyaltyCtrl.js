sntZestStation.controller('zsCheckinLoyaltyCtrl', [
	'$scope',
	'zsCheckinLoyaltySrv',
	'zsGeneralSrv',
	'$timeout',
	'zsEventConstants',
	function($scope, zsCheckinLoyaltySrv, zsGeneralSrv, $timeout, zsEventConstants) {

		BaseCtrl.call(this, $scope);
		$scope.ffLoyalties = [];
		$scope.hotelLoyalties = [];
		var userId = $scope.selectedReservation.guest_details[0].id;
		var reservationId = $scope.selectedReservation.id;
		var pageNumber;
		var navigateToNextScreen = function() {
			$scope.$emit('NAVIGATE_FROM_LOYALTY_SCREEN');
		};

		$scope.$on('LOYALTY_PROGRAMS_BACK_NAVIGATIONS', function() {
			if ($scope.loyaltyMode === 'SELECT_LOYALTY') {
				$scope.$emit('CHANGE_MODE_TO_RESERVATION_DETAILS');
			} else if ($scope.loyaltyMode === 'ADD_NEW_FF_LOYALTY' || $scope.loyaltyMode === 'ADD_HOTEL_LOYALTY') {
				$scope.loyaltyMode = 'ADD_NEW_LOYALTY';
			} else {
				$scope.loyaltyMode = 'SELECT_LOYALTY';
			}
		});

		$scope.$on('FETCH_USER_MEMBERSHIPS', function() {
			$scope.loyaltyMode = '';
			var onSuccessResponse = function(response) {
				$scope.existingLoyaltyPgms = [];
				$scope.loyaltyMode = 'SELECT_LOYALTY';
				// Check the existing loyalty programs in the guest card
				if (response.hotelLoyaltyProgram.length > 0 || response.frequentFlyerProgram.length > 0) {
					$scope.existingLoyaltyPgms = response.hotelLoyaltyProgram.concat(response.frequentFlyerProgram);
				}
			};
			var onFailureResponse = function() {
				$scope.loyaltyMode = 'SELECT_LOYALTY';
			};

			$scope.callAPI(zsCheckinLoyaltySrv.fetchUserMemberships, {
				params: {
					userId: userId
				},
				'successCallBack': onSuccessResponse,
				'failureCallBack': onFailureResponse
			});
		});

		$scope.skipLoyalties = function() {
			navigateToNextScreen();
		};

		/* ************** SELECT EXISTING LOYALITY ********************* */

		$scope.setLoyaltyForReservation = function(pgmId) {
			$scope.callAPI(zsCheckinLoyaltySrv.setLoyaltyForReservation, {
				params: {
					membership_id: pgmId,
					reservation_id: reservationId
				},
				'successCallBack': navigateToNextScreen
			});
		};

		$scope.selectExistingLoyalty = function() {
			if ($scope.existingLoyaltyPgms.length === 1) {
				$scope.setLoyaltyForReservation($scope.existingLoyaltyPgms[0].id);
			} else {
				$scope.loyaltyMode = 'SELECT_FROM_MULTIPLE_LOYALTIES';
				pageNumber = 1;
				$scope.pageData = {
					disableNextButton: false,
					disablePreviousButton: false,
					pageStartingIndex: 1,
					pageEndingIndex: '',
					viewableItems: []
				};
				setPageNumberDetails();
			}
		};

		var setPageNumberDetails = function() {
			$scope.$emit('hideLoader');
			var itemsPerPage = 5;
			$scope.pageData = zsGeneralSrv.proceesPaginationDetails($scope.existingLoyaltyPgms, itemsPerPage, pageNumber);
		};

		$scope.viewNextPage = function() {
			$scope.pageData.disableNextButton = true;
			$scope.$emit('showLoader');
			$timeout(function() {
				pageNumber++;
				setPageNumberDetails();
			}, 500);
		};

		$scope.viewPreviousPage = function() {
			$scope.pageData.disablePreviousButton = true;
			$scope.$emit('showLoader');
			$timeout(function() {
				pageNumber--;
				setPageNumberDetails();
			}, 500);
		};

		/* ************** ADD NEW LOYALITY **************************** */

		$scope.addNewLoyalty = function() {
			$scope.loyaltyMode = 'ADD_NEW_LOYALTY';
		};

		var callAPIToSaveLoyality = function(userMembership) {
			var params = {
				"user_id": userId,
				"user_membership": userMembership,
				"reservation_id": reservationId
			};

			$scope.callAPI(zsCheckinLoyaltySrv.saveLoyaltyPgm, {
				params: params,
				'successCallBack': navigateToNextScreen,
				'failureCallBack': function() {

				}
			});
		};

		/* ************** ADD NEW FF LOYALITY **************************** */

		$scope.addFreaquentFlyerLoyalty = function() {
			$scope.ffLoyalties = [];
			$scope.callAPI(zsCheckinLoyaltySrv.getAvailableFreaquentFlyerLoyaltyPgms, {
				params: {},
				'successCallBack': function(response) {
					$scope.ffLoyalties = response;
					$scope.ffLoyalty = {
						id: '',
						code: ''
					};
					$scope.loyaltyMode = 'ADD_NEW_FF_LOYALTY';
				}
			});
		};

		$scope.saveFFLoyalty = function() {
			var userMembership = {
				"membership_card_number": $scope.ffLoyalty.code,
				"membership_class": "FFP",
				"membership_type": $scope.ffLoyalty.id,
				"membership_level": ""
			};

			callAPIToSaveLoyality(userMembership);
		};

		/* ************** ADD NEW HOTEL LOYALITY **************************** */

		$scope.addHotelLoyalty = function() {
			$scope.hotelLoyalties = [];
			$scope.selectedLoyalty = {};
			$scope.hotelLoyalty = {
				id: '',
				code: '',
				level: ''
			};
			$scope.callAPI(zsCheckinLoyaltySrv.getAvailableHotelLoyaltyPgms, {
				params: {},
				'successCallBack': function(response) {
					$scope.hotelLoyalties = response;
					$scope.hotelLoyalty = {
						id: '',
						code: '',
						level: '',
						selectedLoyalty: {}
					};
					$scope.loyaltyMode = 'ADD_HOTEL_LOYALTY';
				}
			});
		};

		$scope.hotelLoyaltyChanged = function() {
			$scope.hotelLoyalty.code = '';
			$scope.hotelLoyalty.level = '';
			$scope.hotelLoyalty.selectedLoyalty = _.find($scope.hotelLoyalties, function(loyalty) {
				return $scope.hotelLoyalty.id === loyalty.hl_value;
			});
		};

		$scope.saveHotelLoyalty = function() {
			var userMembership = {
				"membership_card_number": $scope.hotelLoyalty.code,
				"membership_class": "HLP",
				"membership_type": $scope.hotelLoyalty.id,
				"membership_level": $scope.hotelLoyalty.level
			};

			callAPIToSaveLoyality(userMembership);
		};
	}
]);