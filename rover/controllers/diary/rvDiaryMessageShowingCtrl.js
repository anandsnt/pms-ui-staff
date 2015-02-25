sntRover.controller('RVDiaryMessageShowingCtrl', ['$scope',
    'ngDialog',
    '$rootScope',
    function($scope, ngDialog, $rootScope) {
    	$scope.messages = $scope.message;
    	var callBack = $scope.callBackAfterClosingMessagePopUp;

    	$scope.closeDialog = function(){
            //to add stjepan's popup showing animation
            $rootScope.modalOpened = false;    		
    		if(callBack){
    			setTimeout(function(){
                    ngDialog.close();
    				callBack();
    			}, 1000);
    			
    		}
    	}
	}
]);