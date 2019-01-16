sntRover.controller('RVReportAnalyticsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'sntAuthorizationSrv',
	'RVDashboardSrv',
	'$window',
	'$timeout',
	function($scope, $rootScope, $state, sntAuthorizationSrv, RVDashboardSrv, $window, $timeout) {

		BaseCtrl.call(this, $scope);

		var loadIframe = function() {
			var hotelUUID = sntAuthorizationSrv.getProperty(),
				jwt = $window.localStorage.getItem('jwt'),
				iFrameUrl = '/sisense/analytics/iframe?hotel_uuid=' + hotelUUID + '&auth_token=' + jwt;
			
			///iFrameUrl = '/sisense/sessions/login';

			document.getElementById("report-iframe").src = iFrameUrl;
		};

		var listenToChildEvents = function() {
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
			listenToChildEvents();
		}());

		$scope.$on("$destroy", () => {
			angular.element($window).off(messageEvent);
		});

	}
]);