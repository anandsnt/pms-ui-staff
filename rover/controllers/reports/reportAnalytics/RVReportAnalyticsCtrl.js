sntRover.controller('RVReportAnalyticsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'sntAuthorizationSrv',
	'$window',
	function($scope, $rootScope, $state, sntAuthorizationSrv, $window) {

		BaseCtrl.call(this, $scope);

		var hotelUUID = sntAuthorizationSrv.getProperty(),
			jwt = $window.localStorage.getItem('jwt'),
			iFrameUrl = '/sisense/analytics/iframe?hotel_uuid=' + hotelUUID + '&auth_token=' + jwt;

		document.getElementById("report-iframe").src = iFrameUrl;

	}
]);