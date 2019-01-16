sntRover.controller('RVReportAnalyticsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'sntAuthorizationSrv',
	'RVDashboardSrv',
	'sntActivity',
	'$window',
	'$timeout',
	function($scope, $rootScope, $state, sntAuthorizationSrv, RVDashboardSrv, sntActivity, $window, $timeout) {

		BaseCtrl.call(this, $scope);

		var loadIframe = function() {
			sntActivity.start('ANALYTICS_IFRAME_LOADING');
			var hotelUUID = sntAuthorizationSrv.getProperty(),
				jwt = $window.localStorage.getItem('jwt'),
				iFrameUrl = '/sisense/analytics/iframe?hotel_uuid=' + hotelUUID + '&auth_token=' + jwt;

			document.getElementById("report-iframe").src = iFrameUrl;

			document.getElementById('report-iframe').onload = function() {
				sntActivity.stop('ANALYTICS_IFRAME_LOADING');
			};
			document.getElementById('report-iframe').onerror = function() {
				sntActivity.stop('ANALYTICS_IFRAME_LOADING');
			};
		};

		var listenToiFrameEvents = function() {
			var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			var eventer = window[eventMethod];
			var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

			angular.element($window).on(messageEvent, function(e) {
				var responseData = e.data || e.originalEvent.data;

				if (responseData === "logout_app") {
					RVDashboardSrv.signOut().finally(function() {
						$timeout(function() {
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