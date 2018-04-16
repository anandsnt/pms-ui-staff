sntGuestWeb.controller('gwCollectEmailController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv', '$rootScope', '$modal',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv, $rootScope, $modal) {

		$controller('gwETABaseController', {
			$scope: $scope
		});
		$scope.guestDetails = {
			"email": ""
		};
		$scope.emailUpdated = false;

		var openErrorPopup = function(type) {
			var msg = (type === 'INVALID_EMAIL') ? "Please provide a valid e-mail" : "There is a problem saving your email address. Please retry.";
			// show popup
			var popupOptions = angular.copy($scope.errorOpts);

			popupOptions.resolve = {
				message: function() {
					return msg;
				}
			};
			$modal.open(popupOptions);
		};

		$scope.emailSubmitted = function() {
			if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
				$scope.emailUpdated = true;
			} else if (!validateEmail($scope.guestDetails.email)) {
				openErrorPopup('INVALID_EMAIL');
			} else {
				var options = {
					'params': {
						'data': {
							"email": $scope.guestDetails.email
						}
					},
					'successCallBack': function() {
						$scope.emailUpdated = true;
					},
					'failureCallBack': function() {
						openErrorPopup('EMAIL_ERROR');
					}
				};

				$scope.callAPI(GwCheckinSrv.postGuestDetails, options);
			}
		};

		$scope.continueToPrecheckin = function() {
			if (GwWebSrv.zestwebData.collectCCOnCheckin && GwWebSrv.zestwebData.isMLI) {
				$state.go('checkinCCAddition');
			} else {
				$state.go('autoCheckinFinal');

			}
		};
		$scope.changeEmail = function() {
			$scope.emailUpdated = false;
		};
	}
]);