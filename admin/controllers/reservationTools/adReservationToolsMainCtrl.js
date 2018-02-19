// list all the reservation tools list
// since we can only bring the main menu states from db

admin.controller('ADReservationTypeToolsMainCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	function($scope, $rootScope, $state) {

		// since we dont have a place where the sub menu object is saved
		// we will have to dig through the selected menu and find
		// the submenu, how to find, since we are gonna hard code the
		// state name. We prefer matching state name since we know, it wont change :(
		var components = $scope.$parent.selectedMenu.components;

		$scope.toolsMenu = _.findWhere(components, { state: 'admin.reservationTools' });

		$scope.openSubmenu = function(e, state) {
			$state.go( state );
		};
	}
]);