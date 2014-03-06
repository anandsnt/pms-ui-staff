
(function() {
  var checkinUpgradeRoomContorller = function($scope,$location,$rootScope,checkinRoomUpgradeService) {

// $scope.myInterval = 100;
//   var slides = $scope.slides = 
// [
//   {
//     "upgrade_room_number" : 12344444444444444444444,
//        "upsell_amount_id" : 59,
//        "upsell_amount"    : 300.0,
//        "upgrade_room_type"  : "DLK",
//        "upgrade_room_type_name" : "Standard Room Type",
//        "upgrade_room_description": "DLK",
//        "room_type_image"  : '/assets/img/hotel_pic.png',
//        "no_of_rooms"    : 1,
//        "max_adults"   : 2,
//        "max_children"   : 5
//     },
//   {
//     "upgrade_room_number" : 12344444444444444444444,
//        "upsell_amount_id" : 59,
//        "upsell_amount"    : 500.0,
//        "upgrade_room_type"  : "DLK",
//        "upgrade_room_type_name" : "Grand Suite Type",
//        "upgrade_room_description": "DLK",
//        "room_type_image"  : '/assets/img/hotel_pic.png',
//        "no_of_rooms"    : 1,
//        "max_adults"   : 4,
//        "max_children"   : 3
//     },
//      {
//     "upgrade_room_number" : 12344444444444444444444,
//        "upsell_amount_id" : 59,
//        "upsell_amount"    : 300.0,
//        "upgrade_room_type"  : "DLK",
//        "upgrade_room_type_name" : "Deluxe Room Type",
//        "upgrade_room_description": "DLK",
//        "room_type_image"  : '/assets/img/hotel_pic.png',
//        "no_of_rooms"    : 1,
//        "max_adults"   : 2,
//        "max_children"   : 1
//     },


//   ];
      
       $scope.slides = [];

       var data = {'reservation_id':$rootScope.reservationID};

       checkinRoomUpgradeService.fetch(data).then(function(response) {

            console.log(response)

            $scope.slides = response.data;
       });



      $scope.upgradeClicked = function(){
           
            $rootScope.upgradesAvailable = false;
            $rootScope.ShowupgradedLabel = true;
            $rootScope.roomUpgradeheading = "Your new Trip details";
            $location.path('/checkinReservationDetails');
      }

      $scope.noThanksClicked = function(){

           $location.path('/checkinKeys');
      }




};

    var dependencies = [
    '$scope','$location','$rootScope','checkinRoomUpgradeService',
    checkinUpgradeRoomContorller
    ];

    snt.controller('checkinUpgradeRoomContorller', dependencies);
    })();