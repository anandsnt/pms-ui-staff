sntRover.controller('RVSmartBandsController', ['$scope', '$state', '$stateParams', 'RVSmartBandSrv',
function($scope, $state, $stateParams, RVSmartBandSrv) {
	BaseCtrl.call(this, $scope);
	$scope.smartBandData = {};
	$scope.smartBandData.firstName = JSON.parse(JSON.stringify($scope.data.guest_details.first_name));
	$scope.smartBandData.lastName = JSON.parse(JSON.stringify($scope.data.guest_details.last_name));

	$scope.showAddNewSmartBandScreen = false;
	$scope.isFixedAmount = false;
	$scope.showWriteToBand = false;
	$scope.showSuccess = false;
	$scope.addNewSmartband = function(){
		$scope.showAddNewSmartBandScreen = true;
	};
	$scope.setPaymentType = function(){
		$scope.isFixedAmount = !$scope.isFixedAmount;
	};
	$scope.createSmartBandFailure = function(errorMessage){
		$scope.$emit( 'hideLoader' );
		$scope.errorMessage = errorMessage;
	}; 
	$scope.createSmartBandSuccess = function(){
		$scope.$emit( 'hideLoader' );
		$scope.showSuccess = true;
	};
	
	$scope.fetchSuccessKeyRead = function(accountNumber){
		$scope.$emit( 'hideLoader' );
		var postData = {
			'first_name': $scope.smartBandData.firstName,
			'last_name': $scope.smartBandData.lastName,
			'account_number': accountNumber,
			'is_fixed': $scope.isFixedAmount
		};
		if($scope.isFixedAmount){
			postData.amount = $scope.smartBandData.fixedAmount;
		};
		var dataToApi = {
			'postData': postData,
			'reservationId':$scope.reservation.reservation_card.reservation_id,
		};
		 $scope.invokeApi(RVSmartBandSrv.createSmartBand, dataToApi, $scope.createSmartBandSuccess, $scope.createSmartBandFailure);
	};
	$scope.fetchFailedKeyRead = function(){
		$scope.$emit( 'hideLoader' );
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
			$scope.$emit( 'showLoader' );
			$scope.isFixedAmount = false;
			$scope.showWriteToBand = true;
			if(sntapp.cardSwipeDebug){
				sntapp.cardReader.retrieveUserIDDebug(options);
			}
			else{
				sntapp.cardReader.retrieveUserID(options);
			}
		}
	};
}]);
