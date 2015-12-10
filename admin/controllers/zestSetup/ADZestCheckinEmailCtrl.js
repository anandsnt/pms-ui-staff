admin.controller('ADZestCheckinEmailCtrl',['$scope','adZestCheckinCheckoutSrv','$filter',function($scope,adZestCheckinCheckoutSrv,$filter){
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.isLoading = true;

    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope);

    $scope.init = function(){
        $scope.fetchSetup();

    };
    $scope.data = {};
    $scope.setData = function(data){
        console.log('set, ',data);
        $scope.data = data;
    };
    
    $scope.failureCallBack = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    };
    
    $scope.fetchSetup = function(){
        $scope.callAPI(adZestCheckinCheckoutSrv.fetchSetup, {
            params:                 {},
            successCallBack: 	    $scope.setData,
            failureCallBack:        $scope.failureCallBack
        });
    };
    $scope.saveSetup = function(){
            var onSuccess = function(data){
                $scope.$emit('hideLoader');
            };
            $scope.callAPI(adZestCheckinCheckoutSrv.saveSetup, {
                params: {
                    'zest_station_setup': $scope.data
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