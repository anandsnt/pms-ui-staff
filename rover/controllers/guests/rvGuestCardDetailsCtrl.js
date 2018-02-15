angular.module('sntRover').controller('rvGuestDetailsController',
 [
  '$scope',
  'contactInfo',
  'countries',
  '$stateParams',
  '$state',
  '$filter',
  '$rootScope',
  function($scope, contactInfo, countries, $stateParams, $state, $filter, $rootScope) {		

		BaseCtrl.call(this, $scope);

		$scope.$on('detect-hlps-ffp-active-status', function(evt, data) {
            if (data.userMemberships.use_hlp || data.userMemberships.use_ffp) {
            $scope.loyaltyTabEnabled = true;
           } else {
            $scope.loyaltyTabEnabled = false;
           }
        });

        $scope.$on("loyaltyLevelAvailable", function($event, level) {
			$scope.guestCardData.selectedLoyaltyLevel = level;
		});

        $scope.$setLoyaltyStatus = function(data, type) {
            $scope.loyaltiesStatus[type] = data.active;
            if ($scope.loyaltiesStatus.ffp || $scope.loyaltiesStatus.hlps) {
                $scope.loyaltyTabEnabled = true;
            } else {
                $scope.loyaltyTabEnabled = false;
            }
            if ($scope.loyaltiesStatus.hlps) {
                $scope.guestCardData.loyaltyInGuestCardEnabled = true;
            } else {
                $scope.guestCardData.loyaltyInGuestCardEnabled = false;
            }
         };

         $scope.fetchLoyaltyStatus = function() {
            var loyaltyFetchsuccessCallbackhlps = function(data) {
                $scope.$setLoyaltyStatus(data, 'hlps');
                    $scope.$emit('hideLoader');
            };
            var loyaltyFetchsuccessCallbackffp = function(data) {
                $scope.$setLoyaltyStatus(data, 'ffp');
                    $scope.$emit('hideLoader');
            };

            $scope.invokeApi(RVCompanyCardSrv.fetchHotelLoyaltiesHlps, {}, loyaltyFetchsuccessCallbackhlps);
            $scope.invokeApi(RVCompanyCardSrv.fetchHotelLoyaltiesFfp, {}, loyaltyFetchsuccessCallbackffp);
         };

		var getGuestCardData = function (data, countries, guestId) {
			var guestCardData = {};			    

			guestCardData.contactInfo = data;
            guestCardData.contactInfo.avatar = "/assets/images/avatar-trans.png";
            guestCardData.contactInfo.vip = data.vip;            
            guestCardData.userId = guestId;
            guestCardData.guestId = guestId;
            guestCardData.contactInfo.birthday = data.birthday;
            guestCardData.contactInfo.user_id = guestId;
            guestCardData.contactInfo.guest_id = guestId;

            return guestCardData;
		};

		/**
		 * Tab actions
		 */
		$scope.guestCardTabSwitch = function(tab) {
			if ($scope.current === 'guest-contact' && tab !== 'guest-contact') {
				if ($scope.isAddMode) {
					$scope.$broadcast("showSaveMessage");
				} else {
					$scope.$broadcast('saveContactInfo');
				}
			}
			if ($scope.current === 'guest-like' && tab !== 'guest-like') {
				$scope.$broadcast('SAVELIKES');

			}
			if (tab === 'guest-credit') {
				$scope.$broadcast('PAYMENTSCROLL');
			} else if (tab === 'guest-like') {
				$scope.$broadcast('GUESTLIKETABACTIVE');
			}

			$scope.$broadcast('REFRESHLIKESSCROLL');
			if (!$scope.viewState.isAddNewCard) {
				$scope.current = tab;
			}
		};



		var setBackNavigation = function() {
	            $rootScope.setPrevState = {
	                title: $filter('translate')('FIND GUESTS'),
	                callback: 'navigateBack',
	                scope: $scope
	            };           
            
        	},
        	setTitleAndHeading = function () {
        		var title = $filter('translate')('GUEST_CARD');

	            // we are changing the title if we are in Add Mode
	            if ($scope.viewState.isAddNewCard) {
	                title = $filter('translate')('NEW_GUEST');
	            }

	            // yes, we are setting the headting and title
	            $scope.heading = title;
	            $scope.setTitle (title);
        	};

        // Back navigation handler
        $scope.navigateBack = function () {
		  $state.go('rover.guestcardsearch');
		};


		var init = function () {
			$scope.guestCardData = getGuestCardData(contactInfo, countries, $stateParams.guestId);
			$scope.countries = countries;
			$scope.idTypeList = $scope.guestCardData.contactInfo.id_type_list;

			$scope.guestCardData.selectedLoyaltyLevel = "";
            $scope.loyaltyTabEnabled = false;
            $scope.loyaltiesStatus = {'ffp': false, 'hlps': false};

			// Set contact tab as active by default
			$scope.current = 'guest-contact';			

			$scope.viewState = {
				isAddNewCard : !$stateParams.guestId
			};

			setTitleAndHeading();
			setBackNavigation();
            
		};

		init();
		
}]);
