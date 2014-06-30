sntRover.controller('RVGuestCardCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout', 'RVContactInfoSrv',
	function($scope, RVCompanyCardSrv, $timeout, RVContactInfoSrv) {
		$scope.searchMode = false;

		$scope.$on("guestSearchInitiated", function() {
			$scope.guestSearchIntiated = true;
			$scope.guests = $scope.searchedGuests;
			$scope.$broadcast("refreshGuestScroll");
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



sntRover.controller('guestResults', ['$scope', '$timeout',
	function($scope, $timeout) {
		$scope.$parent.myScrollOptions = {
			'guestResultScroll': {
				snap: false,
				scrollbars: true,
				vScroll: true,
				vScrollbar: true,
				hideScrollbar: false
			}
		}
		$scope.$on("refreshGuestScroll", function() {
			$timeout(function() {
				$scope.$parent.myScroll['guestResultScroll'].refresh();
			}, 500);
		})
	}
]);