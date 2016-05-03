sntZestStation.controller('zsPrintBillCtrl', [
    '$scope',
    '$state',
    'zsCheckoutSrv', '$stateParams', '$window', '$timeout',
    function($scope, $state, zsCheckoutSrv, $stateParams, $window, $timeout) {


        BaseCtrl.call(this, $scope);
        /**
         *  general failure actions inside bill screen
         **/
        var failureCallBack = function() {
            //if key card was inserted we need to eject that
            $scope.$emit('EJECT_KEYCARD');
            $state.go('zest_station.speakToStaff');
        };
        var nextPageActions = function(printopted) {
            if ($scope.zestStationData.guest_bill.email) {
                $state.go('zest_station.emailBill', $scope.stateParamsForNextState);
            } else {
                $scope.checkOutGuest(printopted);
            }
        };
        var handleBillPrint = function() {
            $scope.$emit('hideLoader');
            setBeforePrintSetup();
            var printFailedActions = function() {
                $scope.zestStationData.workstationOooReason = $filter('translate')('CHECKOUT_PRINT_FAILED');
                $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS, {
                    'status': 'out-of-order',
                    'reason': $scope.zestStationData.workstationOooReason
                });
                $state.go('zest_station.speakToStaff');
            };
            try {
                // this will show the popup with full bill
                $timeout(function() {
                    /*
                     * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                     */
                    $window.print();
                    if (sntapp.cordovaLoaded) {
                        var printer = (sntZestStation.selectedPrinter);
                        cordova.exec(function(success) {
                            var printopted = 'true';
                            nextPageActions(printopted);
                        }, function(error) {
                            printFailedActions();
                        }, 'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
                    };
                    // provide a delay for preview to appear 

                }, 100);
            } catch (e) {
                console.info("something went wrong while attempting to print--->" + e);
                printFailedActions();
            };
            setTimeout(function() {
                // CICO-9569 to solve the hotel logo issue
                $("header .logo").removeClass('logo-hide');
                $("header .h2").addClass('text-hide');

                // remove the orientation after similar delay
                removePrintOrientation();
                var printopted = 'true';
                nextPageActions(printopted);
            }, 100);
        };


        var fetchBillData = function() {
            var data = {
                "reservation_id": $scope.reservation_id,
                "bill_number": 1
            };

            var fetchBillSuccess = function(response) {
                $scope.printData = response;
                // add the orientation
                addPrintOrientation();
                // print section - if its from device call cordova.
                handleBillPrint();
            };
            var options = {
                params: data,
                successCallBack: fetchBillSuccess,
                failureCallBack: failureCallBack
            };
            $scope.callAPI(zsCheckoutSrv.fetchBillPrintData, options);
        };

        $scope.printBill = function() {
            fetchBillData();
        };

        $scope.clickedNoThanks = function() {
            var printopted = 'false';
            nextPageActions(printopted);
        };

    }
]);