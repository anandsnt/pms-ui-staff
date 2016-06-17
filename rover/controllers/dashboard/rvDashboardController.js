
sntRover.controller('RVdashboardController',['$scope', 'ngDialog', 'RVDashboardSrv', 'RVSearchSrv', 'dashBoarddata','$rootScope', '$filter', '$state', 'RVWorkstationSrv', 'roomTypes',
                  function($scope, ngDialog, RVDashboardSrv, RVSearchSrv, dashBoarddata,$rootScope, $filter, $state, RVWorkstationSrv, roomTypes){

    //setting the heading of the screen
    $scope.heading = 'DASHBOARD_HEADING';

    //We are not showing the backbutton now, so setting as blank
    $scope.backButtonCaption = ''; //if it is not blank, backbutton will show, otherwise dont
    $scope.roomTypes = roomTypes;

    var that = this;
    $scope.shouldShowLateCheckout = true;
    $scope.shouldShowQueuedRooms  = true;
    BaseCtrl.call(this, $scope);

    $scope.isStatisticsOpened = false;

    var init =  function(){


          //setting the heading of the screen
        $scope.heading = "DASHBOARD_HEADING";
        $scope.userDetails   = RVDashboardSrv.getUserDetails();
        $scope.statisticsData = dashBoarddata.dashboardStatistics;
        $scope.lateCheckoutDetails = dashBoarddata.lateCheckoutDetails;
        $rootScope.adminRole = $scope.userDetails.user_role;
        $scope.isIpad = navigator.userAgent.match(/iPad/i) !== null;
        $scope.statistics = {};


        //update left nav bar
        $scope.$emit("updateRoverLeftMenu","dashboard");
        $scope.$emit("closeDrawer");
        var scrollerOptions = {click: true, preventDefault: false};
        $scope.setScroller('dashboard_scroller', scrollerOptions);
        //Display greetings message based on current time
        var d = new Date();
        var time = d.getHours();
        $scope.greetingsMessage = "";
        if (time < 12){
          $scope.greetingsMessage = 'GREETING_MORNING';
        }
        else if (time >= 12 && time < 16){
          $scope.greetingsMessage = 'GREETING_AFTERNOON';
        }
        else{
          $scope.greetingsMessage = 'GREETING_EVENING';
        }
        //ADDED Time out since translation not working without time out
        setTimeout(function(){
          var title = "Showing Dashboard";
           $scope.refreshScroller('dashboard_scroller');
           $scope.setTitle(title);
        }, 2000);

        if(!$rootScope.isWorkstationSet) {
          setWorkStation();
        }

        //TODO: Add conditionally redirecting from API results

        reddirectToDefaultDashboard();

   };

   $scope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
        $scope.errorMessage = 'Sorry the feature you are looking for is not implemented yet, or some  errors are occured!!!';
   });

   var setDeviceId = function() {
      var onGetDeviceIdSuccess = function(data){
            $rootScope.UUID = data;
            invokeSetWorkstationApi();
          },
          onGetDeviceIdFailure = function(error) {
            $rootScope.UUID = "DEFAULT";
            invokeSetWorkstationApi();
          };
        var options = {
          "successCallBack": onGetDeviceIdSuccess,
          "failureCallBack": onGetDeviceIdFailure,
          "arguments": []
        };
      try {
          sntapp.uuidService.getDeviceId(options);
      } catch(err) {

      }
   };

   var onSetWorkstationSuccess = function(data) {
            if(!data.is_workstation_present) {
              if ($scope.isHotelAdmin) {
                $scope.$emit('hideLoader');
                showWorkstationPopup();
              } else {
                createWorkstationForNonAdminUsers();
              }
            } else {
            	$rootScope.workstation_id = data.id;
          		$scope.$emit('hideLoader');
            }
        },
        onSetWorkstationFailure = function(failure) {
            $scope.$emit('hideLoader');
        };

   var setWorkStation = function(){


      //Variable to avoid calling the set work station api, when
      //its already invoked when navigating to the dashboard for the first time
      $rootScope.isWorkstationSet = true;
      if($scope.isIpad) {
        document.addEventListener("deviceready", function() {
                      setDeviceId();

        }, false);
      } else {

        //Check whether UUID is set from the WS response. We will check it 3 times
        //in an interval of 500ms. If the UUID is not set by that time, we will use the default
        // value 'DEFAULT'
        if(!$scope.getDeviceId()) {
          var count = 3;
          var deviceIdCheckTimer = setInterval(function() {
            if($scope.getDeviceId()) {
              clearInterval(deviceIdCheckTimer);
              invokeSetWorkstationApi();
            } else if(!$scope.getDeviceId() && count == 0) {
              $rootScope.UUID = "DEFAULT";
              clearInterval(deviceIdCheckTimer);
              invokeSetWorkstationApi();
            }
            count-- ;
          }, 500);
        } else {
          invokeSetWorkstationApi();
        }
      }

   };

   var invokeSetWorkstationApi = function() {
    var requestData = {};
    requestData.rover_device_id = $scope.getDeviceId();
    $scope.invokeApi(RVWorkstationSrv.setWorkstation,requestData,onSetWorkstationSuccess,onSetWorkstationFailure);

   };

   var showWorkstationPopup = function() {
      ngDialog.close(); //close any existing popups
      ngDialog.open({
        template: '/assets/partials/workstation/rvWorkstationPopup.html',
        className: '',
        controller: 'RVWorkstationController',
        scope: $scope,
        closeByDocument: false,
        closeByEscape: false
      });
   };

   var createWorkstationForNonAdminUsers = function() {

     var onSaveWorkstationSuccess = function(data) {

        var onSetWorkstationSuccess = function(response) {
              $scope.$emit('hideLoader');
            }, onSetWorkstationFailure = function(error) {
              $scope.$emit('hideLoader');
            };

        var params = {};
        params.rover_device_id = $scope.getDeviceId();
        $scope.invokeApi(RVWorkstationSrv.setWorkstation,params,onSetWorkstationSuccess, onSetWorkstationFailure);

     };

     var requestData = {};
     requestData.rover_device_id =  $scope.getDeviceId();
     requestData.auto_generate_workstation = true;

     $scope.invokeApi(RVWorkstationSrv.createWorkstation,requestData,onSaveWorkstationSuccess);

   };

   $scope.getDeviceId = function() {
     var deviceId = $rootScope.UUID;
     return deviceId;
   };

   var reddirectToDefaultDashboard = function(){
        var defaultDashboardMappedWithStates = {
          'FRONT_DESK': 'rover.dashboard.frontoffice',
          'MANAGER': 'rover.dashboard.manager',
          'HOUSEKEEPING': 'rover.dashboard.housekeeping'
        };
        if($rootScope.default_dashboard in defaultDashboardMappedWithStates) {

            // Nice Gotacha!!
            // When returning from search/housekeeping to dashboard, the animation will be reversed
            // but only for 'rover.search/housekeeping' to 'rover.dashboard'. We also need to make sure
            // that the animation will be reversed for 'rover.dashboard' to 'rover.dashboard.DEFAULT_DASHBOARD'
            if ( $rootScope.isReturning() ) {
              $rootScope.setPrevState.name = defaultDashboardMappedWithStates[$rootScope.default_dashboard];
              $rootScope.loadPrevState();
            } else {
              $state.go(defaultDashboardMappedWithStates[$rootScope.default_dashboard]);
            }
        }
        else{
            $scope.errorMessage = 'We are unable to redirect to dashboard, Please set Dashboard against this user and try again!!';
        }
   };

   init();




   $scope.gotosearch = function(){
    $state.go("rover.search");

   };


   /**
   * reciever function used to change the heading according to the current page
   * please be care to use the translation text as heading
   * param1 {object}, javascript event
   * param2 {String}, Heading to change
   */
   $scope.$on("UpdateHeading", function(event, data){
      event.stopPropagation();
      //chnaging the heading of the page
      $scope.heading = data;
   });


    /**
    * function to handle click on backbutton in the header section
    * will broadcast an event, the logic of backbutto should be handled there
    */
   $scope.headerBackButtonClicked = function(){
        $scope.$broadcast("HeaderBackButtonClicked");
   };

   /**
   * Function which checks whether ADR data is shown in statistic section or not
   */
   $scope.isADRShown = function() {
      return ($scope.isStandAlone && !$scope.isHourlyRateOn && $scope.isStatisticsOpened);
   };

   /**
   * Function which handles the click of the statistic btn in dashboard
   */
   $scope.toggleStatistics = function() {
    $scope.isStatisticsOpened = !$scope.isStatisticsOpened;
    var onStatisticsFetchSuccess = function(data) {
          $scope.$emit('hideLoader');
          $scope.statistics = data;
          $scope.refreshScroller('dashboard_scroller');
        }, 
        onStatisticsFetchFailure = function(error) {
          $scope.$emit('hideLoader');

        };
    //Invoke the api only when the statistic block is opened
    if($scope.isStatisticsOpened) {
      $scope.invokeApi(RVDashboardSrv.fetchStatisticData,{},onStatisticsFetchSuccess,onStatisticsFetchFailure);
    }    

   };



}]);