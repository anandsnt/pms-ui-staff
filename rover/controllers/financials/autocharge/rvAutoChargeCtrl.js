sntRover.controller('RVAutoChargeController',
    ['$scope',
        '$rootScope',
        '$timeout',
        'RVAutoChargeSrv',
        'ngDialog',
        '$filter',
        'RVBillCardSrv',
        '$window',
        '$stateParams',
        function($scope, $rootScope, $timeout, RVAutoChargeSrv, ngDialog, $filter, RVBillCardSrv, $window, $stateParams) {

            BaseCtrl.call(this, $scope);

            var that = this,
                isFromStayCard = $stateParams.isFromStayCard,
                commonDateOptions = {
                    dateFormat: 'dd/mm/yy',
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
                        $scope.refreshScroller('chargeScroller');
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

                    $scope.setScroller('chargeScroller', scrollOptions);
                },
                /*
                 * function to set Headinng
                 * @return - {None}
                 */
                setTitleAndHeading = function() {
                    var title = $filter('translate')('AUTO_CHARGE');

                    $scope.setTitle(title);
                    $scope.$parent.heading = title;
                },
                /*
                 * function to filter params and call API
                 * @return - {None}
                 */
                setParamsAndFetchAutoCharge = function() {
                    if ( isFromStayCard ) {
                        $scope.filters = {
                            status: RVAutoChargeSrv.getParams().status,
                            due_date: RVAutoChargeSrv.getParams().due_date
                        };
                        $scope.fetchAutoCharge(RVAutoChargeSrv.getParams().page_no);
                    } else {
                        $scope.filters = {
                            status: 'ALL',
                            due_date: $filter('date')(tzIndependentDate($rootScope.businessDate), $rootScope.dateFormat)
                        };
                        $scope.fetchAutoCharge();
                    }
                },
                /*
                 * function to set selection value
                 * @return - [ObjList]
                 */
                processAutoChargeSelections = function (autoCharges, value) {
                    return _.map(autoCharges, function(autoCharge) {
                        return _.extend(autoCharge, {'isSelected': value});
                    });
                },
                /*
                 * function reset autocharge selction values
                 * @return - none
                 */
                resetSelections = function () {
                    $scope.isPartiallySelected = false;
                    $scope.isAllSelected = false;
                },
                /*
                 * function forms array of selected reservation ids
                 * @return - [Integer]
                 */
                generateSelectedReservationIds = function () {
                    var selectedReservationIds = [];

                    _.map($scope.autoCharges,
                        function(autoCharge) {
                            if (autoCharge.isSelected) {
                                selectedReservationIds.push(autoCharge.reservation_id);
                            }
                        });
                    return selectedReservationIds;
                };
            /*
             * function handle selection event for auto charge
             * @return - noe
             */
            $scope.handleAutoChargeSelection = function (selection_type) {
                var declinedAutoCharges = _.filter($scope.autoCharges,
                    function(autoCharge) {
                        return autoCharge.is_declined;
                    });

                if (selection_type === 'ALL') {
                    $scope.autoCharges = processAutoChargeSelections($scope.autoCharges, $scope.isAllSelected);
                    $scope.isPartiallySelected = false;
                } else {
                    $scope.isAllSelected = _.every(declinedAutoCharges,
                        function(autoCharge) {
                            return autoCharge.isSelected;
                        });
                    $scope.isPartiallySelected = _.some(declinedAutoCharges,
                        function(autoCharge) {
                            return autoCharge.isSelected;
                        });
                }
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
            // Call Api to load Auto Charge Details
            $scope.fetchAutoCharge = function(pageNo) {
                var params = {
                    page_no: pageNo || 1,
                    status: $scope.filters.status,
                    due_date: $scope.filters.due_date,
                    per_page: $scope.paginationConfig.perPage
                };

                var options = {
                    params: params,
                    successCallBack: function(response) {
                        resetSelections();
                        $scope.autoCharges = processAutoChargeSelections(response.details, false);
                        $scope.totalCount = response.total_count;
                        $scope.totalDeposite = response.total_deposit;
                        $scope.isAutoChargeProcessing = !!response.auto_charge_deposit_running;

                        $timeout(function () {
                            $scope.$broadcast('updatePagination', 'AUTO_CHARGE' );
                            $scope.$broadcast('updatePageNo', params.page_no);
                            refreshScroll();
                        }, 100 );
                    }
                };

                $scope.callAPI(RVAutoChargeSrv.fetchAutoCharge, options);
            };
            // Call Api to process declined charges
            $scope.processSelectedAutoCharges = function() {
                var params = {
                        due_date: $scope.filters.due_date,
                        reservations_ids: generateSelectedReservationIds()
                    },
                    options = {
                        params: params,
                        successCallBack: function() {
                            $scope.fetchAutoCharge();
                        }
                    };

                $scope.callAPI(RVAutoChargeSrv.processAutoCharges, options);
            };
            /*
             * Initialization
             */
            that.init = () => {
                $scope.filters = {};
                setScrollerOptions();
                setPaginationConfig();
                setDueDateOptions();
                setTitleAndHeading();
                setParamsAndFetchAutoCharge();
            };

            that.init();
        }]);
