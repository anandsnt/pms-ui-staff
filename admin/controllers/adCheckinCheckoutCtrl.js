admin.controller('ADCheckinCheckoutCtrl',['$scope','adCheckinCheckoutSrv','$state','ngTableParams','$filter','$stateParams',function($scope,adCheckinCheckoutSrv,$state,ngTableParams,$filter,$stateParams){

 /*
  * To retrieve previous state
  */

  if($stateParams.from === 'checkin')
    $scope.isFromCheckin = true;
  else if($stateParams.from === 'checkout')
   $scope.isFromCheckOut = true;

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = true;

  BaseCtrl.call(this, $scope);

  $scope.init = function(){
      $scope.emailDatas = {};
  };

  $scope.init();

 /*
  * To show email list
  *
  */
  $scope.showSendEmailOptions = function(){
    if($scope.isFromCheckin){
  	 $scope.emailTitle = 'Guests Checking In';
     $scope.saveButtonTitle = 'SEND WEB CHECKIN INVITES';
    }
    else if($scope.isFromCheckOut){
      $scope.emailTitle = 'Guests Checking Out';
       $scope.saveButtonTitle = 'SEND CHECKOUT EMAIL';
    }
  	$scope.selectAllOption = false;
    var fetchEmailListFailuerCallback = function(data) {
         $scope.isLoading = false;
        $scope.$emit('hideLoader');
      };
    var fetchEmailListSuccessCallback = function(data) {
         $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.emailDatas  = data.due_out_guests;
        angular.forEach($scope.emailDatas,function(item, index) {
           item.is_selected = false;

              // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
              $scope.tableParams = new ngTableParams({
              page: 1,            // show first page
              count: $scope.emailDatas.length,    // count per page - Need to change when on pagination implemntation
              sorting: {
                  name: 'asc'     // initial sorting
              }
          }, {
              total: $scope.emailDatas.length, // length of data
              getData: function($defer, params) {
                  // use build-in angular filter
                  var orderedData = params.sorting() ?
                  $filter('orderBy')($scope.emailDatas, params.orderBy()) :
                  $scope.emailDatas;
                  $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
          });

          });
  };
  $scope.emailDatas =[];
  $scope.invokeApi(adCheckinCheckoutSrv.fetchEmailList, {'id':$scope.isFromCheckin ? 'checkin' : 'checkout'},fetchEmailListSuccessCallback,fetchEmailListFailuerCallback);

  };
  $scope.showSendEmailOptions();
/*
  * To check if all options are all selected or not
  *
  */
  $scope.isAllOptionsSelected = function(){
    var status = true;
    $scope.disableSave = true;
    if($scope.emailDatas.length ==0){
      return false;
    }
     angular.forEach($scope.emailDatas,function(item, index) {
           if(item.is_selected === false){
             status = false;
           }
           else
           {
            $scope.disableSave = false;
           }
       });

     return status;
  };
/*
  * To wall if all options are selcted 
  *
  */
  $scope.$watch("selectAllOption", function(o,n){
   angular.forEach($scope.emailDatas,function(item, index) {
           item.is_selected = $scope.selectAllOption;
  });
  });
  
  $scope.backActionFromEmail = function(){
    if($scope.isFromCheckin)
  	 $state.go('admin.checkin');
    else if($scope.isFromCheckOut)
     $state.go('admin.checkout');

  };
/*
  * To toggle options
  *
  */

  $scope.toggleAllOptions = function(){

   var selectedStatus =  $scope.isAllOptionsSelected() ? false : true;


  	//$scope.selectAllOption = $scope.selectAllOption ? false:true;

     angular.forEach($scope.emailDatas,function(item, index) {
           item.is_selected =selectedStatus;
       }); 

    };      

/*
  * To send mail
  *
  */

  $scope.sendMailClicked = function(){
  	reservations = [];
  	angular.forEach($scope.emailDatas,function(item, index) {
       if(item.is_selected)
         reservations.push(item.reservation_id)
  });
  	var emailSendingData = {'reservations' : reservations}
       var sendMailClikedFailureCallback = function(data) {
          $scope.$emit('hideLoader');
      };
    var sendMailClikedSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.successMessage = data.message;
    };
    $scope.invokeApi(adCheckinCheckoutSrv.sendMail,{'id':$scope.isFromCheckin ? 'checkin' : 'checkout','data': emailSendingData},sendMailClikedSuccessCallback,sendMailClikedFailureCallback);

  };



  }]);