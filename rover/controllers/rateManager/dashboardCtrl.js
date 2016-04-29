sntRover
    .constant('filterDefaults', Object.create(null, {
        DATE_RANGE_PLACEHOLDER: {
            enumerable: true,
            value: 'Select Date Range'
        },
        UI_DATE_FORMAT: {
            enumerable: true,
            value: 'yyyy-MM-dd'
        }
    }))
    .constant('rateGridDefaults', Object.create(null, {
        RESIZE_DEBOUNCE_INTERVAL: {
            enumerable: true,
            value: 100
        },
        FILTER_OPTIONS_WIDTH: {
            enumerable: true,
            value: 5
        },
        FIRST_COLUMN_WIDTH: {
            enumerable: true,
            value: 220
        },
        COLUMN_BORDER_WIDTH: {
            enumerable: true,
            value: 8 //20
        },
        TOP_BOTTOM_HEIGHT: {
            enumerable: true,
            value: 190
        },
        DEFAULT_COLUMN_WIDTH: {
            enumerable: true,
            value: 200
        },
        DEFAULT_TABLE_WIDTH: {
            enumerable: true,
            value: 400
        }
    }))
    .controller('RMDashboradCtrl', ['rateGridDefaults', '$scope', '$window', 'dateFilter', '$filter', '$vault', 'sortOrder', 'sortOptions',
        function(rateGridDefaults, $scope, $window, dateFilter, $filter, $vault, sortOrder, sortOptions) {
            BaseCtrl.call(this, $scope);

            // reseting search params to $vault
            // MUST else there will be problems with back button working
            $vault.set('searchType', '');

            /* UI options like column width are computed here
               A property, and a function to compute the same are given below
            */


            /*Considering base model class for later refactoring to avoid
              firing observer code before model has resolved...
            */
            var Model = function(params) {
                this.isPending = false;
                this.isResolved = false;
                this.isRejected = false;
                this.isDirty = false;
                this.isSaved = false;
                this.isNew = true;

                if (_.isObject(params)) {
                    _.extend(this, params);
                }
            };

            Model.prototype = {
                constructor: Model
            };

            $scope.uiOptions = {
                tableHeight: rateGridDefaults.DEFAULT_TABLE_WIDTH,
                columnWidth: rateGridDefaults.DEFAULT_COLUMN_WIDTH,
                tableWidth: rateGridDefaults.DEFAULT_TABLE_WIDTH,
                isIpad: navigator.userAgent.match(/iPad/i) != null
            };
 

            var title = $filter('translate')('RATE_MANAGER_TITLE');

            $scope.setTitle(title);
            $scope.heading = title;

            $scope.$emit("updateRoverLeftMenu", "rateManager");

            $scope.displayMode = "CALENDAR";

            var defaultDateRange = 7;

            $scope.backbuttonEnabled = false;

            //left side menu class, based on which it will appear or not
            $scope.currentLeftMenuClass = 'slide_right';

            $scope.currentFilterData = new Model({
                filterConfigured: false,
                begin_date: '',
                end_date: '',
                zoom_level: [{
                    "value": "3",
                    "name": "3 days"
                }, {
                    "value": "4",
                    "name": "4 days"
                }, {
                    "value": "5",
                    "name": "5 days"
                }, {
                    "value": "6",
                    "name": "6 days"
                }, {
                    "value": "7",
                    "name": "7 days"
                }],
                zoom_level_selected: "3",
                is_checked_all_rates: true,
                rate_types: [],
                rate_type_selected_list: [],
                rates: [],
                rates_selected_list: [],
                name_cards: [],
                selected_date_range: '',
                allRates: [],
                sortOptions: sortOptions,
                sort_order: sortOrder.id
            });

            var computeColWidth = function() {
                    var FILTER_OPTIONS_WIDTH = rateGridDefaults.FILTER_OPTIONS_WIDTH,
                        FIRST_COLUMN_WIDTH = rateGridDefaults.FIRST_COLUMN_WIDTH,
                        COLUMN_BORDER_WIDTH = rateGridDefaults.COLUMN_BORDER_WIDTH,
                        TOP_BOTTOM_HEIGHT = rateGridDefaults.TOP_BOTTOM_HEIGHT;

                    var totalwidth = $window.innerWidth - FILTER_OPTIONS_WIDTH - FIRST_COLUMN_WIDTH; //Adjusting for left side .

                    var mywidth = totalwidth / parseInt($scope.currentFilterData.zoom_level_selected);
                    var numColumns = new Date($scope.currentFilterData.end_date) - new Date($scope.currentFilterData.begin_date);

                    numColumns = numColumns / (24 * 60 * 60 * 1000) + 1;

                    if (numColumns < parseInt($scope.currentFilterData.zoom_level_selected)) {
                        numColumns = parseInt($scope.currentFilterData.zoom_level_selected);
                    }

                    var columsTotalWidth = numColumns * mywidth;

                    if (columsTotalWidth < totalwidth) {
                        columsTotalWidth = totalwidth; //@minimum, table should cover full view.
                    }

                    $scope.uiOptions.tableWidth = parseInt(FIRST_COLUMN_WIDTH + columsTotalWidth);
                    $scope.uiOptions.tableHeight = $window.innerHeight - TOP_BOTTOM_HEIGHT;
                    $scope.uiOptions.columnWidth = parseInt(mywidth);
                    $scope.uiOptions.isIpad = navigator.userAgent.match(/iPad/i) != null;
                },
                computeColWidthOnResize = _.throttle(computeColWidth, rateGridDefaults.RESIZE_DEBOUNCE_INTERVAL, {
                    leading: true,
                    trailing: false
                });

            $scope.$on("computeColumWidth", computeColWidthOnResize);

            $scope.getSortOption = function(option){
                if(option === "HIGH_TO_LOW"){
                    return "Highest Rate";
                }
                if(option === "LOW_TO_HIGH"){
                    return "Lowest Rate";
                }
                return "Alphabetical";
            };

            $scope.ratesDisplayed = [];

            $scope.showCalendarView = function() {
                $scope.displayMode = "CALENDAR";
            };

            $scope.showGraphView = function() {
                $scope.displayMode = "GRAPH";
            };

            $scope.showRatesBtnClicked = function() {
                $scope.toggleLeftMenu();
                $scope.$broadcast("showRatesBtnClicked");
                $scope.$broadcast("updateRateCalendar");
                $scope.$broadcast("updateOccupancyGraph");

            };
            /**
             * Click handler for back button from room type calendar view
             */
            $scope.backButtonClicked = function() {
                $scope.backbuttonEnabled = false;
                $scope.displayMode = "CALENDAR";
                angular.copy($scope.currentFilterData.rates_selected_list, $scope.ratesDisplayed);
                $scope.$broadcast("setCalendarModeRateType");
            };

            $scope.$on("enableBackbutton", function() {
                $scope.backbuttonEnabled = true;
            });


            /**
             * function to handle left side menu toggling
             */
            $scope.toggleLeftMenu = function() {
                if ($scope.currentLeftMenuClass === 'slide_right') {
                    $scope.currentLeftMenuClass = 'slide_left';
                } else {
                    $scope.currentLeftMenuClass = 'slide_right';
                }
            };

            /*
             * function to handle click
             */

            $scope.rateManagerContentClick = function($event) {

                $scope.$broadcast('closeFilterPopup');
            };

            $scope.$on('resize', function(e, wDim) {
                computeColWidthOnResize();
            });
        }
    ]);
