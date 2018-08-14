sntZestStation.controller('zsCheckinLoyaltyCtrl', [
	'$scope',
	'zsCheckinLoyaltySrv',
	'zsGeneralSrv',
	'$timeout',
	function($scope, zsCheckinLoyaltySrv, zsGeneralSrv, $timeout) {

		BaseCtrl.call(this, $scope);
		var pageNumber;
		var navigateToNextScreen = function() {
			$scope.$emit('NAVIGATE_FROM_LOYALTY_SCREEN');
		};

		$scope.$on('FETCH_USER_MEMBERSHIPS', function() {
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
					userId: $scope.selectedReservation.guest_details[0].id
				},
				'successCallBack': onSuccessResponse,
				'failureCallBack': onFailureResponse
			});
		});

		$scope.skipLoyalties = function() {
			navigateToNextScreen();
		};

		$scope.setLoyaltyForReservation = function(pgmId) {
			$scope.callAPI(zsCheckinLoyaltySrv.setLoyaltyForReservation, {
				params: {
					membership_id: pgmId,
					reservation_id: $scope.selectedReservation.id
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
			$scope.pageData =  zsGeneralSrv.proceesPaginationDetails($scope.existingLoyaltyPgms, itemsPerPage, pageNumber);
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

		$scope.addNewLoyalty = function() {
			$scope.loyaltyMode = 'ADD_NEW_LOYALTY';
		};
		$scope.addFreaquentFlyerLoyalty = function() {
			$scope.loyaltyMode = 'ADD_NEW_FF_LOYALTY';
		};
		$scope.addHotelLoyalty = function() {
			$scope.loyaltyMode = 'ADD_HOTEL_LOYALTY';
		};
	}
]);