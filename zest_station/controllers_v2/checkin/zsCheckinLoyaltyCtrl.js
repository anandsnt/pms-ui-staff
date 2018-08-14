sntZestStation.controller('zsCheckinLoyaltyCtrl', [
	'$scope',
	'zsCheckinSrv',
	function($scope, zsCheckinSrv) {

		BaseCtrl.call(this, $scope);
		var navigateToNextScreen = function() {
			$scope.$emit('NAVIGATE_FROM_LOYALTY_SCREEN');
		};

		$scope.userMemberShips = [];

		$scope.$on('FETCH_USER_MEMBERSHIPS', function() {
			var onSuccessResponse = function(response) {
				$scope.loyaltyMode = 'SELECT_LOYALTY';
				$scope.existingLoyaltyPgms = [];

				// Check the existing loyalty programs in the guest card
				if (response.hotelLoyaltyProgram.length === 1 && response.frequentFlyerProgram.length === 0) {
					$scope.existingLoyaltyPgms.push(response.hotelLoyaltyProgram[0]);
				} else if (response.frequentFlyerProgram.length === 1 && response.hotelLoyaltyProgram.length === 0) {
					$scope.existingLoyaltyPgms.push(response.frequentFlyerProgram[0]);
				} else if (response.hotelLoyaltyProgram.length > 0 || response.frequentFlyerProgram.length > 0) {
					$scope.existingLoyaltyPgms = [{
						hotelLoyaltyPrograms: response.hotelLoyaltyProgram,
						frequentFlyerPrograms: response.frequentFlyerProgram
					}];
				}
			};
			var onFailureResponse = function() {
				$scope.loyaltyMode = 'ADD_NEW_LOYALTY';
			};

			$scope.callAPI(zsCheckinSrv.fetchUserMemberships, {
				params: {
					userId: $scope.selectedReservation.guest_details[0].id
				},
				'successCallBack': onSuccessResponse,
				'failureCallBack': onFailureResponse
			});
		});

		$scope.setLoyaltyForReservation = function(pgmId) {
			$scope.callAPI(zsCheckinSrv.setLoyaltyForReservation, {
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
			}
		};
	}
]);