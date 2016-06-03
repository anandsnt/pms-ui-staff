admin.controller('ADZestSmsShortcodeCtrl',['$scope', '$state', 'ADZestShortCodeSrv','adZestCheckinCheckoutSrv','$filter',function($scope, $state, ADZestShortCodeSrv,adZestCheckinCheckoutSrv,$filter){
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

     var saveSMSUrl = function(){
        var data = {
             "active": true,
             "application": "SMS",
             "guest_web_url_type": "CHECKIN",
             "name":"SMS URL",
             "url_suffix": $scope.editData.checkin_static_url
        }
        var options = {
            params          : data
        };
        $scope.callAPI(adZestCheckinCheckoutSrv.saveNewDirectURL, options);
    };
    $scope.onCallback = function(response){
        if (response.status === 'success'){
            saveSMSUrl();
        } else {
            $scope.errorMessage = ["Error"];
        }
    };

    $scope.saveClicked = function(){
        console.info('saving',$scope.editData);
        var params = $scope.editData;
        //params.id = $scope.editData.hotel_id;
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
        var callback = function(response){
            console.info('fetch: ',response)
            if (response.status === 'success'){
                $scope.editData = response.data;
                $scope.editData.sms_double_opt_in = $scope.editData.sms_double_opt_in !== 'true' ? 'false' : 'true';
                console.info('$scope.editData: ',$scope.editData)
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