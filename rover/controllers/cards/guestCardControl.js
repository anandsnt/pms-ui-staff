sntRover.controller('RVGuestCardCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout', 'RVContactInfoSrv','RVGuestCardLoyaltySrv',
	function($scope, RVCompanyCardSrv, $timeout, RVContactInfoSrv) {
		$scope.searchMode = true;
		$scope.guestCardData.selectedLoyaltyLevel = "";
                $scope.loyaltyTabEnabled = false;

		if ($scope.reservationDetails.guestCard.id !== null && $scope.reservationDetails.guestCard.id !== "") {
			$scope.searchMode = false;
		}

		$scope.$on("guestSearchInitiated", function() {
			$scope.guestSearchIntiated = true;
			$scope.guests = $scope.searchedGuests;
			$scope.$broadcast("refreshGuestScroll");
		});

		$scope.$on("guestSearchStopped", function() {
			$scope.guestSearchIntiated = false;
			$scope.guests = [];
			$scope.$broadcast("refreshGuestScroll");
		});

		$scope.$on("guestCardDetached", function() {
			$scope.searchMode = true;
		});

		$scope.$on('guestCardAvailable', function() {
			$scope.searchMode = false;
			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 1000);
		});
                $scope.$on('detect-hlps-ffp-active-status',function(evt,data){
                    if (data.userMemberships.use_hlp || data.userMemberships.use_ffp){
                    $scope.loyaltyTabEnabled = true;
                   } else {
                    $scope.loyaltyTabEnabled = false;
                   }
                });

		$scope.$on("loyaltyLevelAvailable", function($event, level) {
			$scope.guestCardData.selectedLoyaltyLevel = level;
		});
                $scope.loyaltiesStatus = {'ffp':false,'hlps':false};
                $scope.$setLoyaltyStatus = function(data, type){
                    $scope.loyaltiesStatus[type] = data.active;
                    if ($scope.loyaltiesStatus.ffp || $scope.loyaltiesStatus.hlps){
                        $scope.loyaltyTabEnabled = true;
                    } else {
                        $scope.loyaltyTabEnabled = false;
                    }
                    if ($scope.loyaltiesStatus.hlps){
                        $scope.guestCardData.loyaltyInGuestCardEnabled = true;
                    } else {
                        $scope.guestCardData.loyaltyInGuestCardEnabled = false;
                    }
                 };

                 $scope.fetchLoyaltyStatus = function(){
                    var loyaltyFetchsuccessCallbackhlps = function(data){
                        $scope.$setLoyaltyStatus(data, 'hlps');
                            $scope.$emit('hideLoader');
                    };
                    var loyaltyFetchsuccessCallbackffp = function(data){
                        $scope.$setLoyaltyStatus(data, 'ffp');
                            $scope.$emit('hideLoader');
                    };

                    $scope.invokeApi(RVCompanyCardSrv.fetchHotelLoyaltiesHlps,{} , loyaltyFetchsuccessCallbackhlps);
                    $scope.invokeApi(RVCompanyCardSrv.fetchHotelLoyaltiesFfp,{} , loyaltyFetchsuccessCallbackffp);
                 };

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