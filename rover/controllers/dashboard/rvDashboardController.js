
sntRover.controller('RVdashboardController',['$scope', 'ngDialog', 'RVDashboardSrv', 'RVSearchSrv', 'dashBoarddata','$rootScope', '$filter', '$state', 'RVWorkstationSrv', 'roomTypes', '$window',
                  function($scope, ngDialog, RVDashboardSrv, RVSearchSrv, dashBoarddata,$rootScope, $filter, $state, RVWorkstationSrv, roomTypes, $window){

    //setting the heading of the screen
    $scope.heading = 'DASHBOARD_HEADING';

    //We are not showing the backbutton now, so setting as blank
    $scope.backButtonCaption = ''; //if it is not blank, backbutton will show, otherwise dont
    $scope.roomTypes = roomTypes;

    var that = this;
    $scope.shouldShowLateCheckout = true;
    $scope.shouldShowQueuedRooms  = true;
    BaseCtrl.call(this, $scope);


    var init =  function(){


          //setting the heading of the screen
        $scope.heading = "DASHBOARD_HEADING";
        $scope.userDetails   = RVDashboardSrv.getUserDetails();
        $scope.statisticsData = dashBoarddata.dashboardStatistics;
        $scope.lateCheckoutDetails = dashBoarddata.lateCheckoutDetails;
        $rootScope.adminRole = $scope.userDetails.user_role;
        $scope.isIpad = (navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null) && window.cordova;

        //update left nav bar
        $scope.$emit("updateRoverLeftMenu","dashboard");
        $scope.$emit("closeDrawer");
        var scrollerOptions = {click: true, preventDefault: false};
        $scope.setScroller('dashboard_scroller', scrollerOptions);
        //Display greetings message based on current time
        var d = new Date();
        var time = d.getHours();
         //Handle Notificatin releated logic.
        initNotification();
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
   /*
   * Function to fetch release notes
   */
   var fetchReleaseNotes = function(){
      //Standard parameters,As of now leave it all null
      var params = {
        hotel_uuid :null,
        service_provider_uuid : null,
        is_read: null
      };
      var successReleaseNotesFetch = function(data){
        $scope.activeNotification = data.results[0];
        $scope.$emit('hideLoader');
      };
      $scope.invokeApi(RVDashboardSrv.fetchDashboardNotifications, params, successReleaseNotesFetch);
    };
  /*
   * Function to open link in new tab
   */
    $scope.showReleaseNote = function(activeNotification){
      var url = activeNotification.action_source;
      if (!url.match(/^https?:\/\//i)) {
        url = 'http://' + url;
      }
      $window.open( url , '_blank');
    };
  /*
   * Function to hide release notes for current login
   */
    $scope.cancelReleaseNote = function(){
      $rootScope.showNotificationForCurrentUser = false;
    };
  /*
   * Function to change status, ie is_read true
   */
    $scope.changeNotificationStatus = function(activeNotification){
      var successCallBack = function(data){
        $rootScope.showNotificationForCurrentUser = false;
        $scope.$emit('hideLoader');
      };
      $scope.invokeApi(RVDashboardSrv.changeNotificationStatus, activeNotification.id, successCallBack);
    };
  /*
   * Function to init notification related process.
   */
    var initNotification = function(){
        fetchReleaseNotes();
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


}]);