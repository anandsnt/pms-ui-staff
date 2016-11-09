admin.controller('ADZestCheckinEmailCtrl',['$scope', '$state', 'adZestCheckinCheckoutSrv','$filter',function($scope, $state, adZestCheckinCheckoutSrv,$filter) {
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.isLoading = true;

    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope);

    $scope.init = function() {
        console.info('$state: ',$state);
        $scope.showEmailSetupView = false;
        $scope.showDirectSetupView = false;
        $scope.showView = false;
        if ($state.current.name === "admin.zest_setup_email") {
            $scope.showEmailSetup();
        } else if ($state.current.name === "admin.zest_setup_direct") {
            $scope.showDirectSetup();
        }
    };
    
    $scope.showEmailSetup = function() {
        $scope.fetchEmailSetup();
        $scope.showView = true;
        $scope.showEmailSetupView = true;
    };
    
    $scope.showDirectSetup = function() {
        $scope.fetchDirectSetup();
        $scope.showView = true;
        $scope.showDirectSetupView = true;
        $scope.showEmailSetupView = false;
    };
    
    $scope.goBackToMain = function() {
        $scope.init();
    };
    
    
    $scope.data = {};
    $scope.setData = function(data) {
        console.log('set, ',data);
        $scope.data = data.data;
        
    };
    
    $scope.failureCallBack = function(data) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    };
    
    $scope.fetchEmailSetup = function() {
        $scope.callAPI(adZestCheckinCheckoutSrv.fetchEmailSetup, {
            params:                 {},
            successCallBack: 	    $scope.setData,
            failureCallBack:        $scope.failureCallBack
        });
    };
    $scope.fetchDirectSetup = function() {
        $scope.callAPI(adZestCheckinCheckoutSrv.fetchDirectSetup, {
            params:                 {},
            successCallBack: 	    $scope.setData,
            failureCallBack:        $scope.failureCallBack
        });
    };
    var saveNewDirectURLSuccess = function() {
        $scope.$emit('hideLoader');
        $scope.successMessage = "Success";
    };

    var saveEmailUrl = function() {
        var data = {
             "active": true,
             "application": "EMAIL",
             "guest_web_url_type": "CHECKIN",
             "name":"Email URL",
             "url_suffix": $scope.data.zest_email_setup.checkin_static_uri
        }
        $scope.invokeApi(adZestCheckinCheckoutSrv.saveNewDirectURL, data,saveNewDirectURLSuccess);
    };
    $scope.saveEmailSetup = function() {
            var onSuccess = function(data) {
                saveEmailUrl();
            };
            $scope.callAPI(adZestCheckinCheckoutSrv.saveEmailSetup, {
                params: {
                    'zest_email_setup': $scope.data.zest_email_setup
                },
                successCallBack: 	    onSuccess,
                failureCallBack:        $scope.failureCallBack
            });
    };
    
    $scope.saveCheckin = function() {
        if ($scope.showEmailSetupView) {
            $scope.saveEmailSetup();
        } else if ($scope.showDirectSetupView) {
            $scope.saveDirectetup();
        }
        
    };

    $scope.init();







  }]);