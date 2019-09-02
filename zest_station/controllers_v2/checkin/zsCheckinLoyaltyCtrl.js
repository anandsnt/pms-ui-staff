sntZestStation.controller('zsCheckinLoyaltyCtrl', [
	'$scope',
	'zsCheckinLoyaltySrv',
	'zsGeneralSrv',
	'$timeout',
	'$filter',
	function($scope, zsCheckinLoyaltySrv, zsGeneralSrv, $timeout, $filter) {

		var userId = $scope.selectedReservation.guest_details[0].id;
		var reservationId = $scope.selectedReservation.id;
		var blankMembership = {
			id: '',
			code: '',
			level: '',
			selectedLoyalty: {}
		};
		var isHlpActive = false;
		var isFfpActive = false;
		var navigateToNextScreen = function() {
			$scope.$emit('NAVIGATE_FROM_LOYALTY_SCREEN');
		};

		BaseCtrl.call(this, $scope);
		$scope.ffLoyalties = [];
		$scope.hotelLoyalties = [];
		$scope.paginationTranslationData = {};

		/* ************** BACK BUTTON ACTIONS ********************* */

		$scope.$on('LOYALTY_PROGRAMS_BACK_NAVIGATIONS', function() {
			if ($scope.loyaltyMode === 'SELECT_LOYALTY') {
				$scope.$emit('CHANGE_MODE_TO_RESERVATION_DETAILS');
			} else if (($scope.loyaltyMode === 'ADD_NEW_FF_LOYALTY' && isHlpActive) || ($scope.loyaltyMode === 'ADD_HOTEL_LOYALTY' && isFfpActive)) {
				$scope.loyaltyMode = 'ADD_NEW_LOYALTY';
			} else {
				$scope.loyaltyMode = 'SELECT_LOYALTY';
			}
		});

		/* ************** ON ENETERING LOYALTY MODE ********************* */

		$scope.$on('FETCH_USER_MEMBERSHIPS', function() {
			$scope.loyaltyMode = '';
			$scope.existingLoyaltyPgms = [];
			var onSuccessResponse = function(response) {
				isHlpActive = response.use_hlp;
				isFfpActive = response.use_ffp;
				// if settings are turned OFF, discard the programs
				response.hotelLoyaltyProgram = response.use_hlp ? response.hotelLoyaltyProgram : [];
				response.frequentFlyerProgram = response.use_ffp ? response.frequentFlyerProgram : [];
				// Check the existing loyalty programs in the guest card
				if (response.hotelLoyaltyProgram.length > 0 || response.frequentFlyerProgram.length > 0) {
					$scope.existingLoyaltyPgms = response.frequentFlyerProgram.concat(response.hotelLoyaltyProgram);
				}
				$scope.existingLoyalty = _.find($scope.existingLoyaltyPgms, function(loyalty) {
					return response.selected_loyalty === loyalty.id;
				});

				if ($scope.existingLoyalty) {
					$scope.existingLoyaltyPgms = _.filter($scope.existingLoyaltyPgms, function(loyalty) {
						return loyalty.id !== $scope.existingLoyalty.id;
					});
				}
				$scope.loyaltyMode = 'SELECT_LOYALTY';
			};
			
			var onFailureResponse = function() {
				$scope.loyaltyMode = 'SELECT_LOYALTY';
			};

			$scope.callAPI(zsCheckinLoyaltySrv.fetchUserMemberships, {
				params: {
					user_id: userId,
					reservation_id: reservationId
				},
				'successCallBack': onSuccessResponse,
				'failureCallBack': onFailureResponse
			});
		});

		$scope.selectNewLoyalty = function() {
			$scope.loyaltyMode = 'SELECT_LOYALTY';
		};

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
				$scope.pageData = zsGeneralSrv.retrievePaginationStartingData();
				setPageNumberDetails();
			}
		};

		var setPageNumberDetails = function() {
			$scope.$emit('hideLoader');
			var itemsPerPage = 3;

			$scope.pageData = zsGeneralSrv.proceesPaginationDetails($scope.existingLoyaltyPgms, itemsPerPage, $scope.pageData.pageNumber);
			$scope.paginationTranslationData = {
				'startingIndex': $scope.pageData.pageStartingIndex,
				'endingIndex': $scope.pageData.pageEndingIndex,
				'total': $scope.existingLoyaltyPgms.length
			};
		};

		$scope.paginationAction = function(disableButtonFlag, isNextPage) {
			disableButtonFlag = true;
			$scope.$emit('showLoader');
			$timeout(function() {
				$scope.pageData.pageNumber = isNextPage ? ++$scope.pageData.pageNumber : --$scope.pageData.pageNumber;
				setPageNumberDetails();
			}, 200);
		};

		/* ************** ADD NEW LOYALITY **************************** */

		$scope.addNewLoyalty = function() {
			if (isHlpActive && isFfpActive) {
				$scope.loyaltyMode = 'ADD_NEW_LOYALTY';
			} else if (isHlpActive) {
				$scope.addHotelLoyalty();
			} else {
				$scope.addFreaquentFlyerLoyalty();
			}
		};

		$scope.callAPIToSaveLoyality = function(userMembership, classType) {

			var params = zsCheckinLoyaltySrv.generateAPIParams(userId, reservationId, userMembership, classType);

			$scope.callAPI(zsCheckinLoyaltySrv.saveLoyaltyPgm, {
				params: params,
				'successCallBack': navigateToNextScreen,
				'failureCallBack': function(response) {
					var membershipAlreadyTakenMsg = $filter('translate')('MEMBERSHIP_ALREADY_TAKEN');
					var generalErrorMsg = $filter('translate')('LOYALTY_GENERAL_ERROR');

					if (Array.isArray(response)) {
						$scope.errorMessage = response[0] === 'Membership type has already been taken' ? membershipAlreadyTakenMsg : generalErrorMsg;
					} else {
						$scope.errorMessage = generalErrorMsg;
					}
					$scope.loyaltyMode = 'ADD_NEW_LOYALTY_FAILED';
				}
			});
		};
		/* ************** ADD NEW FF LOYALITY **************************** */

		$scope.addFreaquentFlyerLoyalty = function() {
			$scope.ffLoyalties = [];
			$scope.ffLoyalty = angular.copy(blankMembership);
			$scope.callAPI(zsCheckinLoyaltySrv.getAvailableFreaquentFlyerLoyaltyPgms, {
				params: {},
				'successCallBack': function(response) {
					$scope.ffLoyalties = response;
					$scope.loyaltyMode = 'ADD_NEW_FF_LOYALTY';
				}
			});
		};

		/* ************** ADD NEW HOTEL LOYALITY **************************** */

		$scope.addHotelLoyalty = function() {
			$scope.hotelLoyalties = [];
			$scope.selectedLoyalty = {};
			$scope.hotelLoyalty = angular.copy(blankMembership);
			$scope.callAPI(zsCheckinLoyaltySrv.getAvailableHotelLoyaltyPgms, {
				params: {},
				'successCallBack': function(response) {
					$scope.hotelLoyalties = response;
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
	}
]);