sntRover.controller('RVReportAnalyticsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'sntAuthorizationSrv',
	'RVDashboardSrv',
	'sntActivity',
	'$window',
	'$timeout',
	($scope, $rootScope, $state, sntAuthorizationSrv, RVDashboardSrv, sntActivity, $window, $timeout) => {

		BaseCtrl.call(this, $scope);

		let loadIframe = () => {
			sntActivity.start('ANALYTICS_IFRAME_LOADING');
			let hotelUUID = sntAuthorizationSrv.getProperty(),
				jwt = $window.localStorage.getItem('jwt'),
				iFrameUrl = '/sisense/analytics/iframe?hotel_uuid=' + hotelUUID + '&auth_token=' + jwt;

			document.getElementById('report-iframe').onload = () => {
				sntActivity.stop('ANALYTICS_IFRAME_LOADING');
			};
			document.getElementById('report-iframe').onerror = () => {
				sntActivity.stop('ANALYTICS_IFRAME_LOADING');
			};
			document.getElementById("report-iframe").src = iFrameUrl;
		};

		let listenToiFrameEvents = () => {
			let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
				eventer = window[eventMethod],
				messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

			angular.element($window).on(messageEvent, (e) => {
				let responseData = e.data || e.originalEvent.data;

				if (responseData === "logout_app") {
					RVDashboardSrv.signOut().finally(() => {
						$timeout(() => {
							$window.location.href = '/logout';
						});
					});
				}
			});
		};

		(function() {
			loadIframe();
			listenToiFrameEvents();
		}());

		$scope.$on("$destroy", () => {
			angular.element($window).off(messageEvent);
		});

	}
]);