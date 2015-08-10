admin.controller('adExternalInterfaceCtrl', ['$scope', '$controller', 'adExternalInterfaceCommonSrv','adSiteminderSetupSrv', 'adSynxisSetupSrv', '$state', '$filter', '$stateParams',
    function ($scope, $controller, adExternalInterfaceCommonSrv, adSiteminderSetupSrv, adSynxisSetupSrv, $state, $filter, $stateParams) {
	$scope.$emit("changedSelectedMenu", 8);
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;
        $scope.refreshButtonEnabled = '';
        $scope.lastRefreshedTimeObj;
        $scope.lastRefreshedTimeRef = '';
        $scope.initTimeout = false;
        $scope.booking = {};
        $scope.payments = {};
        BaseCtrl.call(this, $scope);
        $scope.currentState = $state.current.name;
        $scope.interfaceId = $state.current.interface_id;
        $scope.simpleName = $state.current.simple_name;
        
        //these setup a generic method to access each service api, using the router namespace
        $scope.serviceController;
        $scope.interfaceName;
        $scope.interfaceConfig = {//controller to find the proper service controller, name to update success/fail messages with proper view/title
            'admin.sitemindersSetup':{'controller':adSiteminderSetupSrv, 'name':$scope.simpleName, 'service_name': 'adSiteminderSetupSrv'},
            'admin.synxisSetup': {'controller':adSynxisSetupSrv, 'name':$scope.simpleName, 'service_name': 'adSynxisSetupSrv'}
        };
        $scope.init = function(){
            var interface = $scope.interfaceConfig[$scope.currentState];
            $scope.serviceController = interface.controller;
            $scope.interfaceName = interface.name;
            //fetch payment methods, source origins, then values
            
            $scope.fetchSetup();
        };
        ///////////////////////////
        ///FETCH
        //
        // initial fetch when view initializes
        $scope.fetchSetupSuccessCallback = function (data) {
            $scope.data = data;
            
            //load up origins and payment methods
            $scope.invokeApi(adExternalInterfaceCommonSrv.fetchOrigins, {},fetchOriginsSuccessCallback);
            $scope.invokeApi(adExternalInterfaceCommonSrv.fetchPaymethods, {}, fetchPaymethodsSuccess);

            $scope.setRefreshTime();
        };
        $scope.fetchFailSuccessCallback = function (data) {
            //load up origins and payment methods
            $scope.invokeApi(adExternalInterfaceCommonSrv.fetchOrigins, {},fetchOriginsSuccessCallback);
            $scope.invokeApi(adExternalInterfaceCommonSrv.fetchPaymethods, {}, fetchPaymethodsSuccess);
        };
        $scope.fetchSetup = function () {
            $scope.invokeApi(adExternalInterfaceCommonSrv.fetchSetup, {'interface_id':$scope.interfaceId}, $scope.fetchSetupSuccessCallback, $scope.fetchSetupFailCallback);
        };
	var fetchOriginsSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
                $scope.isLoading = false;
		$scope.booking.booking_origins = data.booking_origins;
                setOrigin();
	};
        
	var fetchPaymethodsSuccess = function(data) {
		$scope.$emit('hideLoader');
                $scope.isLoading = false;
		$scope.payments.payments = data.payments;
                setPayment();
	};
        
        // Set the selected payment and origin 
        var setPayment = function(){
            var value = parseInt($scope.data.data.product_cross_customer.default_payment_id);
            if (typeof value !== typeof undefined) {
                setTimeout(function(){
                    var payment = $('[name=default-payment]');
                    $(payment).val(value);
                },50);//takes a moment for angularjs to catch up with the list population, possibly longer if list grows too big
            };
        };
        var setOrigin = function(){
            var value = parseInt($scope.data.data.product_cross_customer.default_origin);
            if (typeof value !== typeof undefined) {
                setTimeout(function(){
                    var payment = $('[name=default-origin]');
                    $(payment).val(value);
                },50);
            };
        };

        $scope.init();
        //////////////////////
        ////SAVE
        //
        // Save changes button click action
        $scope.saveSetup = function () {
            var saveSetupSuccessCallback = function (data) {
                $scope.isLoading = false;
                $scope.successMessage = $scope.interfaceName+' Save Success';
                $scope.$emit('hideLoader');
            };
            var saveSetupFailureCallback = function (data) {
                $scope.isLoading = false;
                $scope.errorMessage = $scope.interfaceName+' Save Failed ';
                $scope.$emit('hideLoader');
            };
            var unwantedKeys = ["available_trackers","bookmark_count","bookmarks","current_hotel","hotel_list","menus","interface_types"];
            var saveData = dclone($scope.data, unwantedKeys);
            //these values currently coming back as strings, parse to int before sending back
            if (saveData.data.product_cross_customer.default_origin) {
                saveData.data.product_cross_customer.default_origin = parseInt($scope.data.data.product_cross_customer.default_origin);
            }
            if (saveData.data.product_cross_customer.default_payment_id) {
                saveData.data.product_cross_customer.default_payment_id = parseInt($scope.data.data.product_cross_customer.default_payment_id);
            }
            $scope.invokeApi($scope.serviceController.saveSetup, saveData, saveSetupSuccessCallback, saveSetupFailureCallback);
        };
        //////////////////////
        //Active / Inactive Toggle to turn ON/OFF interface for the hotel
        
        $scope.toggleSMActiveSuccess = function () {
            $scope.data.data.product_cross_customer.active = !$scope.data.data.product_cross_customer.active;
            $scope.invokeApi(adExternalInterfaceCommonSrv.fetchSetup, {
                'interface_id': $scope.data.data.product_cross_customer.interface_id,
                'active': $scope.data.data.product_cross_customer.active
            }, $scope.fetchSetupSuccessCallback);
        };

        $scope.toggleSMClicked = function () {
            if ($scope.data.data){
                if ($scope.data.data.product_cross_customer){
                    var active = $scope.data.data.product_cross_customer.active,
                        id = $scope.interfaceId;
                    if (active) {
                        active = false;
                    } else {
                        active = true;
                    }
                    
                    $scope.invokeApi(adExternalInterfaceCommonSrv.toggleActive, {
                        'interface_id': id,
                        'active': active
                    }, $scope.toggleSMActiveSuccess);
                }
            }
        };
        
        $scope.setRefreshTime = function(){
            if ($scope.data.data.product_cross_customer.full_refresh !== null){
               $scope.lastRefreshedTime = new Date($scope.data.data.product_cross_customer.full_refresh);
               $scope.lastRefreshedTimeRef = $scope.formatDate(new Date($scope.data.data.product_cross_customer.full_refresh));
               $scope.lastRefreshedTimeObj = new Date($scope.data.data.product_cross_customer.full_refresh);

               var n = new Date();
               var nd = n.valueOf();
               var twentyFourHrs = 86400000;
               //var aMin = 60000;//for debugging
              // if ((nd-$scope.lastRefreshedTimeObj.valueOf()) > aMin){//for debugging
               if ((nd-$scope.lastRefreshedTimeObj.valueOf()) > twentyFourHrs){
                   $scope.refreshButtonEnabled = 'enabled';
               } else {
                   $scope.refreshButtonEnabled = 'disabled';
               }
               $scope.lastRefreshedTimeMark = $scope.timeSince($scope.lastRefreshedTimeObj.valueOf());
                if (!$scope.initTimeout){
                    $scope.countdownTimer();
                    $scope.initTimeout = true;
                }
           }
        };

        $scope.runFullRefresh = function(){
            var lastRefreshed = $scope.data.data.product_cross_customer.full_refresh, refreshNowDate = new Date();
            var refreshNow = refreshNowDate.valueOf(), data = {}; data.interface_id = $scope.data.data.product_cross_customer.interface_id;
            if (lastRefreshed !== null){
                try {
                    var lastRefreshedDate = new Date($scope.data.data.product_cross_customer.full_refresh);
                    lastRefreshed = lastRefreshedDate.valueOf();
                } catch(err){
                    
                }
            }
            var fullRefreshSuccess = function(){
                $scope.successMessage = $scope.interfaceName+' Full Refresh Success!';
                $scope.$emit('hideLoader');
                $scope.fetchSetup();
            };
            var fullRefreshFail = function(response){
                var msg = '';
                if (response[0]){
                    if (response[0].length > 0){
                        msg = ': "'+response[0]+'"';
                    } 
                }
                $scope.errorMessage = $scope.interfaceName+' Full Refresh Failed' + msg;
                $scope.$emit('hideLoader');
            };
            if ((lastRefreshed < refreshNow) || lastRefreshed === null){
                //run refresh
                $scope.invokeApi($scope.serviceController.fullRefresh, data, fullRefreshSuccess, fullRefreshFail);
        
            } else {
                //update w/ error
            }
        };

        // Test connection button click action
        $scope.testSetup = function () {
            var testSetupSuccessCallback = function (data) {
                //double check to see if it Actually failed..
                if (data.status == 'failure') {
                    var msg = '';
                    if (typeof data[0] === typeof 'str') {
                        if (data[0].length > 1) {
                            msg = ': ' + data[0];
                        } else if (typeof data === typeof 'str') {
                            msg = ': data';
                        }
                    }
                    $scope.errorMessage = $scope.interfaceName+' Test Failed' + msg;
                } else {
                    $scope.isLoading = false;
                    $scope.successMessage = $scope.interfaceName+' Test Success';
                }
                $scope.$emit('hideLoader');
            };
            var testSetupFailureCallback = function (data) {
                $scope.isLoading = false;
                var msg = '';
                if (typeof data[0] === typeof 'str') {
                    if (data[0].length > 1) {
                        msg = ': ' + data[0];
                    } else if (typeof data === typeof 'str') {
                        msg = ': data';
                    }
                }
                $scope.errorMessage = $scope.interfaceName+' Test Failed' + msg;
                $scope.$emit('hideLoader');
            };

            var checkCallback = function (response) {
                $scope.$emit('hideLoader');
                if (response.status == 'failure') {
                    testSetupFailureCallback(response);
                } else {
                    testSetupSuccessCallback(response);
                }
            };

            var unwantedKeys = ["available_trackers"];
            var testData = dclone($scope.data, unwantedKeys);
            $scope.invokeApi($scope.serviceController.testSetup, testData, checkCallback);
        };
        
        
        //COUNTDOWN Timer Utilities
        $scope.timeSince = function(date) {
            var seconds = Math.floor((new Date() - date) / 1000);//local to the user
            var interval = Math.floor(seconds / 31536000);

            if (interval > 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " months";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " days";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hours";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        };
        $scope.formatDate = function(now) {
            var year = "" + now.getFullYear();
            var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
            var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
            var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
            var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
            var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
            return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
          };
          //////////////////////
          
          $scope.countdownTimer = function(){
              setTimeout(function(){
                  $scope.$apply(function(){
                        if ($scope.lastRefreshedTimeMark){
                          $scope.lastRefreshedTimeMark = $scope.timeSince($scope.lastRefreshedTimeObj.valueOf());
                        $scope.countdownTimer();
                    }
                    $scope.setRefreshTime();
                  });
              }, 1000);
          }; 
            
    }]);