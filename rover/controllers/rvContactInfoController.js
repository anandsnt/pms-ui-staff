sntRover.controller('RVContactInfoController', ['$scope', 'RVContactInfoSrv', 'ngDialog', 'dateFilter',
  function($scope, RVContactInfoSrv, ngDialog, dateFilter) {
    BaseCtrl.call(this, $scope);
    /**
     * storing to check if data will be updated
     */
    var presentContactInfo = JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
    presentContactInfo.birthday = JSON.parse(JSON.stringify(dateFilter($scope.guestCardData.contactInfo.birthday, 'MM-dd-yyyy')));
    $scope.errorMessage = "";

    $scope.$on('clearNotifications', function() {
      $scope.successMessage = "";
      $scope.$emit('contactInfoError', false);
    });

    $scope.saveContactInfo = function(newGuest) {
      var saveUserInfoSuccessCallback = function(data) {
        var avatarImage = getAvatharUrl(dataToUpdate.title);
        $scope.$emit("CHANGEAVATAR", avatarImage);
        $scope.$emit('hideLoader');

      };
      var saveUserInfoFailureCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
        $scope.$emit('contactInfoError', true);
      };

      var createUserInfoSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
        if (typeof $scope.guestCardData.contactInfo.user_id == "undefined" || $scope.guestCardData.userId == "" || $scope.guestCardData.userId == null || typeof $scope.guestCardData.userId == 'undefined') {
          if ($scope.viewState.identifier == "STAY_CARD" || ($scope.viewState.identifier == "CREATION" && $scope.viewState.reservationStatus.confirm)) {
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
            // $scope.replaceCard('guest', {
            //   id: data.id
            // }, false);
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
          // $scope.reservationData.guest.city = $scope.guestCardData.contactInfo.address.city;
          $scope.reservationData.guest.loyaltyNumber = $scope.guestLoyaltyNumber;
        }
        $scope.guestCardData.userId = data.id;
        $scope.showGuestPaymentList($scope.guestCardData.contactInfo);
        $scope.newGuestAdded(data.id);
      };
      var createUserInfoFailureCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
      };

      /**
       * change date format for API call
       */
      var dataToUpdate = JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
      dataToUpdate.birthday = $scope.birthdayText;
      var dataUpdated = false;
      if (angular.equals(dataToUpdate, presentContactInfo)) {
        dataUpdated = true;
      } else {
        presentContactInfo = dataToUpdate;
        var unwantedKeys = ["avatar", "vip"]; // remove unwanted keys for API
        dataToUpdate = dclone(dataToUpdate, unwantedKeys);
      };

      if (typeof dataToUpdate.address == "undefined") {
        dataToUpdate.address = {};
      }

      var data = {
        'data': dataToUpdate,
        'userId': $scope.guestCardData.contactInfo.user_id
      };
      if (!dataUpdated && !newGuest)
        $scope.invokeApi(RVContactInfoSrv.updateGuest, data, saveUserInfoSuccessCallback, saveUserInfoFailureCallback);
      else if (newGuest) {
        if (typeof data.data.is_opted_promotion_email == 'undefined') {
          data.data.is_opted_promotion_email = false;
        }
        $scope.invokeApi(RVContactInfoSrv.createGuest, data, createUserInfoSuccessCallback, createUserInfoFailureCallback);
      }
    };

    /**
     * watch and update formatted date for display
     */
    $scope.$watch('guestCardData.contactInfo.birthday', function() {
      $scope.birthdayText = JSON.parse(JSON.stringify(dateFilter($scope.guestCardData.contactInfo.birthday, 'MM-dd-yyyy')));
    });
    /**
     * to handle click actins outside this tab
     */
    $scope.$on('saveContactInfo', function() {
      $scope.errorMessage = "";
      if (typeof $scope.guestCardData.contactInfo.user_id == "undefined" || $scope.guestCardData.userId == "" || $scope.guestCardData.userId == null || typeof $scope.guestCardData.userId == 'undefined') {
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
        className: 'ngdialog-theme-default single-date-picker',
        closeByDocument: true,
        scope: $scope
      });
    };
    var scrollerOptions = {
      click: true
      // preventDefault: false
    };
    $scope.setScroller('contact_info', scrollerOptions);

    $scope.$on('CONTACTINFOLOADED', function(event) {
      setTimeout(function() {
          $scope.refreshScroller('contact_info');

        },
        1500);
      $scope.$on('REFRESHLIKESSCROLL', function() {
        $scope.refreshScroller('contact_info');
      });
    });
  }
]);