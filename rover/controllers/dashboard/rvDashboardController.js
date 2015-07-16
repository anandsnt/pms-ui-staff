
sntRover.controller('RVdashboardController',['$scope', 'ngDialog', 'RVDashboardSrv', 'RVSearchSrv', 'dashBoarddata','$rootScope', '$filter', '$state',
                  function($scope, ngDialog, RVDashboardSrv, RVSearchSrv, dashBoarddata,$rootScope, $filter, $state){

    //setting the heading of the screen
    $scope.heading = 'DASHBOARD_HEADING';

    //We are not showing the backbutton now, so setting as blank
    $scope.backButtonCaption = ''; //if it is not blank, backbutton will show, otherwise dont


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

        //TODO: Add conditionally redirecting from API results

        reddirectToDefaultDashboard();

   };

   $scope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
        $scope.errorMessage = 'Sorry the feature you are looking for is not implemented yet, or some  errors are occured!!!';
   });

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
    // rover.search({type:'DUEIN'});
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

  // to fix this bug CICO-11227
  $('body').hide();
  setTimeout(function() {
    $('body').show();
  }, 300);

}]);

    