sntRover.controller('RVContactInfoController', ['$scope', 'RVContactInfoSrv', 'ngDialog', 'dateFilter',
  function($scope, RVContactInfoSrv, ngDialog, dateFilter) {

    /**
     * storing to check if data will be updated
     */
    var presentContactInfo = JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
    presentContactInfo.birthday = JSON.parse(JSON.stringify(dateFilter($scope.guestCardData.contactInfo.birthday, 'MM-dd-yyyy')));
    $scope.errorMessage = "";

    $scope.saveContactInfo = function(newGuest) {
      var saveUserInfoSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
      };
      var saveUserInfoFailureCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
        $scope.$emit('contactInfoError', true);
      };

      var createUserInfoSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
        //TODO : Reduce all these places where guestId is kept and used to just ONE
        $scope.guestCardData.contactInfo.user_id = data.id;
        $scope.reservationDetails.guestCard.id = data.id;
        $scope.guestCardData.userId = data.id;
        $scope.showGuestPaymentList($scope.guestCardData.contactInfo);
        $scope.newGuestAdded(data.id);
        console.log("success", data);
      };
      var createUserInfoFailureCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
        console.log("failure", data);
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

      var data = {
        'data': dataToUpdate,
        'userId': $scope.guestCardData.contactInfo.user_id
      };
      if (!dataUpdated && !newGuest)
        $scope.invokeApi(RVContactInfoSrv.updateGuest, data, saveUserInfoSuccessCallback, saveUserInfoFailureCallback);
      else if (newGuest) {
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

    $scope.$parent.myScrollOptions = {
      'contact_info': {
        scrollbars: true,
        snap: false,
        hideScrollbar: false
      },
    };

    $scope.$on('CONTACTINFOLOADED', function(event) {
      setTimeout(function() {
          $scope.$parent.myScroll['contact_info'].refresh();
        },
        1500);

    });
  }
]);