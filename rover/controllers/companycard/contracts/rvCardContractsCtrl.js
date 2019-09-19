angular.module('sntRover').controller('rvCardContractsCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', 'dateFilter', '$timeout', 'rvPermissionSrv',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter, $timeout, rvPermissionSrv) {

		BaseCtrl.call(this, $scope);

		$scope.contractData = {
			mode: 'ADD',
			addData: {},
			editData: {}
		};
	}

]);