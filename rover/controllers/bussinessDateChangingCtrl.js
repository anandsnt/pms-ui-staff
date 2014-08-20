sntRover.controller('bussinessDateChangingCtrl', ['$scope','ngDialog', function($scope,ngDialog) {
	$scope.closeThisDialog = function(){
		ngDialog.close();
	};
}]);