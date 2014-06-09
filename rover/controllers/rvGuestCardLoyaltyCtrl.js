sntRover.controller('RVGuestCardLoyaltyController',['$scope','RVGuestCardLoyaltySrv','ngDialog',function($scope,RVGuestCardLoyaltySrv,ngDialog){
	
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
		$scope.invokeApi(RVGuestCardLoyaltySrv.fetchLoyalties,data , loyaltyFetchsuccessCallback, loyaltyFetchErrorCallback);
	};

	$scope.init();
	
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
	};
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
	
}]);