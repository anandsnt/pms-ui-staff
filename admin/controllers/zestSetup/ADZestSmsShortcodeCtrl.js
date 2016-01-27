admin.controller('ADZestSmsShortcodeCtrl',['$scope', '$state', 'ADZestShortCodeSrv','$filter',function($scope, $state, adZestCheckinCheckoutSrv,$filter){
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.isLoading = true;

    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope);
    $scope.charLimitPerText = 160;
    
    $scope.cancelClicked = function(){
        $scope.goBackToPreviousState();
    };
    $scope.saveClicked = function(){
        
    };



    $scope.init = function(){
    };
    
    $scope.init();







  }]);