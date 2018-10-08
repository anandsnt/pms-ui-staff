sntRover.controller('RVAutoChargeController',
    ['$scope',
        '$rootScope',
        '$timeout',
        'RVAutoChargeSrv',
        'ngDialog',
        '$filter',
        'RVBillCardSrv',
        '$window',
        function($scope, $rootScope, $timeout, RVAutoChargeSrv, ngDialog, $filter, RVBillCardSrv, $window) {

            BaseCtrl.call(this, $scope);

            const scrollOptions = {preventDefaultException: { tagName: /^(INPUT|LI)$/ },
                    preventDefault: false},
                that = this;

            $scope.setScroller('grid-content', scrollOptions);
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
                    $scope.refreshScroller('grid-content');
                }, 1000);
            };


            // add the print orientation before printing
            var addPrintOrientation = function() {
                $( 'head' ).append( '<style id=\'print-orientation\'>@page { size: portrait; }</style>' );
            };

            // add the print orientation after printing
            var removePrintOrientation = function() {
                $( '#print-orientation' ).remove();
            };

            // print the page
            that.printBill = function() {
                // CICO-9569 to solve the hotel logo issue
                $('header .logo').addClass('logo-hide');
                $('header .h2').addClass('text-hide');

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
                    $('header .logo').removeClass('logo-hide');
                    $('header .h2').addClass('text-hide');

                    // remove the orientation after similar delay
                    removePrintOrientation();
                }, 1000);
            };

            // print bill
            $scope.clickedPrint = function() {
                $scope.closeDialog();
                that.printBill();
            };
            var fetchAutoCharge = function() {
                var params = {
                    date: '02/02/2017',
                    hotel_id: 80
                };

                var options = {
                    params: params,
                    successCallBack: function(response) {
                        $scope.autoCharges = response.data;
                    }
                };

                $scope.callAPI(RVAutoChargeSrv.fetchAutoCharge, options);
            }

            $scope.autoChargePAginationObject = {
                id: 'AUTO_CHARGE',
                api: [ fetchAutoCharge, 'AUTO_CHARGE' ],
                perPage: 25
            };

            /*
             * Initialization
             */
            that.init = () => {
                $scope.setTitleAndHeading();
            };

            that.init();
        }]);
