admin.controller('ADZestCheckinEmailCtrl',['$scope','adZestCheckinCheckoutSrv','$filter',function($scope,adZestCheckinCheckoutSrv,$filter){
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.isLoading = true;

    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope);

    $scope.init = function(){
        $scope.fetchEmailSetup();
        $scope.showEmailSetupView = false;
        $scope.showView = false;
        
    };
    
    $scope.showEmailSetup = function(){
        $scope.showView = true;
        $scope.showEmailSetupView = true;
    };
    
    $scope.showDirectSetup = function(){
        $scope.showView = true;
        $scope.showEmailSetupView = true;
    };
    
    $scope.goBackToMain = function(){
        $scope.init();
    };
    
    
    $scope.data = {};
    $scope.setData = function(data){
        console.log('set, ',data);
        $scope.data = data.data;
        
    };
    
    $scope.failureCallBack = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    };
    
    $scope.fetchEmailSetup = function(){
        $scope.callAPI(adZestCheckinCheckoutSrv.fetchSetup, {
            params:                 {},
            successCallBack: 	    $scope.setData,
            failureCallBack:        $scope.failureCallBack
        });
    };
    $scope.saveSetup = function(){
            var onSuccess = function(data){
                $scope.$emit('hideLoader');
                $scope.successMessage = "Success";
            };
            $scope.callAPI(adZestCheckinCheckoutSrv.saveSetup, {
                params: {
                    'zest_station_setup': $scope.data.zest_station_setup
                },
                successCallBack: 	    onSuccess,
                failureCallBack:        $scope.failureCallBack
            });
    };
    
    $scope.saveCheckin = function(){
        $scope.saveSetup();
    };

    $scope.init();







  }]);