sntRover.controller('RVDiaryMessageShowingCtrl', ['$scope',
    'ngDialog',
    function($scope, ngDialog) {
    	$scope.messages = $scope.message;

    	$scope.closeDialog = function(){
    		ngDialog.close();
    	}
	}
]);