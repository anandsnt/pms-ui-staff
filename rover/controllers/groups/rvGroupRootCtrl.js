sntRover.controller('rvGroupRootCtrl',	[
	'$scope',
	'$rootScope',
	'$filter',
	function($scope, $rootScope, $filter) {

		/**
		* function to set Headinng
		* @return - {None}
		*/
		$scope.setHeadingTitle = function(heading) {
			$scope.heading = heading;
			$scope.setTitle ($filter('translate')(heading));
		};
	}]);