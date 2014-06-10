sntRover.controller('RVGuestCardLoyaltyController',['$scope','RVGuestCardLoyaltySrv','ngDialog',function($scope,RVGuestCardLoyaltySrv,ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.init = function(){
			
		var loyaltyFetchsuccessCallback = function(data){		
			$scope.$emit('hideLoader');
			$scope.loyaltyData = data;
			// alert("ef");
			// console.log(data)
		};

		var loyaltyFetchErrorCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};

		var data = {'userID':$scope.$parent.guestCardData.userId};
		$scope.invokeApi(RVGuestCardLoyaltySrv.fetchLoyalties,data , loyaltyFetchsuccessCallback, loyaltyFetchErrorCallback);
	};

	$scope.init();


	$scope.addNewFreaquentLoyality =  function(){
		 ngDialog.open({
                  template: '/assets/partials/guestCard/guestCardaddFreaquentLoyaltyPopup.html',
                  controller: 'RVAddNewFreaquentLoyaltyContrller',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
	};

	$scope.addNewHotelLoyality =  function(){
		 ngDialog.open({
                  template: '/assets/partials/guestCard/guestCardaddHotelLoyaltyPopup.html',
                  controller: 'RVAddNewHotelLoyaltyController',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
	}
	$scope.showDeleteModel =  function(id){
		$scope.loaytyID = id;
		 ngDialog.open({
                  template: '/assets/partials/guestCard/guestCardDeleteLoyaltyModal.html',
                  controller: 'rvDeleteLoyaltyModalController',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
	}
	$scope.$on("loyaltyProgramAdded",function(e,data){

		if(typeof $scope.loyaltyData == 'undefined')
			return;
		else{
			if(data.membership_class == "HLP"){
        		$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.push(data);
        	}else{
        		$scope.loyaltyData.userMemberships.frequentFlyerProgram.push(data);
        	}
		}
        	
	});
	$scope.$on("loyaltyProgramDeleted",function(e,id){

		if(typeof $scope.loyaltyData == 'undefined')
			return;
		else{
			$scope.removeLoyaltyWithID(id);
		}
        	
	});
	$scope.$on("loyaltyDeletionError",function(e,error){

            $scope.errorMessage = error;
    });
	$scope.removeLoyaltyWithID = function(id){
		var pos = "";
		var hotelLoyaltyPrograms = $scope.loyaltyData.userMemberships.hotelLoyaltyProgram;
		var frequentFlyerPrograms = $scope.loyaltyData.userMemberships.frequentFlyerProgram;
		for(var i = 0; i < hotelLoyaltyPrograms.length; i++){
			if(id == hotelLoyaltyPrograms[i].id){
				pos = i;
				break;
			}
		}
		if(pos != ""){
			$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.splice(pos, 1);
			return;
		}
		for(var i = 0; i < frequentFlyerPrograms.length; i++){
			if(id == frequentFlyerPrograms[i].id){
				pos = i;
				break;
			}
		}
		if(pos != ""){
			$scope.loyaltyData.userMemberships.frequentFlyerProgram.splice(pos, 1);
			return;
		}
	};
}]);