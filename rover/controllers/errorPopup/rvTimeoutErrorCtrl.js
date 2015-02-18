sntRover.controller('RVTimeoutErrorCtrl', ['$scope', 'RVHKOWSTestSrv', '$rootScope', 'ngDialog',function($scope, RVHKOWSTestSrv, $rootScope, ngDialog) {

	$scope.closeThisDialog = function(){
			ngDialog.close();
	};

}]);