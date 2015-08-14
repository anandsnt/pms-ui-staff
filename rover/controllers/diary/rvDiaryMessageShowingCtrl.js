sntRover.controller('RVDiaryMessageShowingCtrl', ['$scope',
    'ngDialog',
    '$rootScope',
    '$timeout',
    function($scope, ngDialog, $rootScope, $timeout) {
    	$scope.messages = $scope.message;
    	var callBack = $scope.callBackAfterClosingMessagePopUp;

    	$scope.closeDialog = function(){
            //to add stjepan's popup showing animation
            $rootScope.modalOpened = false;
            $timeout(function(){
                ngDialog.close();
            }, 300);
    		if(callBack){
    			$timeout(function(){
    				callBack();
    			}, 1000);

    		}
    	};
	}
]);