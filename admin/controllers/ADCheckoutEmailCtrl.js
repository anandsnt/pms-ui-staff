admin.controller('ADCheckoutEmailCtrl',['$scope','adCheckinCheckoutSrv','$state','ngTableParams','$filter','$stateParams',function($scope,adCheckinCheckoutSrv,$state,ngTableParams,$filter,$stateParams){

 /*
  * To retrieve previous state
  */

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = true;
  BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope, ngTableParams);

  $scope.init = function(){
      $scope.emailDatas = {};
  };

  $scope.init();

 /*
  * To show email list
  *
  */
  $scope.showSendEmailOptions = function($defer, params){

    $scope.emailTitle = 'Guests Checking Out';
    $scope.saveButtonTitle = 'SEND CHECKOUT EMAIL';
  	$scope.selectAllOption = false;
    var getParams = $scope.calculateGetParams(params);
    getParams.id = 'checkout';

    var fetchEmailListSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.currentClickedElement = -1;

        $scope.totalCount = parseInt(data.total_count);
        $scope.totalPage = Math.ceil($scope.totalCount/$scope.displyCount);


        $scope.currentPage = params.page();
        $scope.emailDatas  = data.due_out_guests;

        params.total($scope.totalCount);
        $scope.data=$scope.emailDatas;
        $defer.resolve($scope.data);
        angular.forEach($scope.emailDatas,function(item, index) {
          item.is_selected = false;

        });

        $scope.isAllOptionsSelected();

    };
    $scope.emailDatas =[];
    $scope.invokeApi(adCheckinCheckoutSrv.fetchEmailList, getParams, fetchEmailListSuccessCallback);

  };
  $scope.loadTable = function(){
    // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: $scope.emailDatas.length,    // count per page - Need to change when on pagination implemntation
      sorting: {
          first_name: 'asc'     // initial sorting
      }
    }, {
        total: $scope.emailDatas.length, // length of data
        getData: $scope.showSendEmailOptions
    });
  };

  $scope.loadTable();

/*
  * To check if all options are all selected or not
  *
  */
  $scope.isAllOptionsSelected = function(){
    var selectedCount = false;
    $scope.disableSave = true;
    if($scope.emailDatas.length ===0){
      return false;
    }
     angular.forEach($scope.emailDatas,function(item, index) {
           if(item.is_selected === true){
             selectedCount++;
             $scope.disableSave = false;
           }
           else
           {
           }
       });

     return $scope.emailDatas.length === selectedCount;
  };
/*
  * To watch if all options are selcted
  *
  */
  $scope.$watch("selectAllOption", function(o,n){
    angular.forEach($scope.emailDatas,function(item, index) {
      item.is_selected = $scope.selectAllOption;
    });
  });
  $scope.backActionFromEmail = function(){
    $state.go('admin.checkout');

  };
/*
  * To toggle options
  *
  */

  $scope.toggleAllOptions = function(){

   var selectedStatus =  $scope.isAllOptionsSelected() ? false : true;

     angular.forEach($scope.emailDatas,function(item, index) {
           item.is_selected =selectedStatus;
       });

    };

/*
  * To send mail
  *
  */

  $scope.sendMailClicked = function(){
  	var reservations = [];
  	angular.forEach($scope.emailDatas,function(item, index) {
       if(item.is_selected)
         reservations.push(item.reservation_id)
  });
  	var emailSendingData = {'reservations' : reservations}
    var sendMailClikedSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.successMessage = data.message;
    };
    $scope.invokeApi(adCheckinCheckoutSrv.sendMail,{'id':'checkout','data': emailSendingData},sendMailClikedSuccessCallback);

  };

}]);