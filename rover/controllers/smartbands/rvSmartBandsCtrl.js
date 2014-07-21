sntRover.controller('RVSmartBandsController', ['$scope', '$state', '$stateParams',
function($scope, $state, $stateParams) {
	BaseCtrl.call(this, $scope);
		// console.log($scope.data.guest_details.first_name)
	$scope.smartBandData = {};
	$scope.smartBandData.firstName = JSON.parse(JSON.stringify($scope.data.guest_details.first_name));
	$scope.smartBandData.lastName = JSON.parse(JSON.stringify($scope.data.guest_details.last_name));

	$scope.showAddNewSmartBandScreen = false;
	$scope.isFixedAmount = false;
	$scope.showWriteToBand = false;
	$scope.addNewSmartband = function(){
		$scope.showAddNewSmartBandScreen = true;
	};
	$scope.setPaymentType = function(){
		$scope.isFixedAmount = !$scope.isFixedAmount;
	};
	$scope.fetchSuccessKeyRead = function(){
		console.log("sucessss")
	};
	$scope.fetchFailedKeyRead = function(){
		console.log("failure")
	};
	$scope.clickContinueButton = function(){
		var blankKeys = "";
		if($scope.smartBandData.firstName == '' || $scope.smartBandData.firstName == null){
			blankKeys = "First Name";		
		}
		if($scope.smartBandData.lastName == '' || $scope.smartBandData.lastName == null){			
			blankKeys = blankKeys == '' ? "Last Name" : (blankKeys + ", " + 'Last Name');
		}
		if($scope.isFixedAmount){	
			if($scope.smartBandData.fixedAmount == '' || $scope.smartBandData.fixedAmount == null){			
				blankKeys = blankKeys == '' ? "Amount" : (blankKeys + ", " + "Amount");
			}
			else{
				var pattern = /^(0|[1-9][0-9]{0,2}(?:(,[0-9]{3})*|[0-9]*))(\.[0-9]+){0,1}$/;
				if(!pattern.test($scope.smartBandData.fixedAmount)){
					blankKeys = blankKeys == '' ? "Amount is not valid" : (blankKeys + ", " + "Amount is not valid");
				}
			}

		}	
		if(blankKeys != "")	{
			$scope.errorMessage = ['Please enter ' + blankKeys ];
		} else {
			var options = {
				'successCallBack': $scope.fetchSuccessKeyRead,
				'failureCallBack': $scope.fetchFailedKeyRead			
			};
			
			$scope.isFixedAmount = false;
			$scope.showWriteToBand = true;
			console.log("debug----"+sntapp.cardSwipeDebug);
			if(sntapp.cardSwipeDebug){
				sntapp.cardReader.retrieveUserIDDebug(options);
			}
			else{
				sntapp.cardReader.retrieveUserID(options);
			}
		}
	};
}]);
