	sntZestStation.controller('zsSntAcuantIDScanCtrl', [
		'$scope',
		'$state',
		'zsEventConstants',
		'$stateParams',
		'zsGeneralSrv',
		'zsCheckinSrv',
		'zsUtilitySrv',
		'$controller',
		function($scope, $state, zsEventConstants, $stateParams, zsGeneralSrv, zsCheckinSrv, zsUtilitySrv, $controller) {


			$controller('sntIDCollectionBaseCtrl', {
				$scope: $scope
			});

		}
	]);