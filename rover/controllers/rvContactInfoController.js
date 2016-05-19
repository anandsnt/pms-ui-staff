angular.module('sntRover').controller('RVContactInfoController', ['$scope', '$rootScope', 'RVContactInfoSrv', 'ngDialog', 'dateFilter', '$timeout', 'RVSearchSrv', '$stateParams',
  function($scope, $rootScope, RVContactInfoSrv, ngDialog, dateFilter, $timeout, RVSearchSrv, $stateParams) {

    BaseCtrl.call(this, $scope);

    /**
     * storing to check if data will be updated
     */
    var presentContactInfo = JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));

    $scope.errorMessage = "";

    $scope.$on('clearNotifications', function() {
      $scope.successMessage = "";
      $scope.$emit('contactInfoError', false);
    });
    //to reset current data in contcat info for determining any change
    $scope.$on('RESETCONTACTINFO', function(event, data) {
      presentContactInfo.address = data.address;
      presentContactInfo.phone = data.phone;
      presentContactInfo.email = data.email;
      presentContactInfo.first_name = data.first_name;
      presentContactInfo.last_name = data.last_name;
    });

    $scope.saveContactInfo = function(newGuest) {
      var saveUserInfoSuccessCallback = function(data) {
        /**
         *  CICO-9169
         *  Guest email id is not checked when user adds Guest details in the Payment page of Create reservation
         *  -- To have the primary email id in app/assets/rover/partials/reservation/rvSummaryAndConfirm.html checked if the user attached has one!
         */
        $scope.reservationData.guest.email = $scope.guestCardData.contactInfo.email;
        if ($scope.reservationData.guest.email && $scope.reservationData.guest.email.length > 0) {
          $scope.otherData.isGuestPrimaryEmailChecked = true;
        } else {
          // Handles cases where Guest with email is replaced with a Guest w/o an email address!
          $scope.otherData.isGuestPrimaryEmailChecked = false;
        }
        // CICO-9169

        var avatarImage = getAvatharUrl(dataToUpdate.title);
        $scope.$emit("CHANGEAVATAR", avatarImage);
        //to reset current data in header info for determining any change
        $scope.$emit("RESETHEADERDATA", $scope.guestCardData.contactInfo);
        updateSearchCache(avatarImage);
        $scope.$emit('hideLoader');

      };

      // update guest details to RVSearchSrv via RVSearchSrv.updateGuestDetails - params: guestid, data
      var updateSearchCache = function(avatarImage) {
        var dataSource = $scope.guestCardData.contactInfo;
        var data = {
          'firstname': dataSource.first_name,
          'lastname': dataSource.last_name,
          'vip': dataSource.vip,
          'avatar': avatarImage
        };
        if (dataSource.address) {
          if ($scope.escapeNull(dataSource.address.city).toString().trim() !== '' || $scope.escapeNull(dataSource.address.state).toString().trim() !== '') {
            data.location = (dataSource.address.city + ', ' + dataSource.address.state);
          }
          else {
            data.location = false;
          }
        }
        RVSearchSrv.updateGuestDetails($scope.guestCardData.contactInfo.user_id, data);
      };

      var saveUserInfoFailureCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
        $scope.$emit('contactInfoError', true);
      };

      var createUserInfoSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
        if (typeof $scope.guestCardData.contactInfo.user_id === "undefined" || $scope.guestCardData.userId === "" || $scope.guestCardData.userId === null || typeof $scope.guestCardData.userId === 'undefined') {
          if ($scope.viewState.identifier === "STAY_CARD" || ($scope.viewState.identifier === "CREATION" && $scope.viewState.reservationStatus.confirm)) {
            $scope.viewState.pendingRemoval.status = false;
            $scope.viewState.pendingRemoval.cardType = "";
            if ($scope.reservationDetails.guestCard.futureReservations <= 0) {
              $scope.replaceCardCaller('guest', {
                id: data.id
              }, false);
            } else {
                $scope.checkFuture('guest', {
                  id: data.id
                });
            }



          }
        }
        //TODO : Reduce all these places where guestId is kept and used to just ONE
        $scope.guestCardData.contactInfo.user_id = data.id;
        $scope.reservationDetails.guestCard.id = data.id;
        $scope.reservationDetails.guestCard.futureReservations = 0;
        if ($scope.reservationData && $scope.reservationData.guest) {
          $scope.reservationData.guest.id = data.id;
          $scope.reservationData.guest.firstName = $scope.guestCardData.contactInfo.first_name;
          $scope.reservationData.guest.lastName = $scope.guestCardData.contactInfo.last_name;
          //TODO : Check if this is needed here

          $scope.reservationData.guest.loyaltyNumber = $scope.guestLoyaltyNumber;
        }
        $scope.guestCardData.userId = data.id;
        $scope.showGuestPaymentList($scope.guestCardData.contactInfo);
        $scope.newGuestAdded(data.id);
      };

      /**
       * change date format for API call
       */
      presentContactInfo = RVContactInfoSrv.completeContactInfoClone;

      var dataToUpdate = JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
      var dataUpdated = false;
      if (angular.equals(dataToUpdate, presentContactInfo)) {
        dataUpdated = true;
      } else {

        RVContactInfoSrv.completeContactInfoClone = JSON.parse(JSON.stringify(dataToUpdate));
        //change date format to be send to API
        dataToUpdate.birthday = JSON.parse(JSON.stringify(dateFilter($scope.guestCardData.contactInfo.birthday, 'MM-dd-yyyy')));
        var unwantedKeys = ["avatar"]; // remove unwanted keys for API
        dataToUpdate = dclone(dataToUpdate, unwantedKeys);
      };

      if (typeof dataToUpdate.address === "undefined") {
        dataToUpdate.address = {};
      }

      var data = {
        'data': dataToUpdate,
        'userId': $scope.guestCardData.contactInfo.user_id
      };
      if (!dataUpdated && !newGuest) {
        $scope.invokeApi(RVContactInfoSrv.updateGuest, data, saveUserInfoSuccessCallback, saveUserInfoFailureCallback);
      } else if (newGuest) {
        if (typeof data.data.is_opted_promotion_email === 'undefined') {
          data.data.is_opted_promotion_email = false;
        }
        $scope.invokeApi(RVContactInfoSrv.createGuest, data, createUserInfoSuccessCallback);
      }
    };

    /**
     * watch and update formatted date for display
     */
    $scope.$watch('guestCardData.contactInfo.birthday', function() {
      $scope.birthdayText = JSON.parse(JSON.stringify(dateFilter($scope.guestCardData.contactInfo.birthday, $rootScope.dateFormat)));
    });
    /**
     * to handle click actins outside this tab
     */
    $scope.$on('saveContactInfo', function() {
      $scope.errorMessage = "";
      if ((!$scope.reservationData.guest.id && !$scope.reservationData.guest.id && !$scope.guestCardData.contactInfo.user_id) || $scope.viewState.isAddNewCard) {
        $scope.saveContactInfo(true);
      } else {
        $scope.saveContactInfo();
      }
    });

    //Error popup
    $scope.$on('showSaveMessage', function() {
      $scope.errorMessage = ['Please save the Guest Card first'];
    });

    $scope.popupCalendar = function() {
      ngDialog.open({
        template: '/assets/partials/guestCard/contactInfoCalendarPopup.html',
        controller: 'RVContactInfoDatePickerController',
        className: 'single-date-picker',
        scope: $scope
      });
    };

    $scope.setScroller('contact_info');

    var refreshContactsScroll = function() {
      $timeout(function() {
        $scope.refreshScroller('contact_info');
      }, 700);
    };
    $scope.$on('CONTACTINFOLOADED', refreshContactsScroll);
    $scope.$on('REFRESHLIKESSCROLL', refreshContactsScroll);

    var successCallBackForLanguagesFetch = function(data) {
      $scope.$emit('hideLoader');
      $scope.languageData = data;
    };

    /**
     * Fetch the guest languages list and settings
     * @return {undefined}
     */
    var fetchGuestLanguages = function() {
      // call api
      $scope.invokeApi(RVContactInfoSrv.fetchGuestLanguages, {},
        successCallBackForLanguagesFetch);
    };

    var init = function() {
      // Fetch languages
      fetchGuestLanguages();
    };

    init();
  }
]);