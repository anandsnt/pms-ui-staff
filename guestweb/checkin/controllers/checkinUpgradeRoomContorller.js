/*
  Checkin Room Upgrade Ctrl 
  This displays the available rooms for upgrading.
*/
(function() {
  var checkinUpgradeRoomController = function($scope, $location, $rootScope, checkinRoomUpgradeOptionsService, checkinRoomUpgradeService, checkinDetailsService, $state, $window) {

    $scope.pageValid = false;

    if ($rootScope.isCheckedin) {
      $state.go('checkinSuccess');
    } else {
      $scope.pageValid = true;
    };

    if ($scope.pageValid) {
      $scope.slides = [];
      //set up flags related to webservice

      $scope.isFetching = false;
      $rootScope.netWorkError = false;
      var data = {
        'reservation_id': $rootScope.reservationID
      };
      $scope.isFetching = true;

      var updateGoogleAnalyticsRoomUpgradeFetchFailed = function() {
        $window.ga('send', {
          hitType: 'event',
          eventCategory: 'Zestweb Room Upgrade',
          eventAction: 'fetch failed',
          eventLabel: 'Room Upgrade Fetch Failed'
        });
      };
      checkinRoomUpgradeOptionsService.fetch(data).then(function(response) {

        $scope.isFetching = false;
        if (response.status === 'failure') {
          //$rootScope.netWorkError = true;
          //we needn't stop checkin process even if error occurs in fetching upgrades
          //in this case we go to next screen
          updateGoogleAnalyticsRoomUpgradeFetchFailed();
          $scope.noThanksClicked();
        } else {
          $window.ga('send', {
            hitType: 'event',
            eventCategory: 'Zestweb Room Upgrade',
            eventAction: 'fetch success',
            eventLabel: 'Room Upgrade Fetch success'
          });
          $scope.slides = response.data;
        }
      }, function() {
        //$rootScope.netWorkError = true;
        $scope.isFetching = false;
        //we needn't stop checkin process even if error occurs in fetching upgrades
        //in this case we go to next screen
        updateGoogleAnalyticsRoomUpgradeFetchFailed();
        $scope.noThanksClicked();
      });

      // upgrade button clicked

      $scope.upgradeClicked = function(upgradeID, roomNumber) {

        $scope.isFetching = true;
        var upgradeSelected = _.find($scope.slides, function(slide) {
          return slide.upsell_amount_id === upgradeID;
        });
        var upgradeRoomTypeId = upgradeSelected.upgrade_room_type_id;
        var data = {
          'reservation_id': $rootScope.reservationID,
          'upsell_amount_id': upgradeID,
          'room_no': roomNumber,
          'upgrade_room_type_id': upgradeRoomTypeId
        };
        var updateGoogleAnalyticsRoomUpgradeFailed = function() {
          $window.ga('send', {
            hitType: 'event',
            eventCategory: 'Zestweb Room Upgrade',
            eventAction: 'Room upgrade Failed',
            eventLabel: 'Room Upgrade failed'
          });
        };
        checkinRoomUpgradeService.post(data).then(function(response) {

          $scope.isFetching = false;
          if (response.status === "failure") {
            $rootScope.netWorkError = true;
            updateGoogleAnalyticsRoomUpgradeFailed();
          } else {
            $window.ga('send', {
              hitType: 'event',
              eventCategory: 'Zestweb Room Upgrade',
              eventAction: 'Room upgrade success',
              eventLabel: 'Room Upgrade succes'
            });
            $rootScope.upgradesAvailable = false;
            $rootScope.ShowupgradedLabel = true;
            $rootScope.roomUpgradeheading = "Your new trip details";
            checkinDetailsService.setResponseData(response.data);
            $state.go('checkinReservationDetails');
          }

        }, function() {
          $rootScope.netWorkError = true;
          $scope.isFetching = false;
          updateGoogleAnalyticsRoomUpgradeFailed();
        });


      };

      $scope.noThanksClicked = function() {
        if ($rootScope.isAutoCheckinOn) {
          $state.go('checkinArrival');
        } else {
          $state.go('checkinKeys');
        }
      };

    }
  };

  var dependencies = [
    '$scope', '$location', '$rootScope', 'checkinRoomUpgradeOptionsService', 'checkinRoomUpgradeService', 'checkinDetailsService', '$state', '$window',
    checkinUpgradeRoomController
  ];

  sntGuestWeb.controller('checkinUpgradeRoomController', dependencies);
})();

// Setup directive to compile html

sntGuestWeb.directive("description", function($compile) {
  function createList(template) {
    templ = template;
    return templ;
  }

  return {
    restrict: "E",
    scope: {},
    link: function(scope, element, attrs) {

      element.append(createList(attrs.template));
      $compile(element.contents())(scope);
    }
  };
});

// Setup directive to handle image not found case

sntGuestWeb.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  };
});