sntRover.controller('RVAutoChargeController',
    ['$scope',
        '$rootScope',
        '$timeout',
        'RVAutoChargeSrv',
        'ngDialog',
        '$filter',
        'RVBillCardSrv',
        '$window',
        '$state',
        '$stateParams',
        function($scope, $rootScope, $timeout, RVAutoChargeSrv, ngDialog, $filter, RVBillCardSrv, $window, $state, $stateParams) {

            BaseCtrl.call(this, $scope);

            var that = this,
                commonDateOptions = {
                    dateFormat: $rootScope.jqDateFormat,
                    changeYear: true,
                    changeMonth: true,
                    yearRange: '-10:',
                    maxDate: tzIndependentDate($rootScope.businessDate)
                },
                /*
                 * function handle date changes event and Calls API
                 * @return - {None}
                 */
                dueDateChoosed = function(date) {
                    $scope.filters.due_date = date;
                    $scope.due_date = date;
                    $scope.fetchAutoCharge();
                },
                // add the print orientation before printing
                addPrintOrientation = function() {
                    $( 'head' ).append( '<style id=\'print-orientation\'>@page { size: portrait; }</style>' );
                },
                // add the print orientation after printing
                removePrintOrientation = function() {
                    $( '#print-orientation' ).remove();
                },
                // To refresh the scroll
                refreshScroll = function() {
                    $timeout(function() {
                        $scope.refreshScroller('grid-content');
                    }, 1000);
                },
                /*
                 * function Configure Pagination Settings
                 * @return - {None}
                 */
                setPaginationConfig = function() {
                    $scope.paginationConfig = {
                        id: 'AUTO_CHARGE',
                        api: $scope.fetchAutoCharge,
                        perPage: 25
                    };
                },
                /*
                 * function Confidure DatePicker settings
                 * @return - {None}
                 */
                setDueDateOptions = function () {
                    $scope.dueDateOptions = _.extend({
                        onSelect: dueDateChoosed
                    }, commonDateOptions);
                },
                /*
                 * function Confidure scroller settings
                 * @return - {None}
                 */
                setScrollerOptions = function() {
                    var scrollOptions = {
                        preventDefaultException: { tagName: /^(INPUT|LI)$/ },
                        preventDefault: false
                    };

                    $scope.setScroller('grid-content', scrollOptions);
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

            /*
             * function to set Headinng
             * @return - {None}
             */
            $scope.setTitleAndHeading = function(title) {
                $scope.setTitle(title);
                $scope.$parent.heading = title;
            };
            // print bill
            $scope.clickedPrint = function() {
                $scope.closeDialog();
                that.printBill();
            };
            /*
             * function Navigate to Reservation Details screen
             * @return - {None}
             */
            $scope.goToStayCard = function(reservation_id, confirmation_no) {
                $state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
                    'id': reservation_id,
                    'confirmationId': confirmation_no,
                    'isrefresh': true,
                    'isFromAutoCharge': true});
            };
            // Call Api to load Auto Charge Details
            $scope.fetchAutoCharge = function(pageNo) {
                var params = {
                    page_no: pageNo || 1,
                    status: $scope.filters.status,
                    due_date: $scope.filters.due_date
                };

                var options = {
                    params: params,
                    successCallBack: function(response) {
                        $scope.autoCharges = response;
                        $scope.totalCount = response.length;
                        $timeout(function () {
                            $scope.$broadcast('updatePagination', 'AUTO_CHARGE' );
                            refreshScroll();
                        }, 100 );
                    }
                };

                $scope.callAPI(RVAutoChargeSrv.fetchAutoCharge, options);
            };
            /*
             * Initialization
             */
            that.init = () => {
                $scope.filters = {
                    status: 'ALL',
                    due_date: $filter('date')(tzIndependentDate($rootScope.businessDate), $rootScope.dateFormat)
                };
                setScrollerOptions();
                setPaginationConfig();
                setDueDateOptions();
                // $scope.setTitleAndHeading();
                $scope.fetchAutoCharge();
            };

            that.init();
        }]);
