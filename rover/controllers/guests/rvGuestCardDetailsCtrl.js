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
  'idTypesList',
  'rvPermissionSrv',
  '$timeout',
  '$window',
  function($scope, contactInfo, countries, $stateParams, $state, $filter, $rootScope, RVGuestCardSrv,
    RVContactInfoSrv, RVSearchSrv, idTypesList, rvPermissionSrv, $timeout, $window) {        

        BaseCtrl.call(this, $scope);
        GuestCardBaseCtrl.call (this, $scope, RVSearchSrv, RVContactInfoSrv, rvPermissionSrv, $rootScope);

        /**
         * Decides whether loyalty tab should be shown or not
         * This event is emitted from the RVGuestCardLoyaltyController
         */
        var listener = $scope.$on('detect-hlps-ffp-active-status', function(evt, data) {
            if (data.userMemberships.use_hlp || data.userMemberships.use_ffp) {
              $scope.loyaltyTabEnabled = true;
            } else {
              $scope.loyaltyTabEnabled = false;
           }
        });

        $scope.$on('$destroy', listener);

        // Sets the loyalty level
        var loyaltyLevelListener = $scope.$on("loyaltyLevelAvailable", function($event, level) {
            $scope.guestCardData.selectedLoyaltyLevel = level;
        }); 

        $scope.$on('$destroy', loyaltyLevelListener);

        /**
         *  Removes the unwanted keys in the API request
         */
        var decloneUnwantedKeysFromContactInfo = function() {

            var unwantedKeys = ["birthday", "country",
                    "is_opted_promotion_email", "job_title",
                    "passport_expiry",
                    "passport_number", "postal_code",
                    "reservation_id", "title", "user_id",
                    "works_at", "birthday", "avatar"
                ],
                declonedData = dclone($scope.guestCardData.contactInfo, unwantedKeys);

            return declonedData;
        };     
         
        /**
         * Populate guest card details 
         * @param {object} data
         * @param {integer} guestId
         * @return {object} guestCardData
         */
        var getGuestCardData = function (data, guestId) {
            var guestCardData = {};             

            guestCardData.contactInfo = data;
            guestCardData.contactInfo.avatar = guestId ? "/assets/images/avatar-trans.png" : "";
            guestCardData.contactInfo.vip = guestId ? data.vip : "";            
            guestCardData.userId = guestId;
            guestCardData.guestId = guestId;
            guestCardData.contactInfo.birthday = guestId ? data.birthday : null;
            guestCardData.contactInfo.user_id = guestId ? guestId : "";
            guestCardData.contactInfo.guest_id = guestId ? guestId : "";

            return guestCardData;
        };


        /**
         * Handles switching of tabs with the guest card details page
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
                $scope.$broadcast('SAVELIKES', {isFromGuestCardSection: true });
            }

            if (tab === 'guest-credit') {
                $scope.$broadcast('PAYMENTSCROLL');

            } else if (tab === 'guest-like') {
                $scope.$broadcast('GUESTLIKETABACTIVE');
                $scope.$broadcast('REFRESHLIKESSCROLL');
            } else if (tab === 'guest-contact') {
                $scope.$broadcast('CONTACTINFOLOADED');
            }
            else if (tab === 'activity-log') {
                $scope.$broadcast('GUEST_ACTIVITY_LOADED');
            } else if (tab === 'guest-statistics') {
               $scope.$broadcast('LOAD_GUEST_STATISTICS'); 
            }
            
            if (!$scope.viewState.isAddNewCard) {
                $scope.current = tab;
            }
        };

        /**
         * Set navigation back to guest card search         
         */
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

                // Setting the heading and title
                $scope.heading = title;
                $scope.setTitle (title);
            };

        // Back navigation handler
        $scope.navigateBack = function () {
          $state.go('rover.guest.search', {
            textInQueryBox: $stateParams.query
          });
        };

        /**
         * Show payment list
         * @param {object} guestInfo
         * @return {undefined}
         */
        var showGuestPaymentList = function(guestInfo) {
            var userId = guestInfo.user_id,
                guestId = guestInfo.guest_id;

            var paymentSuccess = function(paymentInfo) {
                $scope.$emit('hideLoader');

                var paymentData = {
                    "data": paymentInfo,
                    "user_id": userId,
                    "guest_id": guestId
                };

                $scope.paymentData = paymentData;               
            };

            var options = {
                params: userId,
                successCallBack: paymentSuccess                
            };

            $scope.callAPI(RVGuestCardSrv.fetchGuestPaymentData, options);            
        };

        /**
         * Initialize a new guest card
         * @param {object} guestData
         * @return {undefined} 
         */
        var initGuestCard = function(guestData) {
            if (guestData.id) {
                $scope.guestCardData.userId = guestData.id;
                $scope.guestCardData.guestId = guestData.id;
                RVContactInfoSrv.setGuest(guestData.id);                
            }
        };

        // Invoke when a new guest is added
        $scope.newGuestAdded = function(id) {
            $scope.viewState.isAddNewCard = false;          
            initGuestCard({
                id: id
            });         
        };

        // Click handler for save btn in guest card header
        $scope.clickedSaveGuestCard = function() {          
            $scope.$broadcast("saveContactInfo");           
        };

        // Click handler for discard btn in guest card header
        $scope.clickedDiscardGuestCard = function() {
            $scope.viewState.isAddNewCard = false;
            $scope.navigateBack();          
        };        

        // Update contact info on blur of fields in guest card header
        $scope.updateContactInfo = function() {         
            var that = this;

            that.newUpdatedData = decloneUnwantedKeysFromContactInfo();

            var saveUserInfoSuccessCallback = function() {
                
                // update few of the details to searchSrv
                $scope.updateSearchCache();
                // This is used in contact info ctrl to prevent the extra API call while clicking outside
                $scope.isGuestCardSaveInProgress = false;
                
                // to reset current data in contcat info for determining any change
                $scope.$broadcast("RESETCONTACTINFO", that.newUpdatedData);
            };

            // check if there is any chage in data.if so call API for updating data, CICO-46709 fix
            if (JSON.stringify($scope.getContactInfo($scope.currentGuestCardHeaderData)) !== JSON.stringify($scope.getContactInfo(that.newUpdatedData))) {
                $scope.currentGuestCardHeaderData = that.newUpdatedData;
                var data = {
                    'data': $scope.currentGuestCardHeaderData,
                    'userId': $scope.guestCardData.contactInfo.user_id
                };

                if (typeof data.userId !== 'undefined' && data.userId !== '') {
                    var options = {
                        successCallBack: saveUserInfoSuccessCallback,
                        params: data
                    };

                    $scope.isGuestCardSaveInProgress = true;
                    $scope.callAPI(RVContactInfoSrv.updateGuest, options);                  
                }
            }
        };          

        /**
         *
         * Reset current data in header info for determining any change
         **/
        var resetHeaderDataListener = $scope.$on('RESETHEADERDATA', function(event, data) {
            $scope.currentGuestCardHeaderData.address = data.address;
            $scope.currentGuestCardHeaderData.phone = data.phone;
            $scope.currentGuestCardHeaderData.email = data.email;
            $scope.currentGuestCardHeaderData.first_name = data.first_name;
            $scope.currentGuestCardHeaderData.last_name = data.last_name;
        }); 

        $scope.$on('$destroy', resetHeaderDataListener);        

        var init = function () {
            $scope.viewState = {
                isAddNewCard: !$stateParams.guestId
            };

            $scope.isGuestCardFromMenu = true;

            $scope.guestCardData = getGuestCardData(contactInfo, $stateParams.guestId);
            $scope.countries = countries;
            $scope.idTypeList = idTypesList;

            var guestInfo = {
                'user_id': $scope.guestCardData.contactInfo.user_id,
                'guest_id': null
            };

            $scope.declonedData = decloneUnwantedKeysFromContactInfo();
            $scope.currentGuestCardHeaderData = $scope.declonedData;

            if (guestInfo.user_id) {
                showGuestPaymentList(guestInfo);
            }          

            $scope.guestCardData.selectedLoyaltyLevel = "";
            $scope.loyaltyTabEnabled = false;
            $scope.loyaltiesStatus = {'ffp': false, 'hlps': false};

            // This is set when navigated to staycard from statistics details page
            if ($stateParams.isBackToStatistics) {
                $scope.current = 'guest-statistics';
            } else {
                // Set contact tab as active by default
                $scope.current = 'guest-contact';
            }
            

            $scope.paymentData = {};
            setTitleAndHeading();
            setBackNavigation();  

            $scope.printState = {
                clicked: false
            };          
        };

        // Listener for setting the guestData information
        var guestCardSetListener = $scope.$on('SET_GUEST_CARD_DATA', function (event, data) {
            $scope.guestCardData.contactInfo = $scope.getUpdatedContactInfo(data.contactInfo, data.guestId);
        });

        $scope.$on('$destroy', guestCardSetListener);               
        
        // Listener to update the guest card action manage btn status
        var guestCardActionButtonStatusUpdateListener = $scope.$on('UPDATE_GUEST_CARD_ACTIONS_BUTTON_STATUS', function (event, data) {
            $scope.manageCardState.isOpen = data.status;
        });

        $scope.$on('$destroy', guestCardActionButtonStatusUpdateListener);

        // Create new reservation from the guest card
        $scope.createReservationFromGuestCard = function () {            
            $state.go('rover.reservation.search', {
                guestId: $scope.guestCardData.contactInfo.user_id
            });
        }; 

        // add the print orientation before printing
        var addPrintOrientation = function() {
            $( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
        };

        // add the print orientation after printing
        var removePrintOrientation = function() {
            $( '#print-orientation' ).remove();
        };
        
        $scope.printGuestCard = function() {
            $scope.printState.clicked = true;
            $scope.manageCardState.isOpen = false;
            
            $("header .logo").addClass('logo-hide');
            $("header .h2").addClass('text-hide');

            // add the orientation
            addPrintOrientation();

            /*
            *   ======[ READY TO PRINT ]======
            */
            // this will show the popup with full bill
            $timeout(function() {
                /*
                *   ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                */

                $window.print();
                if ( sntapp.cordovaLoaded ) {
                    cordova.exec(function() {}, function() {}, 'RVCardPlugin', 'printWebView', []);
                }
            }, 200);

            /*
            *   ======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
            */

            $timeout(function() {
                $scope.printState.clicked = false;
                // CICO-9569 to solve the hotel logo issue
                $("header .logo").removeClass('logo-hide');
                $("header .h2").addClass('text-hide');

                // remove the orientation after similar delay
                removePrintOrientation();
            }, 200);

        };
       

        init();        
}]);
