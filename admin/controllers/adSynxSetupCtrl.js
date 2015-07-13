admin.controller('adSynixSetupCtrl', ['$scope', '$controller', 'adSynixSetupSrv', '$state', '$filter', '$stateParams',
    function ($scope, $controller, adSynixSetupSrv, $state, $filter, $stateParams) {
	$scope.$emit("changedSelectedMenu", 8);
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;
        $scope.refreshButtonEnabled = '';
        $scope.lastRefreshedTimeObj;
        $scope.lastRefreshedTimeRef = '';
        $scope.initTimeout = false;
        BaseCtrl.call(this, $scope);
        $scope.data = {};
        $scope.booking = {};
        $scope.payments = {};
        $scope.booking.booking_origins = {};
        $scope.payments.payments = {};
        
	var fetchOriginsSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.booking.booking_origins = data.booking_origins;
	};
        
	var fetchPaymethodsSuccess = function(data) {
		$scope.$emit('hideLoader');
		$scope.payments.payments = data.payments;
	};

        //load up origins and payment methods
	$scope.invokeApi(adSynixSetupSrv.fetchOrigins, {},fetchOriginsSuccessCallback);
	$scope.invokeApi(adSynixSetupSrv.fetchPaymethods, {}, fetchPaymethodsSuccess);
        
        
        $scope.fetchSynixSetupSuccessCallback = function (data) {
            $scope.isLoading = false;
            $scope.$emit('hideLoader');
            $scope.data = data;
            $scope.setRefreshTime();
        };
        $scope.setRefreshTime = function(){
            if ($scope.data.data.product_cross_customer.full_refresh !== null){
               $scope.lastRefreshedTime = new Date($scope.data.data.product_cross_customer.full_refresh);
               $scope.lastRefreshedTimeRef = $scope.formatDate(new Date($scope.data.data.product_cross_customer.full_refresh));
               $scope.lastRefreshedTimeObj = new Date($scope.data.data.product_cross_customer.full_refresh);

               var n = new Date();
               var nd = n.valueOf();
               var twentyFourHrs = 86400000;
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

        $scope.fetchSynixSetup = function () {
            $scope.invokeApi(adSynixSetupSrv.fetchSetup, {}, $scope.fetchSynixSetupSuccessCallback);
        };

        $scope.toggleSMActiveSuccess = function () {
            $scope.data.data.product_cross_customer.active = !$scope.data.data.product_cross_customer.active;
            $scope.invokeApi(adSynixSetupSrv.fetchSetup, {
                'interface_id': $scope.data.data.product_cross_customer.interface_id,
                'active': $scope.data.data.product_cross_customer.active
            }, $scope.fetchSynixSetupSuccessCallback);
        };

        $scope.toggleInterface = function (active, id) {
            if (active) {
                active = false;
            } else {
                active = true;
            }
            $('[name=active-inactive-toggle]').attr('ng-class', active);
            $scope.invokeApi(adSynixSetupSrv.toggleActive, {
                'interface_id': id,
                'active': active
            }, $scope.toggleSMActiveSuccess);
        };

        $scope.toggleSMClicked = function () {
            if ($scope.data.data){
                if ($scope.data.data.product_cross_customer){
                    var active = $scope.data.data.product_cross_customer.active,
                        id = $scope.data.data.product_cross_customer.interface_id;
                    $scope.toggleInterface(active, id);
                }
            }
        };

        $scope.fetchSynixSetup();

        // Set the selected payment method
        $scope.$watch("data.data.product_cross_customer.default_payment_id", function (value, n) {
            if (typeof value !== typeof undefined) {
                setTimeout(function () {
                    var payment = $('[valfor=default-payment]');
                    $(payment).val(value);
                }, 2000);
            }
        });


        // Save changes button click action
        $scope.saveSynixSetup = function () {
            var saveSynixSetupSuccessCallback = function (data) {
                $scope.successMessage = 'Synix Save Success';
                $scope.isLoading = false;
                $scope.$emit('hideLoader');
            };

            var saveSynixSetupFailureCallback = function (data) {
                $scope.isLoading = false;
                // var msg = data;
                $scope.errorMessage = 'Synix Save Failed ';
                $scope.$emit('hideLoader');
            };
            var unwantedKeys = ["available_trackers"];
            var saveData = dclone($scope.data, unwantedKeys);
            
            
            //for now fetch directly from the view
            //move this to a controller call later
            var origin = $('[valfor=value-default-origin]'),
                payment = $('[valfor=value-default-payment]');
            var originVal = $(origin).val(),
                paymentVal = $(payment).val();
            if (originVal.length > 0) {
                originVal = parseInt(originVal);
                //this.data.product_cross_customer.default_origin = originVal;
                saveData.data.product_cross_customer.default_origin = originVal;
            }
            if (paymentVal.length > 0) {
                paymentVal = parseInt(paymentVal);
                //this.data.product_cross_customer.default_payment_id = paymentVal;
                saveData.data.product_cross_customer.default_payment_id = paymentVal;
            }
            $scope.invokeApi(adSynixSetupSrv.saveSetup, saveData, saveSynixSetupSuccessCallback, saveSynixSetupFailureCallback);
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
                $scope.successMessage = 'Synix Full Refresh Success!';
                $scope.$emit('hideLoader');
                $scope.fetchSynixSetup();
            };
            var fullRefreshFail = function(response){
                var msg = '';
                if (response[0]){
                    if (response[0].length > 0){
                        msg = ': "'+response[0]+'"';
                    } 
                }
                $scope.errorMessage = 'Synix Full Refresh Failed' + msg;
                $scope.$emit('hideLoader');
            };
            if ((lastRefreshed < refreshNow) || lastRefreshed === null){
                //run refresh
                $scope.invokeApi(adSynixSetupSrv.fullRefresh, data, fullRefreshSuccess, fullRefreshFail);
        
            } else {
                //update w/ error
            }
        };

        // Test connection button click action
        $scope.testSynixSetup = function () {
            var testSynixSetupSuccessCallback = function (data) {
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
                    $scope.errorMessage = 'Synix Test Failed' + msg;
                } else {
                    $scope.isLoading = false;
                    $scope.successMessage = 'Synix Test Success';
                }
                $scope.$emit('hideLoader');
                //  $scope.showTestResults('Success', data);
            };
            var testSynixSetupFailureCallback = function (data) {
                $scope.isLoading = false;
                var msg = '';
                if (typeof data[0] === typeof 'str') {
                    if (data[0].length > 1) {
                        msg = ': ' + data[0];
                    } else if (typeof data === typeof 'str') {
                        msg = ': data';
                    }
                }
                $scope.errorMessage = 'Synix Test Failed' + msg;
                $scope.$emit('hideLoader');
            };

            var checkCallback = function (response) {
                $scope.$emit('hideLoader');
                if (response.status == 'failure') {
                    testSynixSetupFailureCallback(response);
                } else {
                    testSynixSetupSuccessCallback(response);
                }
            };

            var unwantedKeys = ["available_trackers"];
            var testData = dclone($scope.data, unwantedKeys);
            $scope.invokeApi(adSynixSetupSrv.testSetup, testData, checkCallback);
        };
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