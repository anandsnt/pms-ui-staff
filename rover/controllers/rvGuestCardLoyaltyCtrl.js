sntRover.controller('RVGuestCardLoyaltyController',['$scope','$rootScope','RVGuestCardLoyaltySrv','ngDialog',function($scope,$rootScope,RVGuestCardLoyaltySrv,ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.init = function(){
		var loyaltyFetchsuccessCallback = function(data){
			$scope.$emit('hideLoader');
                        $rootScope.$broadcast('detect-hlps-ffp-active-status',data);
			$scope.loyaltyData = data;
			$scope.checkForHotelLoyaltyLevel();
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
        $scope.reloadOnSet = false;
        if ($scope.reloadOnSet){
            $rootScope.$on('reload-loyalty-section-data',function(evt,data){
                $scope.init();//reload loyalty when switching through staycards
            });
            $scope.reloadOnSet = true;
        }

	$scope.$watch(
		function() { return ($scope.$parent.$parent.guestCardData.userId !== '')?true:false; },
		function(gustDataReady) { if(gustDataReady)$scope.init(); }
		);


/*
* To check for the loyalty levels in hotel loyalty section for the guest
* and notify the guestcard header to display the same
*/
$rootScope.$on('reload-loyalty-section-data',function(evt,data){
    if (data){
        if (data.reload){
            if ($rootScope.goToReservationCalled){
                $scope.init();//reload loyalty when switching through staycards
                $rootScope.goToReservationCalled = false;
            }
        }
    }
});

$scope.checkForHotelLoyaltyLevel = function(){
    if ($scope.$parent.$parent.guestCardData.use_hlp){
	for(var i = 0; i < $scope.loyaltyData.userMemberships.hotelLoyaltyProgram.length; i++){
		if($scope.loyaltyData.userMemberships.hotelLoyaltyProgram.membership_level !== ""){
			$scope.$emit('loyaltyLevelAvailable', $scope.loyaltyData.userMemberships.hotelLoyaltyProgram[i].membership_level);
			break;
		}
	}
    }
};


$scope.$on('clearNotifications',function(){
	$scope.errorMessage ="";
	$scope.successMessage ="";
});
var scrollerOptions = { preventDefault: false};
$scope.setScroller('loyaltyList', scrollerOptions);
$scope.$on('REFRESHLIKESSCROLL', function() {
	$scope.refreshScroller('loyaltyList');
});

$scope.addNewFreaquentLoyality =  function(){
	ngDialog.open({
		template: '/assets/partials/guestCard/rvGuestCardaddFreaquentLoyaltyPopup.html',
		controller: 'RVAddNewFreaquentLoyaltyContrller',
		className: '',
		scope: $scope
	});

};

$scope.addNewHotelLoyality =  function(){

	ngDialog.open({
		template: '/assets/partials/guestCard/rvGuestCardaddHotelLoyaltyPopup.html',
		controller: 'RVAddNewHotelLoyaltyController',
		className: '',
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

	if(typeof $scope.loyaltyData === 'undefined')
		return;
	else{
		if(data.membership_class === "HLP"){
			$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.push(data);
		}else{
			$scope.loyaltyData.userMemberships.frequentFlyerProgram.push(data);
		}
	}

});

$scope.loyaltyProgramDeleted = function(id, index, loyaltyProgram){
	if(typeof $scope.loyaltyData === 'undefined')
		return;

	if(loyaltyProgram === 'FFP'){
		$scope.loyaltyData.userMemberships.frequentFlyerProgram.splice(index, 1);
	}else{
		$scope.loyaltyData.userMemberships.hotelLoyaltyProgram.splice(index, 1);
	}
};

$scope.$on("loyaltyDeletionError",function(e,error){
	$scope.$parent.myScroll['loyaltyList'].scrollTo(0,0);
	$scope.errorMessage = error;
});

        $scope.$on('detect-hlps-ffp-active-status',function(evt,data){
           if (data.userMemberships.use_hlp){
               $scope.loyaltyProgramsActive(true);
               $scope.$parent.guestCardData.use_hlp = true;
           } else {
               $scope.loyaltyProgramsActive(false);
               $scope.$parent.guestCardData.use_hlp = false;
           }


           if (data.userMemberships.use_ffp){
               $scope.ffpProgramsActive(true);
               $scope.$parent.guestCardData.use_ffp = true;
           } else {
               $scope.ffpProgramsActive(false);
               $scope.$parent.guestCardData.use_ffp = false;
           }


        });

        $scope.loyaltyProgramsActive = function(b){
          $scope.hotelLoyaltyProgramEnabled = b;
          $scope.$parent.guestCardData.use_ffp = b;
        };
        $scope.ffpProgramsActive = function(b){
          $scope.hotelFrequentFlyerProgramEnabled = b;
          $scope.$parent.guestCardData.use_ffp = b;
        };


}]);