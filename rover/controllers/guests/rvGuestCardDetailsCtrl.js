angular.module('sntRover').controller('rvGuestDetailsController',
 [
  '$scope',
  'contactInfo',
  'countries',
  '$stateParams',
  '$state',
  '$filter',
  '$rootScope',
  'RVGuestCardSrv',
  'RVContactInfoSrv',
  'RVSearchSrv',
  function($scope, contactInfo, countries, $stateParams, $state, $filter, $rootScope, RVGuestCardSrv,
  	RVContactInfoSrv, RVSearchSrv) {		

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
            guestCardData.contactInfo.avatar = !!guestId ? "/assets/images/avatar-trans.png" : "";
            guestCardData.contactInfo.vip = !!guestId ? data.vip : "";            
            guestCardData.userId = guestId;
            guestCardData.guestId = guestId;
            guestCardData.contactInfo.birthday = !!guestId ? data.birthday : null;
            guestCardData.contactInfo.user_id = !!guestId ? guestId : "";
            guestCardData.contactInfo.guest_id = !!guestId ? guestId : "";

            return guestCardData;
		};

		/**
		 * Tab actions
		 */
		$scope.guestCardTabSwitch = function(tab) {
			if ($scope.current === 'guest-contact' && tab !== 'guest-contact') {
				if ($scope.viewState.isAddNewCard) {
					$scope.$broadcast("showSaveMessage");
				} else {
					$scope.$broadcast('saveContactInfo');
				}
			}
			if ($scope.current === 'guest-like' && tab !== 'guest-like') {
				$scope.$broadcast('SAVELIKES', {isFromGuestCardSection : true });

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

		$scope.showGuestPaymentList = function(guestInfo) {
			var userId = guestInfo.user_id,
				guestId = guestInfo.guest_id;
			var paymentSuccess = function(paymentData) {
				$scope.$emit('hideLoader');

				var paymentData = {
					"data": paymentData,
					"user_id": userId,
					"guest_id": guestId
				};

				$scope.paymentData = paymentData;				
			};

			$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, userId, paymentSuccess, '', 'NONE');
		};

		$scope.newGuestAdded = function(id) {
			$scope.viewState.isAddNewCard = false;			
			$scope.initGuestCard({
				id: id
			});			
		};

		$scope.initGuestCard = function(guestData) {
			if (!!guestData.id) {
                $scope.guestCardData.userId = guestData.id;
                $scope.guestCardData.guestId = guestData.id;
                RVContactInfoSrv.setGuest(guestData.id);                
            }
		};

		$scope.clickedSaveGuestCard = function() {			
			$scope.$broadcast("saveContactInfo");			
		};

		$scope.clickedDiscardGuestCard = function() {
			$scope.viewState.isAddNewCard = false;
		};

		// Get the contact details object with the required properties only
		var getContactInfo = function (contactInfo) {
			var whiteListedKeys = ['first_name', 'last_name', 'mobile', 'phone', 'email', 'vip'],
			    contactDetails = _.pick(contactInfo, whiteListedKeys);

			contactDetails.address = {
				state: contactInfo.address && contactInfo.address.state ? contactInfo.address.state : "",
				city: contactInfo.address && contactInfo.address.city ? contactInfo.address.city : ""
			};

			return contactDetails;
		};

		// update guest details to RVSearchSrv via RVSearchSrv.updateGuestDetails - params: guestid, data
		var updateSearchCache = function() {
			var dataSource = $scope.guestCardData.contactInfo;
			var data = {
				'firstname': dataSource.first_name,
				'lastname': dataSource.last_name,
				'vip': dataSource.vip
			};

			if (dataSource.address) {
				if ($scope.escapeNull(dataSource.address.city).toString().trim() !== '' || $scope.escapeNull(dataSource.address.state).toString().trim() !== '') {
					data.location = (dataSource.address.city + ', ' + dataSource.address.state);
				} else {
					data.location = false;
				}
			}
			RVSearchSrv.updateGuestDetails($scope.guestCardData.contactInfo.user_id, data);
		};

		$scope.updateContactInfo = function() {			
			var that = this;

			that.newUpdatedData = $scope.decloneUnwantedKeysFromContactInfo();
			var saveUserInfoSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				// update few of the details to searchSrv
				updateSearchCache();
				// This is used in contact info ctrl to prevent the extra API call while clicking outside
				$scope.isGuestCardSaveInProgress = false;
				
				// to reset current data in contcat info for determining any change
				$scope.$broadcast("RESETCONTACTINFO", that.newUpdatedData);
			};

			// check if there is any chage in data.if so call API for updating data, CICO-46709 fix
			if (JSON.stringify(getContactInfo($scope.currentGuestCardHeaderData)) !== JSON.stringify(getContactInfo(that.newUpdatedData))) {
				$scope.currentGuestCardHeaderData = that.newUpdatedData;
				var data = {
					'data': $scope.currentGuestCardHeaderData,
					'userId': $scope.guestCardData.contactInfo.user_id
				};

				if (typeof data.userId !== 'undefined') {
					$scope.isGuestCardSaveInProgress = true;
					$scope.invokeApi(RVContactInfoSrv.updateGuest, data, saveUserInfoSuccessCallback);
				}
			}
		};

		/**
		 *  API call needs only rest of keys in the data
		 */
		$scope.decloneUnwantedKeysFromContactInfo = function() {

			var unwantedKeys = ["birthday", "country",
				"is_opted_promotion_email", "job_title",
				"passport_expiry",
				"passport_number", "postal_code",
				"reservation_id", "title", "user_id",
				"works_at", "birthday", "avatar"
			];
			var declonedData = dclone($scope.guestCardData.contactInfo, unwantedKeys);

			return declonedData;
		};	

		/**
		 *
		 *to reset current data in header info for determining any change
		 **/
		$scope.$on('RESETHEADERDATA', function(event, data) {
			$scope.currentGuestCardHeaderData.address = data.address;
			$scope.currentGuestCardHeaderData.phone = data.phone;
			$scope.currentGuestCardHeaderData.email = data.email;
			$scope.currentGuestCardHeaderData.first_name = data.first_name;
			$scope.currentGuestCardHeaderData.last_name = data.last_name;
		});	
		


		var init = function () {
			$scope.viewState = {
				isAddNewCard : !$stateParams.guestId
			};
			$scope.guestCardData = getGuestCardData(contactInfo, countries, $stateParams.guestId);
			$scope.countries = countries;
			$scope.idTypeList = $scope.guestCardData.contactInfo.id_type_list;

			var guestInfo = {
                'user_id': $scope.guestCardData.contactInfo.user_id,
                'guest_id': null
            };

            $scope.declonedData = $scope.decloneUnwantedKeysFromContactInfo();
			$scope.currentGuestCardHeaderData = $scope.declonedData;

            if (!!guestInfo.user_id) {
            	$scope.showGuestPaymentList(guestInfo);
            }          

			$scope.guestCardData.selectedLoyaltyLevel = "";
            $scope.loyaltyTabEnabled = false;
            $scope.loyaltiesStatus = {'ffp': false, 'hlps': false};

			// Set contact tab as active by default
			$scope.current = 'guest-contact';			

			

			$scope.paymentData = {};

			setTitleAndHeading();
			setBackNavigation();
            
		};

		init();
		
}]);
