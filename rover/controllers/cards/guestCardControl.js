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

		/**
		 *  API call needs only rest of keys in the data
		 */
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

		/**
		 * tab actions
		 */
		$scope.guestCardTabSwitch = function(tab) {
			if ($scope.current === 'guest-contact' && tab !== 'guest-contact') {
				$scope.$broadcast('saveContactInfo');
			};
			if (tab === 'guest-credit') {
				$scope.$broadcast('PAYMENTSCROLL');
			}

			$scope.current = tab;
		};

		$scope.$on('contactInfoError', function(event, value) {
			$scope.contactInfoError = value;
		});
		$scope.updateContactInfo = function() {
			var saveUserInfoSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
			};
			var saveUserInfoFailureCallback = function(data) {
				$scope.$emit('hideLoader');
			};
			var newUpdatedData = $scope.decloneUnwantedKeysFromContactInfo();
			// check if there is any chage in data.if so call API for updating data
			if (JSON.stringify(currentGuestCardHeaderData) !== JSON.stringify(newUpdatedData)) {
				currentGuestCardHeaderData = newUpdatedData;
				var data = {
					'data': currentGuestCardHeaderData,
					'userId': $scope.guestCardData.contactInfo.user_id
				};
				$scope.invokeApi(RVContactInfoSrv.saveContactInfo, data, saveUserInfoSuccessCallback, saveUserInfoFailureCallback);
			}
		};

		/**
		 * handle click outside tabs and drawer click
		 */


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