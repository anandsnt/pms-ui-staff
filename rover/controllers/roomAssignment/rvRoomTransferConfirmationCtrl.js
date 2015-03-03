sntRover.controller('rvRoomTransferConfirmationCtrl',['$scope','$rootScope','$filter', 'ngDialog', '$timeout',
	function($scope, $rootScope,$filter, ngDialog , $timeout){

	//var roomTransfer = $scope.roomTransfer;
	
	BaseCtrl.call(this, $scope);
	
	$scope.closeDialog = function() {
            //to add stjepan's popup showing animation
            $rootScope.modalOpened = false; 
            $timeout(function(){
                ngDialog.close();
            }, 300);  
		};

	$scope.moveWithoutRateChange = function() {	
		
	}

	$scope.applyRateChange = function() {	
		$scope.assignRoom();
		$scope.closeDialog();
	}

	$scope.confirm = function() {
		$scope.assignRoom();
		$scope.closeDialog();
	}
	
}]);