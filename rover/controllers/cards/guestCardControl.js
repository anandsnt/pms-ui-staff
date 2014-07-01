sntRover.controller('RVGuestCardCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout', 'RVContactInfoSrv',
	function($scope, RVCompanyCardSrv, $timeout, RVContactInfoSrv) {
		$scope.searchMode = true;

		if ($scope.reservationDetails.guestCard.id != null && $scope.reservationDetails.guestCard.id != "") {
			$scope.searchMode = false;
		}

		$scope.$on("guestSearchInitiated", function() {
			$scope.guestSearchIntiated = true;
			$scope.guests = $scope.searchedGuests;
			$scope.$broadcast("refreshGuestScroll");
		})

		$scope.$on("guestSearchStopped", function() {
			$scope.guestSearchIntiated = false;
			$scope.guests = [];
			$scope.$broadcast("refreshCompaniesScroll");
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

		$scope.createNewGuest = function() {
			console.log('to add New Card');
			// create an empty dataModel for the guest
			var contactInfoData = {
				'contactInfo': "",
				'countries': "",
				'userId': "",
				'avatar': "",
				'guestId': "",
				'vip': "" //TODO: check with API or the product team
			};
			// // $scope.$emit('guestCardUpdateData', contactInfoData);
			$scope.guestCardData.contactInfo = "";
			$scope.guestCardData.contactInfo.avatar = "";
			$scope.guestCardData.contactInfo.vip = "";
			$scope.countriesList = "";
			$scope.guestCardData.userId = "";
			$scope.guestCardData.guestId = "";
			$scope.guestCardData.contactInfo.birthday = null;
			var guestInfo = {
				"user_id": "",
				"guest_id": ""
			};
			$scope.$broadcast('guestSearchStopped');
			$scope.$broadcast('guestCardAvailable');
		}
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