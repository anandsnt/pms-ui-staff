sntRover.controller('RVGuestCardLoyaltyController',['$scope','RVGuestCardLoyaltySrv','ngDialog',function($scope,RVGuestCardLoyaltySrv,ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.init = function(){
			
		var loyaltyFetchsuccessCallback = function(data){		
			$scope.$emit('hideLoader');
			$scope.loyaltyData = data;
			setTimeout(function(){
				$scope.refreshScroller('loyaltyList');				
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


    $scope.$on('clearNotifications',function(){
    	$scope.errorMessage ="";
    	$scope.successMessage ="";
    });
    var scrollerOptions = {click: true, preventDefault: false};
	$scope.setScroller('loyaltyList', scrollerOptions);
	$scope.$on('REFRESHLIKESSCROLL', function() {
		$scope.refreshScroller('loyaltyList');
	});

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
		/* Temperory fix. Eventhough the data is getting deleted, it is not updating the view.
		 * Assuming that array slice does not trigger watcher properly, adding a push & pop.
		 */
		if(loyaltyProgram == 'FFP'){			
			$scope.loyaltyData.userMemberships.frequentFlyerProgram.splice(index, 1);			
		}else{
			
			$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.splice(index, 1);
		}		

	});

	// TO DO: to remove below commented code
	// $scope.loyaltyProgramDeleted = function(id, index, loyaltyProgram){
		
	// 	if(typeof $scope.loyaltyData == 'undefined')
	// 		return;
	// 	/* Temperory fix. Eventhough the data is getting deleted, it is not updating the view.
	// 	 * Assuming that array slice does not trigger watcher properly, adding a push & pop.
	// 	 */
	// 	if(loyaltyProgram == 'FFP'){
			
	// 		$scope.loyaltyData.userMemberships.frequentFlyerProgram.splice(index, 1);
	// 		$scope.loyaltyData.userMemberships.frequentFlyerProgram.push({});
	// 		$scope.loyaltyData.userMemberships.frequentFlyerProgram.pop();
			
	// 	}else{
			
	// 		$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.splice(index, 1);
	// 		$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.push({});
	// 		$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.pop();
			
	// 	}		
	// };

	$scope.$on("loyaltyDeletionError",function(e,error){

            $scope.errorMessage = error;
    });
}]);