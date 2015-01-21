sntRover.controller('RVDiaryMessageShowingCtrl', ['$scope',
    'ngDialog',
    function($scope, ngDialog) {
    	$scope.messages = $scope.message;
    	var callBack = $scope.callBackAfterClosingMessagePopUp;

    	$scope.closeDialog = function(){
    		ngDialog.close();
    		if(callBack){
    			setTimeout(function(){
    				callBack();
    			}, 1000);
    			
    		}
    	}
	}
]);