admin.controller('adSiteminderSetupCtrl', ['$scope', '$controller', 'adSiteminderSetupSrv', '$state', '$filter', '$stateParams',
    function ($scope, $controller, adSiteminderSetupSrv, $state, $filter, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;
        $scope.refreshButtonEnabled = '';
        $scope.lastRefreshedTimeObj;
        $scope.lastRefreshedTimeRef = '';
        $scope.initTimeout = false;
        BaseCtrl.call(this, $scope);

        $scope.fetchSiteminderSetupSuccessCallback = function (data) {
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
               //var unoMinute = 60000;//for debugging
              // if ((nd-$scope.lastRefreshedTimeObj.valueOf()) > unoMinute){//for debugging
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

        $scope.fetchSiteminderSetup = function () {
            $scope.invokeApi(adSiteminderSetupSrv.fetchSetup, {}, $scope.fetchSiteminderSetupSuccessCallback);
        };

        $scope.toggleSMActiveSuccess = function () {
            $scope.data.data.product_cross_customer.active = !$scope.data.data.product_cross_customer.active;
            $scope.invokeApi(adSiteminderSetupSrv.fetchSetup, {
                'interface_id': $scope.data.data.product_cross_customer.interface_id,
                'active': $scope.data.data.product_cross_customer.active
            }, $scope.fetchSiteminderSetupSuccessCallback);
        };

        $scope.toggleInterface = function (active, id) {
            if (active) {
                active = false;
            } else {
                active = true;
            }
            $('[name=active-inactive-toggle]').attr('ng-class', active);
            $scope.invokeApi(adSiteminderSetupSrv.toggleActive, {
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

        $scope.fetchSiteminderSetup();

        // Set the selected payment method
        $scope.$watch("data.data.product_cross_customer.default_payment_id", function (value, n) {
            //this data is pushed in upon saving the form, retrieved from other controllers
            //so watch this to push the data back in through this controller to the other controllers
            var emitObject = {
                'default_payment_id': value
            };
            if (typeof value !== typeof undefined) {
                setTimeout(function () {
                    var payment = $('[valfor=value-default-payment]');
                    $(payment).val(value);
                }, 2000);
                $scope.$broadcast('sm-payment-updated', emitObject.default_payment_id);
            }
        });

        // Set the selected booking origin
        $scope.$watch("data.data.product_cross_customer.default_origin", function (value, n) {
            //this data is pushed in upon saving the form, retrieved from other controllers
            //so watch this to push the data back in through this controller to the other controllers
            var emitObject = {
                'default_origin': value
            };
            if (typeof value !== typeof undefined) {
                setTimeout(function () {
                    var origin = $('[valfor=value-default-origin]');
                    $(origin).val(value);
                }, 2000);
                $scope.$broadcast('sm-booking-origin-updated', emitObject.default_origin);
            }
        });
        $scope.hasFailedMsg = function(response){
            if (response.status === 'failure'){
               return true;
            } else {
                return false;
            }
        };
        $scope.getErrorMessages = function(response){
            var errorMsg = [];
            var formatStr = function(s){
                var tempStr = '';
                if (s.indexOf('_') !== -1){
                    //we pull out the ' _ ', and replace with a space, and make string uppercase
                    tempStr = s.split('_');
                    var fullStr = '';
                    for (var st in tempStr){
                         fullStr = fullStr + ' ' +tempStr[st];
                    }
                    return '  '+fullStr.toUpperCase();
                } else {
                    return '  '+s.toUpperCase();
                }
            };
            var propErrs, first=true;
            for (var k in response.errors) {
                if (response.errors.hasOwnProperty(k)) {
                   first=true;
                        for (var e in response.errors[k]){
                            if (first){
                                    propErrs = ' ['+formatStr(k)+']'+': '+response.errors[k][e];
                                    first = false;
                            } else {
                                    propErrs += ', '+response.errors[k][e];
                            }
                        }
                  errorMsg.push(propErrs);
                }
            }
            if (errorMsg === []){
                return '';
            } else {
                return errorMsg;
            }
        };
       // Save changes button click action
        $scope.saveSiteminderSetup = function () {
             var saveSiteminderSetupSuccessCallback = function (response) {
                var failed = $scope.hasFailedMsg(response);
                
                if (!failed){
                    $scope.successMessage = 'Siteminder Save Success';
                } else {
                    var errorMsg = $scope.getErrorMessages(response);
                    $scope.errorMessage = 'Siteminder Save Failed. '+errorMsg;
                }
                $scope.isLoading = false;
                $scope.$emit('hideLoader');
            };

            var saveSiteminderSetupFailureCallback = function (data) {
                $scope.isLoading = false;
                // var msg = data;
                $scope.errorMessage = 'Siteminder Save Failed ';
                $scope.$emit('hideLoader');
            };
            var unwantedKeys = ["available_trackers"];
            var saveData = dclone($scope.data, unwantedKeys);
            /*
             var ADOriginsCtrl = $controller('ADOriginsCtrl');
             console.log(ADOriginsCtrl);
             console.log(ADOriginsCtrl.data);
             console.log(ADOriginsCtrl.data.data.product_cross_customer.tracker_default_origin);
             */
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
            $scope.invokeApi(adSiteminderSetupSrv.saveSetup, saveData, saveSiteminderSetupSuccessCallback, saveSiteminderSetupFailureCallback);
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
                $scope.successMessage = 'Siteminder Full Refresh Success!';
                $scope.$emit('hideLoader');
                $scope.fetchSiteminderSetup();
            };
            var fullRefreshFail = function(response){
                var msg = '';
                if (response[0]){
                    if (response[0].length > 0){
                        msg = ': "'+response[0]+'"';
                    }
                }
                $scope.errorMessage = 'Siteminder Full Refresh Failed' + msg;
                $scope.$emit('hideLoader');
            };
            if ((lastRefreshed < refreshNow) || lastRefreshed === null){
                //run refresh
                $scope.invokeApi(adSiteminderSetupSrv.fullRefresh, data, fullRefreshSuccess, fullRefreshFail);

            } else {
                //update w/ error
            }



        };

        // Test connection button click action
        $scope.testSiteminderSetup = function () {
            var testSiteminderSetupSuccessCallback = function (data) {
                //double check to see if it Actually failed..
                if (data.status === 'failure') {
                    var msg = '';
                    if (typeof data[0] === typeof 'str') {
                        if (data[0].length > 1) {
                            msg = ': ' + data[0];
                        } else if (typeof data === typeof 'str') {
                            msg = ': data';
                        }
                    }
                    $scope.errorMessage = 'Siteminder Test Failed' + msg;
                } else {
                    $scope.isLoading = false;
                    $scope.successMessage = 'Siteminder Test Success';
                }
                $scope.$emit('hideLoader');
                //  $scope.showTestResults('Success', data);
            };
            var testSiteminderSetupFailureCallback = function (data) {
                $scope.isLoading = false;
                var msg = '';
                if (typeof data[0] === typeof 'str') {
                    if (data[0].length > 1) {
                        msg = ': ' + data[0];
                    } else if (typeof data === typeof 'str') {
                        msg = ': data';
                    }
                }
                $scope.errorMessage = 'Siteminder Test Failed' + msg;
                $scope.$emit('hideLoader');
            };

            var checkCallback = function (response) {
                $scope.$emit('hideLoader');
                if (response.status === 'failure') {
                    testSiteminderSetupFailureCallback(response);
                } else {
                    testSiteminderSetupSuccessCallback(response);
                }
            };

            var unwantedKeys = ["available_trackers"];
            var testData = dclone($scope.data, unwantedKeys);
            $scope.invokeApi(adSiteminderSetupSrv.testSetup, testData, checkCallback);
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
            var month = "" + (now.getMonth() + 1); if (month.length === 1) { month = "0" + month; }
            var day = "" + now.getDate(); if (day.length === 1) { day = "0" + day; }
            var hour = "" + now.getHours(); if (hour.length === 1) { hour = "0" + hour; }
            var minute = "" + now.getMinutes(); if (minute.length === 1) { minute = "0" + minute; }
            var second = "" + now.getSeconds(); if (second.length === 1) { second = "0" + second; }
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