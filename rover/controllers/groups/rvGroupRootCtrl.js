sntRover.controller('rvGroupRootCtrl',	[
	'$scope',
	'$rootScope',
	function($scope, $rootScope) {

		/**
		* function to set Headinng
		* @return - {None}
		*/
		$scope.setHeadingTitle = function(heading) {
			$scope.heading = heading;
			$scope.setTitle(heading);
		};
	}]);