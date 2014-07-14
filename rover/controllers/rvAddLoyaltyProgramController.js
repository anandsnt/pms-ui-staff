sntRover.controller('rvAddLoyaltyProgramController',['$scope','$rootScope','$filter','RVLoyaltyProgramSrv', 'ngDialog', function($scope, $rootScope,$filter, RVLoyaltyProgramSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.availableFFPS = [];
	$scope.availableHLPS = [];
	$scope.loyaltyPrograms = [{name:"Frequent Flyer Program", code:"FFP"},{name:"Hotel Loyalty Program", code:"HLP"}];
	$scope.selectedLoyaltyProgram = "";
	$scope.selectedLoyaltyType = "";
	$scope.selectedLevel = "";
	$scope.loyaltyCode = "";
	

	$scope.dimissLoaderAndDialog = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.addLoyaltyProgram = function(){
		var params = {};
		params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;		
		params.user_id = $scope.$parent.$parent.guestCardData.userId;
		params.user_membership = {};
		params.user_membership.membership_type = $scope.selectedLoyaltyType;
		params.user_membership.membership_card_number = $scope.loyaltyCode;
		params.user_membership.membership_class = $scope.selectedLoyaltyProgram;
		params.user_membership.membership_level = $scope.selectedLevel;
		$scope.newLoyalty = params.user_membership;
		var successCallbackaddLoyaltyProgram = function(data){
			$scope.newLoyalty.id = data.id;
			$scope.dimissLoaderAndDialog();
			$rootScope.$broadcast('loyaltyProgramAdded', $scope.newLoyalty, "fromReservationCard");
		};

		var errorCallbackaddLoyaltyProgram = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};

		$scope.invokeApi(RVLoyaltyProgramSrv.addLoyaltyProgram, params , successCallbackaddLoyaltyProgram, errorCallbackaddLoyaltyProgram);
	};

	$scope.getFFPS = function(){
		
		var successCallbackGetFFPS = function(data){
			$scope.setAvailableFFPS(data);
			$scope.$emit('hideLoader');
		};
		var errorCallbackGetFFPS = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		$scope.invokeApi(RVLoyaltyProgramSrv.getAvailableFFPS, "" , successCallbackGetFFPS, errorCallbackGetFFPS);

	};
	$scope.getHLPS = function(){
		
		var successCallbackGetHLPS = function(data){
			$scope.setAvailableHLPS(data);
			$scope.$emit('hideLoader');
		};
		var errorCallbackGetHLPS = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		$scope.invokeApi(RVLoyaltyProgramSrv.getAvailableHLPS, "" , successCallbackGetHLPS, errorCallbackGetHLPS);

	};

	$scope.getFFPS();
	$scope.getHLPS();

	$scope.setAvailableFFPS = function(FFPArray){
		var loyaltyType;
		for(var i=0; i < FFPArray.length; i++){
			loyaltyType = {};
			loyaltyType.name = FFPArray[i].ff_description;
			loyaltyType.code = FFPArray[i].ff_value;
			loyaltyType.levels = FFPArray[i].levels;
			$scope.availableFFPS.push(loyaltyType);
		}
	};
	$scope.setAvailableHLPS = function(HLPArray){
		var loyaltyType;
		for(var i=0; i < HLPArray.length; i++){
			loyaltyType = {};
			loyaltyType.name = HLPArray[i].hl_description;
			loyaltyType.code = HLPArray[i].hl_value;
			loyaltyType.levels = HLPArray[i].levels;
			$scope.availableHLPS.push(loyaltyType);
		}
	};
	$scope.getLoyaltyTypes = function(){
		if($scope.selectedLoyaltyProgram == $scope.loyaltyPrograms[1].code){
			return $scope.availableHLPS;
		}else{
			return $scope.availableFFPS;
		}
	};
	$scope.getLoyaltyLevels = function(){
		if($scope.selectedLoyaltyProgram == $scope.loyaltyPrograms[1].code){
			return $scope.getLoyaltyLevelsfromCode(false);
		}else{
			return $scope.getLoyaltyLevelsfromCode(true);
		} 
	};
	$scope.getLoyaltyLevelsfromCode = function(isFFP){
		var loyaltytypes = isFFP?$scope.availableFFPS:$scope.availableHLPS;
		var levels = [];
		for(var i=0; i < loyaltytypes.length; i++){
			if($scope.selectedLoyaltyType == loyaltytypes[i].code){
				levels = loyaltytypes[i].levels;
				break;
			}				 
		}
		return levels;
	};

	$scope.validate = function(){
		
	};
	
}]);