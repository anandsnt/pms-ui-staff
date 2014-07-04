sntRover.controller('RVGuestCardLoyaltyController',['$scope','RVGuestCardLoyaltySrv','ngDialog',function($scope,RVGuestCardLoyaltySrv,ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.init = function(){
			
		var loyaltyFetchsuccessCallback = function(data){		
			$scope.$emit('hideLoader');
			$scope.loyaltyData = data;
			setTimeout(function(){
				$scope.$parent.myScroll['loyaltyList'].refresh();
				}, 
			3000);
		};

		var loyaltyFetchErrorCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};

		var data = {'userID':$scope.$parent.guestCardData.userId};
		$scope.invokeApi(RVGuestCardLoyaltySrv.fetchLoyalties,data , loyaltyFetchsuccessCallback, loyaltyFetchErrorCallback, 'NONE');
	};
	$scope.$watch(
        function() { return ($scope.$parent.$parent.guestCardData.userId != '')?true:false; },
        function(gustDataReady) { if(gustDataReady)$scope.init(); }
    );
	
	$scope.$parent.myScrollOptions = {		
	    'loyaltyList': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    },
	};

	$scope.addNewFreaquentLoyality =  function(){
		 ngDialog.open({
                  template: '/assets/partials/guestCard/rvGuestCardaddFreaquentLoyaltyPopup.html',
                  controller: 'RVAddNewFreaquentLoyaltyContrller',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
	};

	$scope.addNewHotelLoyality =  function(){
		 ngDialog.open({
                  template: '/assets/partials/guestCard/rvGuestCardaddHotelLoyaltyPopup.html',
                  controller: 'RVAddNewHotelLoyaltyController',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
	};
	$scope.showDeleteModal =  function(id, index, loyaltyProgram){
		$scope.loaytyID = id;
		$scope.loyaltyIndexToDelete = index;
		$scope.loyaltyProgramToDelete = loyaltyProgram;
		 ngDialog.open({
                  template: '/assets/partials/guestCard/rvGuestCardDeleteLoyaltyModal.html',
                  controller: 'rvDeleteLoyaltyModalController',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
	};
	$scope.$on("loyaltyProgramAdded",function(e, data, source){

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
	$scope.$on("loyaltyProgramDeleted",function(e,id, index, loyaltyProgram){

		if(typeof $scope.loyaltyData == 'undefined')
			return;
		else{			
				if(loyaltyProgram == 'FFP'){
					console.log("guest FFP Length---" + $scope.loyaltyData.userMemberships.frequentFlyerProgram.length);
					$scope.loyaltyData.userMemberships.frequentFlyerProgram.splice(index, 1);
					console.log("guest FFP Length---" + $scope.loyaltyData.userMemberships.frequentFlyerProgram.length);
				}else{
					console.log("guest HLP Length---" + $scope.loyaltyData.userMemberships.hotelLoyaltyProgram.length);
					$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.splice(index, 1);
					console.log("guest HLP Length---" + $scope.loyaltyData.userMemberships.hotelLoyaltyProgram.length);
				}			
		}
        	
	});
	$scope.$on("loyaltyDeletionError",function(e,error){

            $scope.errorMessage = error;
    });
	$scope.removeLoyaltyWithID = function(id){
		var hotelLoyaltyPrograms = $scope.loyaltyData.userMemberships.hotelLoyaltyProgram;
		var frequentFlyerPrograms = $scope.loyaltyData.userMemberships.frequentFlyerProgram;
		for(var i = 0; i < hotelLoyaltyPrograms.length; i++){
			if(id == hotelLoyaltyPrograms[i].id){
				$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.splice(i, 1);
				$scope.$apply();
				return;
			}
		}		
		for(var i = 0; i < frequentFlyerPrograms.length; i++){
			if(id == frequentFlyerPrograms[i].id){
				$scope.loyaltyData.userMemberships.frequentFlyerProgram.splice(i, 1);
				$scope.$apply();
				return;
			}
		}
	};
}]);