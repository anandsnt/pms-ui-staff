admin.controller('ADZestSmsShortcodeCtrl',['$scope', '$state', 'ADZestShortCodeSrv','$filter',function($scope, $state, ADZestShortCodeSrv,$filter){
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.isLoading = true;

    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope);
    $scope.charLimitPerText = 160;
    $scope.charMaxLimit = 500;
    
    $scope.cancelClicked = function(){
        $scope.goBackToPreviousState();
    };
    $scope.onCallback = function(response){
      console.info('callback from shortcode stuff save')  
    };
    $scope.saveClicked = function(){
        var options = {
            params 			: params,
            successCallBack             : $scope.onCallback,
            failureCallBack             : $scope.onCallback
        };
        $scope.callAPI(ADZestShortCodeSrv.save, options);
    };


    
    $scope.getPages = function(r){//response text length
        if (r > 0){
            return (Math.ceil(r/$scope.charLimitPerText));
        } else {
            return 1;
        }
    };
    
    $scope.fetch = function(){
        console.log('fetching settings;')
        var callback = function(response){
            console.info('fetch success;',response);
            if (response.status === 'success'){
                $scope.editData = response.data;
            }
        };
        var options = {
            successCallBack             : callback,
            failureCallBack             : callback
        };
        $scope.callAPI(ADZestShortCodeSrv.fetch, options);
    };
    $scope.init = function(){
        $scope.fetch();
    };
    
    $scope.init();




  }]);