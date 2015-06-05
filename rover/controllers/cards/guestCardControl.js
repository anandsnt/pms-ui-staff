sntRover.controller('RVGuestCardCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout', 'RVContactInfoSrv',
	function($scope, RVCompanyCardSrv, $timeout, RVContactInfoSrv) {
		$scope.searchMode = true;
		$scope.guestCardData.selectedLoyaltyLevel = "";
                $scope.loyaltyTabEnabled = true;

		if ($scope.reservationDetails.guestCard.id != null && $scope.reservationDetails.guestCard.id != "") {
			$scope.searchMode = false;
		}

		$scope.$on("guestSearchInitiated", function() {
                        $scope.fetchLoyaltyStatus();
			$scope.guestSearchIntiated = true;
			$scope.guests = $scope.searchedGuests;
			$scope.$broadcast("refreshGuestScroll");
		})

		$scope.$on("guestSearchStopped", function() {
			$scope.guestSearchIntiated = false;
			$scope.guests = [];
			$scope.$broadcast("refreshGuestScroll");
		})

		$scope.$on("guestCardDetached", function() {
			$scope.searchMode = true;
		});

		$scope.$on('guestCardAvailable', function() {
			$scope.searchMode = false;
			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 1000);
		});

		$scope.$on("loyaltyLevelAvailable", function($event, level) {
			$scope.guestCardData.selectedLoyaltyLevel = level;
		});
                
                
                $scope.$setLoyaltyStatus = function(data){
                    if (data.active){
                        $scope.guestCardData.loyaltyInGuestCardEnabled = true;
                    } else {
                        $scope.guestCardData.loyaltyInGuestCardEnabled = false;
                    }
                    
                    
                 };
                 $scope.fetchLoyaltyStatus = function(){
                    var loyaltyFetchsuccessCallback = function(data){
                        $scope.$setLoyaltyStatus(data);
                            $scope.$emit('hideLoader');
                    };

                    $scope.invokeApi(RVCompanyCardSrv.fetchHotelLoyalties,{} , loyaltyFetchsuccessCallback);
                 };
                 
                $scope.$on('detect-hlps-ffp-active-status',function(evt,data){
                    if (data.userMemberships.use_hlp || data.userMemberships.use_ffp){
                        $scope.loyaltyTabEnabled = true;
                    } else {
                        $scope.loyaltyTabEnabled = false;
                    }

                });
                 
                 
                 
	}
]);

sntRover.controller('guestResults', ['$scope', '$timeout',
	function($scope, $timeout) {

		BaseCtrl.call(this, $scope);
		var scrollerOptionsForGraph = {scrollX: true, click: true, preventDefault: false};
  		$scope.setScroller ('guestResultScroll', scrollerOptionsForGraph);

		$scope.$on("refreshGuestScroll", function() {
			$timeout(function() {
				$scope.refreshScroller('guestResultScroll');	
			}, 500);
		});
	}
]);