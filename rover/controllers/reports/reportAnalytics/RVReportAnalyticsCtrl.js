angular.module('sntRover').controller('RVReportAnalyticsCtrl', ['$scope',
	'$rootScope',
	'$state',
	'sntAuthorizationSrv',
	'RVDashboardSrv',
	'sntActivity',
	'$window',
	'$timeout',
	function($scope, $rootScope, $state, sntAuthorizationSrv, RVDashboardSrv, sntActivity, $window, $timeout) {

		BaseCtrl.call(this, $scope);

		var loadIframe = function loadIframe() {
			sntActivity.start('ANALYTICS_IFRAME_LOADING');
			var hotelUUID = sntAuthorizationSrv.getProperty(),
				jwt = $window.localStorage.getItem('jwt'),
				iFrameUrl = '/sisense/analytics/iframe?hotel_uuid=' + hotelUUID + '&auth_token=' + jwt;

			document.getElementById('report-iframe').onload = function() {
				sntActivity.stop('ANALYTICS_IFRAME_LOADING');
			};
			document.getElementById('report-iframe').onerror = function() {
				sntActivity.stop('ANALYTICS_IFRAME_LOADING');
			};
			document.getElementById("report-iframe").src = iFrameUrl;
		};

		var listenToiFrameEvents = function listenToiFrameEvents() {
			var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
				eventer = window[eventMethod],
				messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

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

            $scope.setTitle('Analytics');
		})();

		$scope.$on("$destroy", function() {
			angular.element($window).off(messageEvent);
		});
	}
]);