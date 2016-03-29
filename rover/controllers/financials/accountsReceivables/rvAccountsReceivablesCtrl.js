sntRover.controller('RVAccountsReceivablesController', ['$scope','$stateParams', '$filter', 'RVAccountsReceivablesSrv', function($scope, $stateParams, $filter, RVAccountsReceivablesSrv ) {

	BaseCtrl.call(this, $scope);
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_ACCOUNTS_RECEIVABLES'));
	$scope.setTitle($filter('translate')('MENU_ACCOUNTS_RECEIVABLES'));

}]);