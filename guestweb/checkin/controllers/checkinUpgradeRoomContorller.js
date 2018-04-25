/*
  Checkin Room Upgrade Ctrl 
  This displays the available rooms for upgrading.
*/
(function() {
  var checkinUpgradeRoomController = function($scope, $location, $rootScope, checkinRoomUpgradeOptionsService, checkinRoomUpgradeService, checkinDetailsService, $state) {

    $scope.pageValid = false;

    if ($rootScope.isCheckedin) {
      $state.go('checkinSuccess');
    } else {
      $scope.pageValid = true;
    }

    if ($scope.pageValid) {
      $scope.slides = [];
      // set up flags related to webservice

      $scope.isFetching = false;
      $rootScope.netWorkError = false;
      var data = {
        'reservation_id': $rootScope.reservationID
      };

      if (!$rootScope.isAutoCheckinOn) {
          data.is_checkin_now = true;
      }

      $scope.isFetching = true;

      var updateGoogleAnalyticsRoomUpgradeFetchFailed = function() {
        var params = {
          eventCategory: 'Zestweb Room Upgrade',
          eventAction: 'fetch failed',
          eventLabel: 'Room Upgrade Fetch Failed'
        };

        checkinRoomUpgradeOptionsService.sendGoogleAnalyticsEvents(params);
      };

      var setUpUpsellRoomTypeData = function(response) {
        if ($rootScope.isAutoCheckinOn) {
          $scope.slides = response.data.upsell_room_types;
        } else {
          // if checkin now, need to assign a room instantly, so assign the first room in 
          // the upgradable room type
          var roomUpgradesList = [];

          _.each(response.data.upsell_room_types, function(roomType) {
            var roomNumber = response.data.available_upgrade_rooms[roomType.upgrade_room_type_id_int][0];
            
            roomType.upgrade_room_number = roomNumber;
            roomUpgradesList.push(roomType);
          });
          $scope.slides = roomUpgradesList;
        }
      };

      checkinRoomUpgradeOptionsService.fetch(data).then(function(response) {

        $scope.isFetching = false;
        if (response.status === 'failure') {
          // $rootScope.netWorkError = true;
          // we needn't stop checkin process even if error occurs in fetching upgrades
          // in this case we go to next screen
          updateGoogleAnalyticsRoomUpgradeFetchFailed();
          $scope.noThanksClicked();
        } else {
          var params = {
            eventCategory: 'Zestweb Room Upgrade',
            eventAction: 'fetch success',
            eventLabel: 'Room Upgrade Fetch success'
          };

          checkinRoomUpgradeOptionsService.sendGoogleAnalyticsEvents(params);
          setUpUpsellRoomTypeData(response);
        }
      }, function() {
        // $rootScope.netWorkError = true;
        $scope.isFetching = false;
        // we needn't stop checkin process even if error occurs in fetching upgrades
        // in this case we go to next screen
        updateGoogleAnalyticsRoomUpgradeFetchFailed();
        $scope.noThanksClicked();
      });

      // upgrade button clicked

      $scope.upgradeClicked = function(upgradeID, roomNumber) {

        $scope.isFetching = true;
        var upgradeSelected = _.find($scope.slides, function(slide) {
          return slide.upgrade_room_type_id === upgradeID;
        });

        var upgradeRoomTypeId = upgradeSelected.upgrade_room_type_id;
        
        var data = {
          'reservation_id': $rootScope.reservationID,
          'upsell_amount_id': upgradeSelected.upsell_amount_id,
          'room_no': roomNumber,
          'upgrade_room_type_id': upgradeRoomTypeId
        };

        if (!$rootScope.isAutoCheckinOn) {
          data.upsell_room_no = roomNumber;
        }
        var updateGoogleAnalyticsRoomUpgradeFailed = function() {
          var params = {
            eventCategory: 'Zestweb Room Upgrade',
            eventAction: 'Room upgrade Failed',
            eventLabel: 'Room upgrade Failed'
          };

          checkinRoomUpgradeOptionsService.sendGoogleAnalyticsEvents(params);
        };
        
        checkinRoomUpgradeService.post(data).then(function(response) {

          $scope.isFetching = false;
          if (response.status === "failure") {
            $rootScope.netWorkError = true;
            updateGoogleAnalyticsRoomUpgradeFailed();
          } else {
            var params = {
              eventCategory: 'Zestweb Room Upgrade',
              eventAction: 'Room upgrade success',
              eventLabel: 'Room upgrade success'
            };
            
            checkinRoomUpgradeOptionsService.sendGoogleAnalyticsEvents(params);
            $rootScope.upgradesAvailable = false;
            $rootScope.isUpgradeAvailableNow = false;
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
    '$scope', '$location', '$rootScope', 'checkinRoomUpgradeOptionsService', 'checkinRoomUpgradeService', 'checkinDetailsService', '$state',
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