
(function() {
  var checkinUpgradeRoomContorller = function($scope,$location,$rootScope,checkinRoomUpgradeOptionsService,checkinRoomUpgradeService) {

      
       $scope.slides = [];


       //set up flags related to webservice

      $scope.isFetching     = false;
      $rootScope.netWorkError  = false;


       var data = {'reservation_id':$rootScope.reservationID};


       $scope.isFetching          = true;

       checkinRoomUpgradeOptionsService.fetch(data).then(function(response) {

            $scope.isFetching     = false;
            $scope.slides = response.data;
       });

       // watch for any change

       $rootScope.$watch('netWorkError',function(){

           if($rootScope.netWorkError)
                 $scope.isFetching = false;
      });


      // upgrade button clicked

      $scope.upgradeClicked = function(upgradeID){

      
       $scope.isFetching          = true;

       var data = {'reservation_id':$rootScope.reservationID,'upsell_amount_id':upgradeID};

       checkinRoomUpgradeService.post(data).then(function(response) {


            $scope.isFetching     = false;

            if(response.status === "failure")
              $rootScope.netWorkError  = true;
            else
            {
               $rootScope.upgradesAvailable = false;
               $rootScope.ShowupgradedLabel = true;
               $rootScope.roomUpgradeheading = "Your new Trip details";
               $location.path('/checkinReservationDetails');
            }

      
       });
           
           
      }

      $scope.noThanksClicked = function(){

           $location.path('/checkinKeys');
      }




};

    var dependencies = [
    '$scope','$location','$rootScope','checkinRoomUpgradeOptionsService','checkinRoomUpgradeService',
    checkinUpgradeRoomContorller
    ];

    snt.controller('checkinUpgradeRoomContorller', dependencies);
    })();

// Setup directive to compile html

snt.directive("description", function ($compile) {
    function createList(template) {
        templ = template;
        return templ;
    }

    return{
        restrict:"E",
        scope: {},
        link:function (scope, element, attrs) {
          
            element.append(createList(attrs.template));
            $compile(element.contents())(scope);
        }
    }
})