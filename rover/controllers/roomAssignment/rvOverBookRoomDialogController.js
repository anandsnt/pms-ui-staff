sntRover.controller('RVOverBookRoomDialogController',['$scope','$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog){
	BaseCtrl.call(this, $scope);


	$scope.closeDialog = function(){
		ngDialog.close();
	};



}]);