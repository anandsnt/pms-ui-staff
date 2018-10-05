sntRover.controller('RVAutoChargeController',
    ['$scope',
        '$rootScope',
        '$timeout',
        'RVInvoiceSearchSrv',
        'ngDialog',
        '$filter',
        'RVBillCardSrv',
        '$window',
        'rvAccountTransactionsSrv',
        'rvAccountsConfigurationSrv',
        function($scope, $rootScope, $timeout, RVInvoiceSearchSrv, ngDialog, $filter, RVBillCardSrv, $window, rvAccountTransactionsSrv, rvAccountsConfigurationSrv) {

            BaseCtrl.call(this, $scope);

            const scrollOptions =  {preventDefaultException: { tagName: /^(INPUT|LI)$/ }, preventDefault: false},
                that = this,
                PER_PAGE = 10;

            $scope.currentActivePage = 1;

            $scope.setScroller('invoice-list', scrollOptions);
            /**
             * function to set Headinng
             * @return - {None}
             */
            $scope.setTitleAndHeading = function(title) {

                $scope.setTitle(title);
                $scope.$parent.heading = title;
            };

            // To refresh the scroll
            const refreshScroll = function() {
                $timeout(function() {
                    $scope.refreshScroller('invoice-list');
                }, 1000);
            };


            // add the print orientation before printing
            var addPrintOrientation = function() {
                $( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
            };

            // add the print orientation after printing
            var removePrintOrientation = function() {
                $( '#print-orientation' ).remove();
            };

            // print the page
            that.printBill = function(data) {
                var printDataFetchSuccess = function(successData) {
                        if ($scope.invoiceSearchFlags.isClickedReservation) {
                            $scope.printData = successData;
                        } else {
                            $scope.printData = successData.data;
                        }

                        $scope.errorMessage = "";

                        // CICO-9569 to solve the hotel logo issue
                        $("header .logo").addClass('logo-hide');
                        $("header .h2").addClass('text-hide');

                        // add the orientation
                        addPrintOrientation();

                        /*
                        *	======[ READY TO PRINT ]======
                        */
                        // this will show the popup with full bill
                        $timeout(function() {
                            /*
                            *	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                            */

                            $window.print();
                            if ( sntapp.cordovaLoaded ) {
                                cordova.exec(function() {}, function() {}, 'RVCardPlugin', 'printWebView', []);
                            }
                        }, 1000);

                        /*
                        *	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
                        */

                        $timeout(function() {
                            // CICO-9569 to solve the hotel logo issue
                            $("header .logo").removeClass('logo-hide');
                            $("header .h2").addClass('text-hide');

                            // remove the orientation after similar delay
                            removePrintOrientation();
                            $scope.searchInvoice($scope.currentActivePage);
                        }, 1000);

                    },
                    printDataFailureCallback = function(errorData) {
                        $scope.errorMessage = errorData;
                    },
                    options = {
                        params: data,
                        successCallBack: printDataFetchSuccess,
                        failureCallBack: printDataFailureCallback
                    };

                if ($scope.invoiceSearchFlags.isClickedReservation) {
                    $scope.callAPI(RVBillCardSrv.fetchBillPrintData, options);
                } else {
                    $scope.callAPI(rvAccountTransactionsSrv.fetchAccountBillsForPrint, options);
                }
            };

            // print bill
            $scope.clickedPrint = function(requestData) {
                $scope.closeDialog();
                that.printBill(requestData);
            };

            /*
             * Initialization
             */
            that.init = () => {
                $scope.setTitleAndHeading();
            };

            that.init();
        }]);
