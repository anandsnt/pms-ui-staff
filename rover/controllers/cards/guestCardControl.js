sntRover.controller('RVGuestCardCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout',
	function($scope, RVCompanyCardSrv, $timeout) {
		$scope.searchMode = false;

		$scope.$on("guestSearchInitiated", function() {
			$scope.guestSearchIntiated = true;
			$scope.guests = $scope.searchedGuests;
			$scope.refreshScroll('companyResultScroll');
		})

		$scope.$on("guestSearchStopped", function() {
			$scope.guestSearchIntiated = false;
			$scope.guests = [];
		})

		$scope.$on("guestCardDetached", function() {
			$scope.searchMode = true;
		});

		$scope.$on('guestCardAvailable', function() {
			$scope.searchMode = false;
			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 1000);
		});
	}

]);