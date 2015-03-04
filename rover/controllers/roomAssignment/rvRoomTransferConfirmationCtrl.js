sntRover.controller('rvRoomTransferConfirmationCtrl',['$scope','$rootScope','$filter', 'ngDialog', '$timeout',
	function($scope, $rootScope,$filter, ngDialog , $timeout){

	if($scope.roomTransfer.newRoomRate<$scope.roomTransfer.oldRoomRate){
		$scope.isSmallerRate = true;
	}else if($scope.roomTransfer.newRoomRate>$scope.roomTransfer.oldRoomRate){
		$scope.isLargerRate = true;
	}

	BaseCtrl.call(this, $scope);
	
	$scope.closeDialog = function() {
            //to add stjepan's popup showing animation
            $rootScope.modalOpened = false; 
            $timeout(function(){
                ngDialog.close();
            }, 300);  
		};

	$scope.moveWithoutRateChange = function() {	
		$scope.roomTransfer.withoutRateChange = true;
		$scope.assignRoom();
		$scope.closeDialog();
	}

	$scope.applyRateChange = function() {	
    	$scope.roomTransfer.withoutRateChange = false;
		$scope.roomTransfer.newRoomRateChange = $scope.roomTransfer.newRoomRate;
		$scope.assignRoom();
		$scope.closeDialog();
	}

	$scope.confirm = function() {
		$scope.roomTransfer.withoutRateChange = true;
		$scope.assignRoom();
		$scope.closeDialog();
	}
	
}]);